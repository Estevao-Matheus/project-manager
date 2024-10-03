import axios from 'axios';
import { User } from '@/app/types/User';

interface PaginatedUsersResponse {
    users: User[];
    totalUsers: number;
}

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>('http://localhost:3000/api/auth/users');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
};

export const fetchPaginatedUsers = async (
    page: number,
    rowsPerPage: number,
    filterNome?: string,
    filterPapel?: string
): Promise<PaginatedUsersResponse> => {
    try {
        const response = await axios.get<PaginatedUsersResponse>('http://localhost:3000/api/auth/users/paginated', {
            params: {
                page: page + 1,
                limit: rowsPerPage,
                nome: filterNome,
                papel: filterPapel
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch paginated users:', error);
        throw error;
    }
};