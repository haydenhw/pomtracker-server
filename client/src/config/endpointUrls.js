const localServer = 'http://localhost:3004';
const cloudServer = 'https://lula.wtf/pomtracker';
const baseUrl = process.env.NODE_ENV === 'production' ? cloudServer : localServer;
export const projectsUrl = `${baseUrl}/projects`;
export const loginUrl = `${baseUrl}/auth/login`;
export const userUrl = `${baseUrl}/users`;


export const baseUrl2 = 'http://localhost:8000/api'
export const projectsUrl2 = `${baseUrl2}/projects`;
export const tasksUrl = `${baseUrl2}/tasks`;
