import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef, GridRowsProp, GridRowParams } from '@mui/x-data-grid';
import axios from 'axios';
import { User } from '../../types/User';
import UserModal from './UserModal';
import { toast } from 'react-toastify';


interface IUserTable {
    buttonShow?: boolean
}

const UserTable: React.FC <IUserTable> = ({buttonShow = true }) =>  {
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
            const response = await axios.delete(`http://localhost:3000/api/auth/users/${userId}`);
            console.log(response)
            fetchUsers();
            toast.success('Usuário excluído com sucesso!');
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Falha ao excluir o usuário!';
            console.error('Failed to delete the user:', errorMessage);
            toast.error(errorMessage);
        }
    }

    const handleFilterChange = () => {
        setPage(0);
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
                {buttonShow &&(
                 <Button sx={{ mb: 4 }} variant="contained" onClick={handleFilterChange}>Add Usuario</Button>
                )}
                <Box sx={{ width: '60vw', display: 'flex', gap: 2, mb: 2 }}>
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
                    getRowId={(row) => row._id} 
                />
            </Box>
            <UserModal
                open={open}
                handleClose={() => {setOpen(false), fetchUsers()}}
                user={selectedUser}
                fetchUsers={fetchUsers}
            />
        </>
    );
};

export default UserTable;
