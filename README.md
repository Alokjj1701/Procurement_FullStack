# Procurement Hackathon Project

A full-stack procurement management system built with React and Spring Boot.

## Project Structure
- `my-procurement-frontend/`: React frontend application
- `procurement-backend/`: Spring Boot backend application

## Prerequisites
- Node.js (v14 or higher)
- Java 17 or higher
- Maven
- SQLite

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd procurement-backend
   ```
2. Create a `.env` file based on `.env.example`
3. Install dependencies:
   ```bash
   mvn install
   ```
4. Start the backend server:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd my-procurement-frontend
   ```
2. Create a `.env` file based on `.env.example`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

### Backend (.env)
```
DB_PASSWORD=your_database_password
AZURE_OPENAI_KEY=your_azure_openai_key
JWT_SECRET=your_jwt_secret
AZURE_BOT_PASSWORD=your_azure_bot_password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
```

## Features
- User Authentication
- Request Management
- Task Tracking
- Analytics Dashboard
- Chatbot Integration

## API Documentation
The backend API is available at `http://localhost:8080/api`

### Authentication Endpoints
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Request Endpoints
- GET `/api/requests` - Get all requests
- POST `/api/requests` - Create new request
- PUT `/api/requests/{id}` - Update request
- DELETE `/api/requests/{id}` - Delete request

## Development
- Frontend runs on port 3000
- Backend runs on port 8080
- API documentation available at `/swagger-ui.html`

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. 