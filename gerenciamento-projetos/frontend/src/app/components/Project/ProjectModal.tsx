import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Autocomplete, useMediaQuery, useTheme, Chip, Typography, responsiveFontSizes } from '@mui/material';
import axios from 'axios';
import { Project } from '../../types/Project';
import { User } from '../../types/User'; 
import { toast } from 'react-toastify';

interface ProjectModalProps {
    open: boolean;
    handleClose: () => void;
    project: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ open, handleClose, project }) => {
    const [nome, setNome] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [userOptions, setUserOptions] = useState<User[]>([]);

    // Validation states
    const [nomeError, setNomeError] = useState<string>('');
    const [descricaoError, setDescricaoError] = useState<string>('');
    const [dataInicioError, setDataInicioError] = useState<string>('');
    const [dataFimError, setDataFimError] = useState<string>('');
    const [statusError, setStatusError] = useState<string>('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (project) {
            setNome(project.nome);
            setDescricao(project.descricao);
            setDataInicio(new Date(project.data_inicio).toISOString().split('T')[0]);
            setDataFim(new Date(project.data_fim).toISOString().split('T')[0]);
            setStatus(project.status);
            fetchProjectUsers(project._id);
        } else {
            resetFields();
        }
    }, [project]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get<User[]>('http://localhost:3000/api/auth/users');
            setUserOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchProjectUsers = async (projectId: string) => {
        try {
            const response = await axios.get<User[]>(`http://localhost:3000/api/projects/${projectId}/usuarios`);
            setSelectedUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch project users:', error);
        }
    };

    const handleAddUser = async (user: User) => {
        if (project) {
            try {
                await axios.post('http://localhost:3000/api/projects/addUser', {
                    projetoId: project._id,
                    userId: user._id,
                });
                fetchProjectUsers(project._id);
            } catch (error) {
                console.error('Failed to add user:', error);
            }
        }
    };

    const handleRemoveUser = async (user: User) => {
        if (project) {
            try {
                await axios.post('http://localhost:3000/api/projects/removeUser', {
                    projetoId: project._id,
                    userId: user._id,
                });
                fetchProjectUsers(project._id);
            } catch (error) {
                console.error('Failed to remove user:', error);
            }
        }
    };

    const validateFields = () => {
        let valid = true;

        if (!nome.trim()) {
            setNomeError('Nome é obrigatório');
            valid = false;
        }

        if (!descricao.trim()) {
            setDescricaoError('Descrição é obrigatória');
            valid = false;
        }

        if (!dataInicio.trim()) {
            setDataInicioError('Data de Início é obrigatória');
            valid = false;
        }

        if (!dataFim.trim()) {
            setDataFimError('Data de Encerramento é obrigatória');
            valid = false;
        }

        if (!status.trim()) {
            setStatusError('Status é obrigatório');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
        const payload = {
            nome,
            descricao,
            data_inicio: new Date(dataInicio).toISOString(),
            data_fim: new Date(dataFim).toISOString(),
            status,
        };

        if (project) {
            const response = await axios.put(`http://localhost:3000/api/projects/${project._id}`, payload);
            toast.success( response.data.message || 'Projeto atualizado com sucesso!');
        } else {
           const response = await axios.post('http://localhost:3000/api/projects', payload);
            toast.success( response.data.message ||'Projeto adicionado com sucesso!');
        }
        handleClose();
    } catch (error) {
            const errorMessage = error.response?.data?.message || 'Falha ao excluir o projeto!';
            console.error('Failed to delete the project:', errorMessage);
            toast.error(errorMessage);
        }
};

    const resetFields = () => {
        setNome('');
        setDescricao('');
        setDataInicio('');
        setDataFim('');
        setStatus('');
        setSelectedUsers([]);
        resetValidationErrors();
    };

    const resetValidationErrors = () => {
        setNomeError('');
        setDescricaoError('');
        setDataInicioError('');
        setDataFimError('');
        setStatusError('');
    };

    const handleCloseModal = () => {
        resetFields();
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleCloseModal} aria-labelledby="modal-title">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isSmallScreen ? '90%' : 600,
                    maxWidth: '90%',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" color='#36454F' gutterBottom>
                    {project ? 'Editar Projeto' : 'Adicionar Projeto'}
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Nome"
                    value={nome}
                    onChange={(e) => {
                        setNome(e.target.value);
                        if (nomeError) setNomeError('');
                    }}
                    error={!!nomeError}
                    helperText={nomeError}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Descrição"
                    value={descricao}
                    onChange={(e) => {
                        setDescricao(e.target.value);
                        if (descricaoError) setDescricaoError('');
                    }}
                    error={!!descricaoError}
                    helperText={descricaoError}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Data Início"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => {
                        setDataInicio(e.target.value);
                        if (dataInicioError) setDataInicioError('');
                    }}
                    error={!!dataInicioError}
                    helperText={dataInicioError}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Data Encerramento"
                    type="date"
                    value={dataFim}
                    onChange={(e) => {
                        setDataFim(e.target.value);
                        if (dataFimError) setDataFimError('');
                    }}
                    error={!!dataFimError}
                    helperText={dataFimError}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Status"
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        if (statusError) setStatusError('');
                    }}
                    error={!!statusError}
                    helperText={statusError}
                />
                
                <Autocomplete
                    options={userOptions}
                    getOptionLabel={(option) => option.nome}
                    renderInput={(params) => <TextField {...params} label="Adicionar Usuário" />}
                    onChange={(event, value) => {
                        if (value) handleAddUser(value);
                    }}
                />
                
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color='#36454F' gutterBottom>
                        Usuários no Projeto
                    </Typography>
                    {selectedUsers.map(user => (
                        <Chip
                            key={user._id}
                            label={user.nome}
                            onDelete={() => handleRemoveUser(user)}
                            sx={{ m: 0.5 }}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    {project ? 'Atualizar Projeto' : 'Adicionar Projeto'}
                </Button>
            </Box>
        </Modal>
    );
};

export default ProjectModal;
