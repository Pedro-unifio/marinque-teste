const test = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Servidor não iniciou em tempo hábil. Saída: ${output}`));
    }, 8000);

    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
      if (output.includes('Running on')) {
        clearTimeout(timer);
        resolve(child);
      }
    });

    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });
  });
}

test('GET /produtos retorna a lista de produtos', async (t) => {
  const child = await startServer();

  t.after(() => child.kill('SIGTERM'));

  const res = await fetch('http://127.0.0.1:3000/produtos');
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 2);
});

test('POST /produtos cria um produto novo', async (t) => {
  const child = await startServer();

  t.after(() => child.kill('SIGTERM'));

  const res = await fetch('http://127.0.0.1:3000/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'teclado', preco: 250 })
  });

  const body = await res.json();

  assert.equal(res.status, 201);
  assert.equal(body.nome, 'teclado');
  assert.equal(body.preco, 250);
});
