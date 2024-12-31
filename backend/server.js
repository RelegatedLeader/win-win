const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./backend/.env" });

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema and Model
const TaskSchema = new mongoose.Schema({
  hash: String,
  name: { type: String, unique: true },
  date: Date,
  tasks: [
    {
      task: String,
      value: Number,
    },
  ],
});

const TaskList = mongoose.model("TaskList", TaskSchema);

// Route to save or update the list
app.post("/save-list", async (req, res) => {
  const { hash, name, tasks } = req.body;

  console.log("Incoming data for save-list:", { hash, name, tasks });

  try {
    // Check if the hash already exists
    let list = await TaskList.findOne({ hash });

    if (list) {
      list.tasks = [...list.tasks, ...tasks];
      await list.save();
      res.status(200).send({ message: "List updated successfully!" });
    } else {
      const newList = new TaskList({
        hash,
        name,
        date: new Date(),
        tasks,
      });
      await newList.save();
      res.status(201).send({ message: "Task list saved successfully!" });
    }
  } catch (err) {
    console.error("Error saving task list:", err);
    res
      .status(500)
      .send({ error: "Error saving task list", details: err.message });
  }
});

app.get("/get-list/:hash", async (req, res) => {
  const { hash } = req.params;

  try {
    const list = await TaskList.findOne({ hash });
    if (list) {
      res.status(200).send(list);
    } else {
      res.status(404).send({ message: "List not found" });
    }
  } catch (err) {
    console.error("Error retrieving task list:", err);
    res
      .status(500)
      .send({ error: "Error retrieving task list", details: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
