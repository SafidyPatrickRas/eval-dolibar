#!/usr/bin/env node
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
// Simple CORS allow for local dev frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
const port = process.env.PORT || 4000;
const SCRIPT = path.resolve(__dirname, 'reset_all.sh');

app.use(express.json());

let busy = false;
app.post('/reset', (req, res) => {
  if (busy) {
    res.status(409).send('Reset already in progress');
    return;
  }
  busy = true;

  // Optionally accept body { docker: true/false, user, db }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');
  // ensure headers are sent so client can stream
  res.flushHeaders();

  const env = Object.assign({}, process.env);
  if (req.body && req.body.password) env.MYSQL_PWD = req.body.password;
  // If no password provided, default to 'glpi' for local dev/demo environment
  if (!env.MYSQL_PWD) {
    env.MYSQL_PWD = 'glpi';
    res.write('Using default DB password from server env\n');
  }

  const child = spawn(SCRIPT, ['--yes'], { env });

  // pipe stdout/stderr to response (do not end on pipe end)
  child.stdout.pipe(res, { end: false });
  child.stderr.pipe(res, { end: false });

  // handle client disconnect: log but do not kill child so reset can finish server-side
  let clientDisconnected = false;
  const onClose = () => {
    clientDisconnected = true;
    console.log('Client connection closed early; leaving child process to finish.');
  };
  req.on('close', onClose);

  child.on('close', (code, signal) => {
    let msg;
    if (code !== null) msg = `Process exited with code ${code}`;
    else msg = `Process terminated by signal ${signal || 'unknown'}`;
    // log server-side
    console.log(msg + (clientDisconnected ? ' (client had disconnected)' : ''));
    // try to write to response if still open
    try {
      if (!res.headersSent) res.write('\n');
      res.write(`\n${msg}\n`);
      res.end();
    } catch (e) {
      // client already disconnected; nothing to do
    }
    busy = false;
    req.off('close', onClose);
  });

  child.on('error', (err) => {
    try { res.status(500).end(String(err)); } catch (e) {}
    busy = false;
    req.off('close', onClose);
  });
});

app.listen(port, () => console.log(`Reset API listening on http://localhost:${port}`));
