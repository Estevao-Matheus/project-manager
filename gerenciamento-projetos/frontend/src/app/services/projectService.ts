import axios from 'axios';
import { Project } from '../types/Project';


export const fetchProjects = async (filters: {
    page?: string;
    limit?: string;
    nome?: string;
    dataInicio?: string;
    dataFim?: string;
    status?: string;
    userId?: string;
}): Promise<Project[]> => {
    try {
        const query = new URLSearchParams({
            page: filters.page || '1',
            limit: filters.limit || '10',
            nome: filters.nome || '',
            data_inicio: filters.dataInicio || '',
            data_fim: filters.dataFim || '',
            status: filters.status || '',
            user_id: filters.userId || ''
        }).toString();

        const response = await axios.get<Project[]>(`http://localhost:3000/api/projects/paginated?${query}`);
        return response.data.projects;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw error;
    }
};

export const deleteProject = async (projectId: string): Promise<void> => {
    try {
        const response = await axios.delete(`http://localhost:3000/api/projects/${projectId}`);
        return response.data.message;
    } catch (error) {
        console.error('Failed to delete the project:', error);
        throw error;
    }
};