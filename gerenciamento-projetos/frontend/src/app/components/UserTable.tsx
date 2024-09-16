import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef, GridRowsProp, GridRowParams } from '@mui/x-data-grid';
import axios from 'axios';
import { User } from '../types/User';
import UserModal from './UserModal';

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [filterNome, setFilterNome] = useState<string>('');
    const [filterPapel, setFilterPapel] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, filterNome, filterPapel]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/auth/users/paginated', {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    nome: filterNome,
                    papel: filterPapel
                }
            });
            setUsers(response.data.users);
            setTotalUsers(response.data.totalUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDelete = async (userId: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/auth/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleFilterChange = () => {
        setPage(0); // Reset to first page on filter change
        fetchUsers();
    };

    const columns: GridColDef[] = [
        { field: 'nome', headerName: 'Nome', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'papel', headerName: 'Papel', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleEdit(params.row as User)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Nome"
                        value={filterNome}
                        onChange={(e) => setFilterNome(e.target.value)}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Papel</InputLabel>
                        <Select
                            value={filterPapel}
                            onChange={(e) => setFilterPapel(e.target.value as string)}
                            label="Papel"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Desenvolvedor">Desenvolvedor</MenuItem>
                            <MenuItem value="Administrador">Administrador</MenuItem>
                            <MenuItem value="Usuário">Usuário</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleFilterChange}>Add Usuario</Button>
                </Box>
            </Box>
            <Box sx={{ width: '60vw' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pagination
                    pageSize={rowsPerPage}
                    rowCount={totalUsers}
                    paginationMode="server"
                    onPageSizeChange={handleRowsPerPageChange}
                    onPageChange={handlePageChange}
                    getRowId={(row) => row._id} // Ensure each row has a unique ID
                />
            </Box>
            <UserModal
                open={open}
                handleClose={() => setOpen(false)}
                user={selectedUser}
                fetchUsers={fetchUsers}
            />
        </>
    );
};

export default UserTable;
