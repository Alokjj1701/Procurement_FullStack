import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  TablePagination,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

type Priority = 'High' | 'Medium' | 'Low';
type PriorityColor = 'error' | 'warning' | 'success';

const priorityColors: Record<Priority, PriorityColor> = {
  'High': 'error',
  'Medium': 'warning',
  'Low': 'success'
};

interface Task {
  id: number;
  requestedBy: string;
  quantity: number;
  status: string;
  justification: string;
  department: string;
  priority: Priority;
  product: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
  };
}

const MyTasksGrid: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/requests?assignedTo=me');
        console.log('Fetched tasks:', response.data); // Debug log
        setTasks(response.data);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError(err.response?.data?.message || 'Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          maxWidth: '100%',
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            whiteSpace: 'nowrap',
            px: 1,
            fontSize: '0.875rem'
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontWeight: 'bold',
            backgroundColor: 'background.paper'
          }
        }}
      >
        <Table sx={{ flex: 1 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width="8%">ID</TableCell>
              <TableCell width="15%">Description</TableCell>
              <TableCell width="12%">Product</TableCell>
              <TableCell width="8%">Qty</TableCell>
              <TableCell width="10%">Requester</TableCell>
              <TableCell width="10%">Department</TableCell>
              <TableCell width="8%">Priority</TableCell>
              <TableCell width="10%">Status</TableCell>
              <TableCell width="10%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{`REQ-${task.id}`}</TableCell>
                  <TableCell>{task.justification}</TableCell>
                  <TableCell>{task.product?.name || 'N/A'}</TableCell>
                  <TableCell>{task.quantity}</TableCell>
                  <TableCell>{task.requestedBy.split('@')[0]}</TableCell>
                  <TableCell>{task.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority}
                      color={priorityColors[task.priority]}
                      size="small"
                      sx={{ height: 24, minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status}
                      color={task.status === 'Pending' ? 'warning' : task.status === 'Approved' ? 'success' : 'error'}
                      size="small"
                      sx={{ height: 24, minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          size="small"
        />
      </TableContainer>
    </Box>
  );
};

export default MyTasksGrid; 