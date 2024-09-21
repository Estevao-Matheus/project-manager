// components/CalendarWithSidebar.tsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // Import do componente React do FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { tokens } from '../../theme'
import axios from 'axios';
import { Project } from '@/app/types/Project';
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, useTheme } from '@mui/material';

const CalendarWithSidebar: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>('http://localhost:3000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao buscar projetos', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Grid container spacing={2}>
      {/* Sidebar com a lista de projetos */}
      <Grid item xs={12} md={3}>
        <Paper elevation={3} sx={{ backgroundColor: colors.primary[400], padding: 2, height: '90vh', overflowY: 'auto' }}>
          <Typography variant="h6">Projetos</Typography>
          <List>
            {projects.map((project) => (
              <ListItem key={project.nome} sx={{ backgroundColor: colors.greenAccent[500], mb: 1 }}>
                <ListItemText
                  primary={project.nome}
                  secondary={`Início: ${new Date(project.data_inicio).toLocaleDateString()} - Fim: ${new Date(project.data_fim).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Calendário utilizando FullCalendar React */}
      <Grid item xs={12} md={8.7}>
       
          <Box sx={{mb:4}}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Calendário
            </Typography>
            {/* Componente FullCalendar */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              locale="pt-br"
              events={projects.map((project) => ({
                title: project.nome,
                start: project.data_inicio,
                end: project.data_fim,
              }))}
              height="90vh" // Define a altura do calendário
            />
          </Box>
       
      </Grid>
    </Grid>
  );
};

export default CalendarWithSidebar;
