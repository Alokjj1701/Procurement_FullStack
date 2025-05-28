import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import RequestGrid from '../components/dashboard/RequestGrid';
import MyTasksGrid from '../components/dashboard/MyTasksGrid';
import TaskCharts from '../components/dashboard/TaskCharts';
import ChatWidget from '../components/chat/ChatWidget';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            My Tasks
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 4, 
              flexDirection: { xs: 'column', md: 'row' },
              '& > *': { minHeight: '350px' }
            }}
          >
            <Box sx={{ flex: '0 0 65%' }}>
              <MyTasksGrid />
            </Box>
            <Box sx={{ flex: '0 0 35%' }}>
              <TaskCharts />
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            All Requests
          </Typography>
          <RequestGrid />
        </Box>
      </Container>
      <ChatWidget />
    </DashboardLayout>
  );
};

export default Dashboard; 