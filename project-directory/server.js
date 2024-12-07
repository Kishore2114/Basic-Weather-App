const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tasks', (req, res) => {
    fs.readFile('./data/tasks.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading tasks');
        res.json(JSON.parse(data));
    });
});

app.post('/tasks', (req, res) => {
    const newTask = req.body.task;
    if (!newTask) return res.status(400).send('Task content is required');

    fs.readFile('./data/tasks.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading tasks');

        const tasks = JSON.parse(data);
        tasks.push({ id: Date.now(), content: newTask, completed: false });
        fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
            if (err) return res.status(500).send('Error saving tasks');
            res.json(tasks);
        });
    });
});
app.put('/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    fs.readFile('./data/tasks.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading tasks');

        const tasks = JSON.parse(data);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.completed = !task.completed; // Toggle completed status
            fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
                if (err) return res.status(500).send('Error saving tasks');
                res.json(task); // Send back the updated task
            });
        } else {
            res.status(404).send('Task not found');
        }
    });
});


app.delete('/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    fs.readFile('./data/tasks.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading tasks');

        const tasks = JSON.parse(data).filter(task => task.id !== taskId);
        fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
            if (err) return res.status(500).send('Error saving tasks');
            res.json(tasks);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
