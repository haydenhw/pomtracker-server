export const localServer = 'http://localhost:8000/api'
const cloudServer = 'https://lula.wtf/pomtracker';
const baseUrl = process.env.NODE_ENV === 'production' ? cloudServer : localServer;
export const projectsUrl = `${baseUrl}/projects`;
export const tasksUrl = `${baseUrl}/tasks`;
export const loginUrl = `${baseUrl}/auth/login`;
export const userUrl = `${baseUrl}/users`;
