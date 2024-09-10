export interface User {
    _id: string;
    nome: string;
    email: string;
    senha?: string; 
    papel: string;
    __v?: number; 
}