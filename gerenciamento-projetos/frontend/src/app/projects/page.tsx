import React from 'react';
import { Box, Typography } from '@mui/material';
import ProjectTable from '../components/TableProjects';

const Projects: React.FC = () => {
    return (
        <Box 
            sx={{
                padding: { xs: 2, sm: 4, md: 6 },
                margin: '0 auto',
                maxWidth: '1200px',
                textAlign: 'center',
            }}
        >
            <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
                    fontWeight: 'bold',
                    color: 'primary.main',
                    marginBottom: 4
                }}
            >
                Gerenciamento de Projetos
            </Typography>
            <ProjectTable />
        </Box>
    );
};

export default Projects;