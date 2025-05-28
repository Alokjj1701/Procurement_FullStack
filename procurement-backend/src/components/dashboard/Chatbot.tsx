import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, TextField, Button, Fade } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: "I'm just a demo bot!" }
      ]);
    }, 700);
    setInput('');
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}>
      {!open && (
        <Fade in={!open}>
          <IconButton
            color="primary"
            size="large"
            sx={{ 
              boxShadow: 4,
              bgcolor: 'white',
              width: 56,
              height: 56,
              '&:hover': {
                bgcolor: 'grey.50',
                transform: 'scale(1.05)',
                transition: 'transform 0.2s'
              }
            }}
            onClick={() => setOpen(true)}
            aria-label="Open chatbot"
          >
            <ChatIcon fontSize="large" />
          </IconButton>
        </Fade>
      )}
      {open && (
        <Fade in={open}>
          <Paper 
            elevation={8} 
            sx={{ 
              width: 380,
              height: 480,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'primary.main',
                color: 'white'
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>Chatbot</Typography>
              <IconButton 
                size="small" 
                onClick={() => setOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box 
              sx={{ 
                flex: 1,
                p: 2,
                overflowY: 'auto',
                bgcolor: 'grey.50',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {messages.map((msg, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                      color: msg.sender === 'user' ? 'white' : 'text.primary',
                      boxShadow: 1,
                      fontSize: 15,
                      lineHeight: 1.5
                    }}
                  >
                    {msg.text}
                  </Box>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>
            <Box 
              sx={{ 
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 1,
                bgcolor: 'white'
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSend} 
                disabled={!input.trim()}
                sx={{ 
                  borderRadius: 2,
                  px: 3
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Chatbot; 