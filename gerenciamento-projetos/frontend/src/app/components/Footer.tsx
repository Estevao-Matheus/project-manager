import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Footer() {
  return (
    <>
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: '#1E90FF',  // Black background
        color: 'white',  // White text color
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="body1" 
          align="center"
          sx={{ 
            mb: 2,
            color: 'white',  
          }}
        >
           App de Gestão de Projetos - Sua solução simples para gerenciar projetos de forma eficiente.
        </Typography>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            mb: 2,
            color: 'white',
          }}
        >
          <Link href="#" color="inherit" underline="hover">
            Sobre nós
          </Link> | 
          <Link href="#" color="inherit" underline="hover">
            Contato
          </Link> | 
          <Link href="#" color="inherit" underline="hover">
            FAQ
          </Link>
        </Typography>
      </Container>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#36454F', p:1 }}>
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            color: 'white',
          }}
        >
          © {new Date().getFullYear()} Bootcamp Manage
        </Typography>
    </Box>
    </>
  );
}

export default Footer;
