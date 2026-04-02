import { createServer } from 'http';
import { spawn } from 'child_process';

console.log('Starting Next.js server...');

const server = spawn('bun', ['x', 'next', 'dev', '-p', '3000'], {
    cwd: '/home/z/my-project',
    stdio: 'inherit',
    shell: true
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
});

server.on('exit', (code) => {
    console.log('Server exited with code:', code);
});

// Keep process alive
process.stdin.resume();
