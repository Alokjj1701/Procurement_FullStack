package com.procurehackathon.service;

import com.procurehackathon.dto.LoginRequest;
import com.procurehackathon.dto.LoginResponse;
import com.procurehackathon.entity.User;
import com.procurehackathon.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public LoginResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() || 
            request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            logger.warn("Login attempt with empty email or password");
            throw new IllegalArgumentException("Email and password are required");
        }

        try {
            logger.info("Attempting login for email: {}", request.getEmail());
            
            // Find user
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login attempt with non-existent email: {}", request.getEmail());
                    return new RuntimeException("Invalid email or password");
                });

            logger.info("User found, comparing passwords");
            
            // Simple string comparison for password
            if (!request.getPassword().equals(user.getPassword())) {
                logger.warn("Invalid password attempt for user: {}", request.getEmail());
                throw new RuntimeException("Invalid email or password");
            }

            logger.info("Password verified, generating token");
            
            // Generate JWT token
            String token = generateToken(user);

            logger.info("Successful login for user: {}", user.getEmail());

            return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .token(token)
                .build();

        } catch (IllegalArgumentException e) {
            logger.error("Validation error during login: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during login: {}", e.getMessage(), e);
            throw new RuntimeException("An error occurred during login. Please try again.");
        }
    }

    private String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
            .setSubject(String.valueOf(user.getId()))
            .claim("email", user.getEmail())
            .claim("role", user.getRole().name())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key)
            .compact();
    }
} 