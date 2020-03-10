const localServer = 'http://localhost:3004';
const cloudServer = 'https://lula.wtf/pomtracker';
const baseUrl = process.env.NODE_ENV === 'production' ? cloudServer : localServer;
export const projectsUrl = `${baseUrl}/projects`;
export const loginUrl = `${baseUrl}/auth/login`;
export const userUrl = `${baseUrl}/users`;
