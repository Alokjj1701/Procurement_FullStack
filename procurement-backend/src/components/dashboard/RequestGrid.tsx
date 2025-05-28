import React, { useState, useEffect } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  TablePagination,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Review';

interface Request {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
  };
  quantity: number;
  status: RequestStatus;
  requestedBy: string;
  date: string;
  department: string;
  priority: string;
  totalAmount: number;
  supplier: string;
  justification: string;
}

const statusColors: Record<RequestStatus, 'warning' | 'success' | 'error' | 'info'> = {
  'Pending': 'warning',
  'Approved': 'success',
  'Rejected': 'error',
  'In Review': 'info'
} as const;

const RequestGrid: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/requests');
      console.log('Fetched requests:', response.data); // Debug log
      const requestsWithUserName = response.data.map((request: Request) => ({
        ...request,
        requestedBy: request.requestedBy.split('@')[0] // Display name instead of email
      }));
      setRequests(requestsWithUserName);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'Failed to load requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || request.department === departmentFilter;
    const matchesPriority = priorityFilter === 'All' || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDepartmentFilter('All');
    setPriorityFilter('All');
    setPage(0);
    fetchRequests();
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
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 0.5, 
        mb: 1, 
        alignItems: 'center',
        p: 0.5,
        bgcolor: 'background.paper',
        borderRadius: 0.5,
        boxShadow: 1
      }}>
        <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 0.5 }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'All')}
              sx={{ borderRadius: 0.5 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="In Review">In Review</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
          <FormControl fullWidth size="small">
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              label="Department"
              onChange={(e) => setDepartmentFilter(e.target.value)}
              sx={{ borderRadius: 0.5 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
              sx={{ borderRadius: 0.5 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={handleRefresh} 
              color="primary" 
              size="small"
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 1,
          borderRadius: 0.5,
          overflow: 'hidden'
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Requested By</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: 500, py: 1, px: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.product.name}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status}
                      color={statusColors[request.status]}
                      size="small"
                      sx={{ height: 24, minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.priority}
                      color={request.priority === 'High' ? 'error' : request.priority === 'Medium' ? 'warning' : 'success'}
                      size="small"
                      sx={{ height: 24, minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>${request.totalAmount}</TableCell>
                  <TableCell>{request.supplier}</TableCell>
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
                      {request.status === 'Approved' && (
                        <Tooltip title="Approved">
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: 'success.main',
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {request.status === 'Rejected' && (
                        <Tooltip title="Rejected">
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRequests.length}
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

export default RequestGrid; 