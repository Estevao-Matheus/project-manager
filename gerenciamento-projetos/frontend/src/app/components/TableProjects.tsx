'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProjectModal from './ProjectModal';
import DeleteModal from './DeleteModal';
import { Project } from '../types/Project';
import { User } from '../types/User';

const ProjectTable: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

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

     const fetchProjectUsers = async (projectId: string) => {
        try {
            const response = await axios.get<User[]>(`http://localhost:3000/api/projects/${projectId}/usuarios`);
            return response.data.map(user => user.nome).join(', ');
        } catch (error) {
            console.error('Failed to fetch project users:', error);
            return '';
        }
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
                await axios.delete(`http://localhost:3000/api/projects/${projectToDelete._id}`);
                fetchProjects(); 
                setOpenDeleteModal(false);
            } catch (error) {
                console.error('Failed to delete the project:', error);
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

    return (
        <Box sx={{ padding: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddProject} style={{ margin: 16 }}>
                Add Projeto
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Data Inicio</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Data Encerramento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project._id}>
                                <TableCell>{project.nome}</TableCell>
                                <TableCell>{project.descricao}</TableCell>
                                <TableCell>{new Date(project.data_inicio).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(project.data_fim).toLocaleDateString()}</TableCell>
                                <TableCell>{project.status}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditProject(project)}>
                                        <Edit />
                                    </Button>
                                    <Button onClick={() => handleOpenDeleteModal(project)}>
                                        <Delete />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ProjectModal 
                open={open} 
                handleClose={handleModalClose} 
                project={selectedProject} 
                allUsers={users}
            />
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
