import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Autocomplete, useMediaQuery, useTheme, Typography, responsiveFontSizes } from '@mui/material';
import axios from 'axios';
import { User } from '../types/User'; 
import { toast } from 'react-toastify';

interface UserModalProps {
    open: boolean;
    handleClose: () => void;
    user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ open, handleClose, user }) => {
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [papel, setPapel] = useState<'Desenvolvedor' | 'Administrador' | 'Usuário'>('');
    const [papelOptions, setPapelOptions] = useState<Array<'Desenvolvedor' | 'Administrador' | 'Usuário'>>([
        'Desenvolvedor', 'Administrador', 'Usuário'
    ]);

    // Validation states
    const [nomeError, setNomeError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [senhaError, setSenhaError] = useState<string>('');
    const [papelError, setPapelError] = useState<string>('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (user) {
            setNome(user.nome);
            setEmail(user.email);
            setPapel(user.papel);
        } else {
            resetFields();
        }
    }, [user]);

    const validateFields = () => {
        let valid = true;

        if (!nome.trim()) {
            setNomeError('Nome é obrigatório');
            valid = false;
        }

        if (!email.trim()) {
            setEmailError('Email é obrigatório');
            valid = false;
        }

        if (!senha.trim() && !user) { // Only validate senha if adding a new user
            setSenhaError('Senha é obrigatória');
            valid = false;
        }

        if (!papel.trim()) {
            setPapelError('Papel é obrigatório');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        try {
            const payload = {
                nome,
                email,
                senha,
                papel
            };

            if (user) {
                // Update existing user
                const response = await axios.put(`http://localhost:3000/api/auth/users/${user._id}`, payload);
                toast.success(response.data.message || 'Usuário atualizado com sucesso!');
            } else {
                // Add new user
                const response = await axios.post('http://localhost:3000/api/auth/register', payload);
                toast.success(response.data.message || 'Usuário adicionado com sucesso!');
            }
            handleClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Falha ao salvar o usuário!';
            console.error('Failed to save the user:', errorMessage);
            toast.error(errorMessage);
        }
    };

    const resetFields = () => {
        setNome('');
        setEmail('');
        setSenha('');
        setPapel('');
        resetValidationErrors();
    };

    const resetValidationErrors = () => {
        setNomeError('');
        setEmailError('');
        setSenhaError('');
        setPapelError('');
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
                    {user ? 'Editar Usuário' : 'Adicionar Usuário'}
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
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                    }}
                    error={!!emailError}
                    helperText={emailError}
                />
                {!user && (
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(e) => {
                            setSenha(e.target.value);
                            if (senhaError) setSenhaError('');
                        }}
                        error={!!senhaError}
                        helperText={senhaError}
                    />
                )}
                <Autocomplete
                    options={papelOptions}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label="Papel" />}
                    value={papel}
                    onChange={(event, value) => {
                        setPapel(value || '');
                        if (papelError) setPapelError('');
                    }}
                    isOptionEqualToValue={(option, value) => option === value}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    {user ? 'Atualizar Usuário' : 'Adicionar Usuário'}
                </Button>
            </Box>
        </Modal>
    );
};

export default UserModal;
