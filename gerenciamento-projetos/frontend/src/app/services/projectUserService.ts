import axios from 'axios';
import { User } from '../types/User';

export const fetchProjectUsers = async (projectId: string): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`http://localhost:3000/api/projects/${projectId}/usuarios`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch project users:', error);
        throw error;
    }
};

export const addUserToProject = async (projectId: string, userId: string): Promise<void> => {
    try {
        await axios.post('http://localhost:3000/api/projects/addUser', {
            projetoId: projectId,
            userId: userId,
        });
    } catch (error) {
        console.error('Failed to add user:', error);
        throw error;
    }
};

export const removeUserFromProject = async (projectId: string, userId: string): Promise<void> => {
    try {
        await axios.post('http://localhost:3000/api/projects/removeUser', {
            projetoId: projectId,
            userId: userId,
        });
    } catch (error) {
        console.error('Failed to remove user:', error);
        throw error;
    }
};
