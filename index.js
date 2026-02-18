const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

let tasks = [];
let currentId = 1;

app.get("/tasks", (req, res) => {
    const { completed } = req.query;

    if (completed !== undefined) {
        if (completed !== "true" && completed !== "false") {
            return res.status(400).json({ message: "Invalid completed value" });
        }

        const completedBool = completed === "true";

        const filtered = tasks.filter(
            task => task.completed === completedBool
        );

        return res.json(filtered);
    }

    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    const newTask = {
        id: currentId++,
        title,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const { title, completed } = req.body;

    if (title !== undefined) task.title = title;

    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            return res.status(400).json({ message: "Completed must be boolean" });
        }
        task.completed = completed;
    }

    res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(index, 1);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
