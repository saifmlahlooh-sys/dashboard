import { spawn } from 'child_process';
import { resolve } from 'path';

console.log('Starting Next.js server...');

// run next dev
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'pipe',
  shell: true,
  cwd: process.cwd()
});

let serverReady = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write('[NextJS] ' + output);
  if (output.includes('Ready in') || output.includes('Ready on')) {
    if (!serverReady) {
      serverReady = true;
      console.log('Server is ready! Running tests...');
      runTests();
    }
  }
});

nextProcess.stderr.on('data', (data) => {
  process.stderr.write('[NextJS Error] ' + data.toString());
});

function runTests() {
  const testProcess = spawn('npx', ['tsx', 'test-api.ts'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  testProcess.on('close', (code) => {
    console.log(`Test process exited with code ${code}`);
    nextProcess.kill();
    process.exit(code);
  });
}
