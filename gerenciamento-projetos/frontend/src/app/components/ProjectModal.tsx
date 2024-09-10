import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Autocomplete, List, ListItem, ListItemText, IconButton } from '@mui/material';
import axios from 'axios';
import { Project } from '../types/Project';
import { User } from '../types/User';
import { Delete } from '@mui/icons-material';

interface ProjectModalProps {
    open: boolean;
    handleClose: () => void;
    project: Project | null;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProjectModal: React.FC<ProjectModalProps> = ({ open, handleClose, project }) => {
    const [nome, setNome] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [projectUsers, setProjectUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
        if (project) {
            setNome(project.nome);
            setDescricao(project.descricao);
            setDataInicio(new Date(project.data_inicio).toISOString().split('T')[0]);
            setDataFim(new Date(project.data_fim).toISOString().split('T')[0]);
            setStatus(project.status);
            fetchProjectUsers(project._id);
        } else {
            setNome('');
            setDescricao('');
            setDataInicio('');
            setDataFim('');
            setStatus('');
            setProjectUsers([]);
        }
    }, [project]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>('http://localhost:3000/api/auth/users');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchProjectUsers = async (projectId: string) => {
        try {
            const response = await axios.get<User[]>(`http://localhost:3000/api/projects/${projectId}/usuarios`);
            setProjectUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch project users:', error);
        }
    };

    const handleAddUser = async () => {
        if (selectedUser && project) {
            try {
                await axios.post('http://localhost:3000/api/projects/addUser', {
                    projetoId: project._id,
                    userId: selectedUser._id,
                });
                fetchProjectUsers(project._id);
            } catch (error) {
                console.error('Failed to add user to project:', error);
            }
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (project) {
            try {
                await axios.post('http://localhost:3000/api/projects/removeUser', {
                    projetoId: project._id,
                    userId,
                });
                fetchProjectUsers(project._id);
            } catch (error) {
                console.error('Failed to remove user from project:', error);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                nome,
                descricao,
                data_inicio: new Date(dataInicio).toISOString(),
                data_fim: new Date(dataFim).toISOString(),
                status,
            };

            if (project) {
                await axios.put(`http://localhost:3000/api/projects/${project._id}`, payload);
            } else {
                await axios.post('http://localhost:3000/api/projects', payload);
            }
            handleClose();
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Data de Inicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Data de Encerramento"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />

                <Autocomplete
                    options={allUsers}
                    getOptionLabel={(option) => option.nome}
                    onChange={(event, newValue) => setSelectedUser(newValue)}
                    renderInput={(params) => <TextField {...params} label="Adicionar Usuário" />}
                    sx={{ marginY: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddUser} disabled={!selectedUser}>
                    Adicionar Usuário ao Projeto
                </Button>

                <List>
                    {projectUsers.map((user) => (
                        <ListItem
                            key={user._id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveUser(user._id)}>
                                    <Delete />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={user.nome} secondary={user.email} />
                        </ListItem>
                    ))}
                </List>

                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
                    {project ? 'Update Project' : 'Add Project'}
                </Button>
            </Box>
        </Modal>
    );
};

export default ProjectModal;
