const express = require('express');
const server = express();

server.use(express.json());

const projects = [];
let requestCount = 0;

server.use(function(req, res, next) {
  requestCount++;
  console.log(requestCount);
  return next();
});

function checkProjectId(req, res, next) {
  const { id } = req.params;

  if (!projects.find(p => p.id == id)) {
    return res.status(400).json({ error: `Not found project with id: ${id}` });
  }
  return next();
}

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({
    id,
    title,
    tasks
  });

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;
  return res.json(projects);
});

server.delete('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);
  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.send(projects);
});

server.listen(3000);
