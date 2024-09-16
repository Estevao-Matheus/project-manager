'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, TextField, IconButton, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProjectModal from './ProjectModal';
import DeleteModal from './DeleteModal';
import { Project } from '../types/Project';
import { User } from '../types/User';
import { toast } from 'react-toastify';
import { formatDateFromServer } from '../Helpers/dateHelpers';

const ProjectTable: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [filters, setFilters] = useState({
        nome: '',
        dataInicio: '',
        dataFim: '',
        status: ''
    });

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [projects, filters]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get<Project[]>('http://localhost:3000/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>('http://localhost:3000/api/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...projects];

        if (filters.nome) {
            filtered = filtered.filter((project) =>
                project.nome.toLowerCase().includes(filters.nome.toLowerCase())
            );
        }

        if (filters.dataInicio) {
            filtered = filtered.filter((project) =>
                new Date(project.data_inicio).toLocaleDateString('pt-BR') === new Date(filters.dataInicio).toLocaleDateString('pt-BR')
            );
        }

        if (filters.dataFim) {
            filtered = filtered.filter((project) =>
                new Date(project.data_fim).toLocaleDateString('pt-BR') === new Date(filters.dataFim).toLocaleDateString('pt-BR')
            );
        }

        if (filters.status) {
            filtered = filtered.filter((project) =>
                project.status.toLowerCase() === filters.status.toLowerCase()
            );
        }

        setFilteredProjects(filtered);
    };

    const handleAddProject = () => {
        setSelectedProject(null);
        setOpen(true);
    };

    const handleEditProject = (project: Project) => {
        setSelectedProject(project);
        setOpen(true);
    };

    const handleDeleteProject = async () => {
        if (projectToDelete) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/projects/${projectToDelete._id}`);
                toast.success(response.data.message || 'Projeto excluído com sucesso!');
                fetchProjects();
                setOpenDeleteModal(false);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Falha ao excluir o projeto!';
                console.error('Failed to delete the project:', errorMessage);
                toast.error(errorMessage);
                setOpenDeleteModal(false);
            }
        }
    };

    const handleOpenDeleteModal = (project: Project) => {
        setProjectToDelete(project);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setProjectToDelete(null);
    };

    const handleModalClose = () => {
        setOpen(false);
        fetchProjects();
    };


    const columns: GridColDef[] = [
        { field: 'nome', headerName: 'Nome', flex: 1 },
        { field: 'descricao', headerName: 'Descrição', flex: 1 },
        { field: 'data_inicio', headerName: 'Data Início', flex: 1 },
        { field: 'data_fim', headerName: 'Data Fim', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'acoes',
            headerName: 'Ações',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleEditProject(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteModal(params.row)}>
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ padding: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddProject} style={{ marginBottom: 16 }}>
                Add Projeto
            </Button>
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Nome"
                    variant="outlined"
                    value={filters.nome}
                    onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
                />
                <TextField
                    label="Data Início"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                />
                <TextField
                    label="Data Encerramento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                />
                <TextField
                    select
                    label="Status"
                    variant="outlined"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    style={{ width: 200 }}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Em andamento">Em andamento</MenuItem>
                    <MenuItem value="Concluído">Concluído</MenuItem>
                    <MenuItem value="Pendente">Pendente</MenuItem>
                </TextField>
            </Box>
            <Box sx={{ width: '60vw' }}>
                <DataGrid
                    rows={filteredProjects}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row._id}
                    autoHeight
                />
            </Box>
            <ProjectModal open={open} handleClose={handleModalClose} project={selectedProject} allUsers={users} />
            <DeleteModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteProject}
                projectName={projectToDelete?.nome || ''}
            />
        </Box>
    );
};

export default ProjectTable;
