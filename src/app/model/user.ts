import { Role } from './role';

export interface User {
    
    id?: number;
    email: string;
    password: string;
    role: Role;
    token?: string;

}