import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import { requestService } from '../../services/requestService';
import { Request, RequestStatus } from '../../types/request';

const statusColors: Record<RequestStatus, 'warning' | 'success' | 'error' | 'info'> = {
  [RequestStatus.PENDING]: 'warning',
  [RequestStatus.IN_REVIEW]: 'info',
  [RequestStatus.IN_PROGRESS]: 'info',
  [RequestStatus.APPROVED]: 'success',
  [RequestStatus.REJECTED]: 'error'
};

const RequestGrid: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Use test user email for demo
        const data = await requestService.getAllRequests(undefined, 'requester@company.com');
        setRequests(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.justification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || request.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
          <TextField
            fullWidth
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value={RequestStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={RequestStatus.IN_REVIEW}>In Review</MenuItem>
            <MenuItem value={RequestStatus.IN_PROGRESS}>In Progress</MenuItem>
            <MenuItem value={RequestStatus.APPROVED}>Approved</MenuItem>
            <MenuItem value={RequestStatus.REJECTED}>Rejected</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
          <TextField
            fullWidth
            select
            label="Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Procurement">Procurement</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
          <TextField
            fullWidth
            select
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="requests table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.justification}</TableCell>
                <TableCell>{request.product?.name || 'N/A'}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>{request.requestedBy}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.priority}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={statusColors[request.status]}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default RequestGrid; 