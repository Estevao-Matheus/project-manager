'use client';
import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { createTheme, PaletteMode, ThemeProvider, styled } from '@mui/material/styles';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
import { useState } from 'react';
import { redirect } from 'next/navigation';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignUp() {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [roleError, setRoleError] = useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = useState('');
  const [role, setRole] = useState<'Desenvolvedor' | 'Administrador' | 'Usuário'>('');
    const [roleOptions, setRoleOptions] = useState<Array<'Desenvolvedor' | 'Administrador' | 'Usuário'>>([
        'Desenvolvedor', 'Administrador', 'Usuário'
    ]);

  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('por favor, insira um email valido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password deve ter no minimo 6 caracteres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Nome é obrigatório.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        nome: data.get('name'),
        email: data.get('email'),
        senha: data.get('password'),
        papel: role,
      });

      if (response.data.created) {
        toast.success(response.data.msg || 'Usuário criado com sucesso!');
        window.location.replace('/');
      } else if (response.data.errors) {
        Object.keys(response.data.errors).forEach((field) => {
          if (response.data.errors[field]) {
            toast.error(response.data.errors[field]);
          }
        });
      }
    } catch (error) {
      toast.error('Erro ao registrar usuário.');
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    
      
      <Stack sx={{ justifyContent: 'center', height: '100dvh', p: 2 }}>
        <ToastContainer />
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Cadastrar
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Nome Completo</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="role">Papel</FormLabel>
              <Autocomplete
                    id='role'
                    options={roleOptions}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}  placeholder='Desenvolvedor' />}
                    value={role}
                    onChange={(event, value) => {
                        setRole(value || '');
                        if (roleError) setRoleError('');
                    }}
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Cadastrar
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Já Possui uma conta?{' '}
              <span>
                <Link href="/" variant="body2" sx={{ alignSelf: 'center' }}>
                  Login
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider />
        </Card>
      </Stack>
    
  );
}
