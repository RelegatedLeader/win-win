import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/home.css";

export default function Notetaking() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [taskCash, setTaskCash] = useState(0);
  const [cash, setCash] = useState(0);

  const navigate = useNavigate();

  // Buffer to store deleted tasks
  const storeDeletedTasks = (task) => {
    const buffer = JSON.parse(localStorage.getItem("deletedTasks")) || [];
    buffer.push(task);
    localStorage.setItem("deletedTasks", JSON.stringify(buffer));
  };

  const getDeletedTasks = () =>
    JSON.parse(localStorage.getItem("deletedTasks")) || [];

  const clearBuffer = () => localStorage.removeItem("deletedTasks");

  const handleShowNotes = () => {
    const userHash = prompt("Enter your hash to access saved notes:");
    if (userHash) {
      navigate(`/show_notes/${userHash}`);
    } else {
      alert("Hash is required to view notes.");
    }
  };

  const generateHash = () => Math.random().toString(36).substring(2, 15);

  const saveListToDatabase = async (hash, name, tasks) => {
    try {
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/save-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash,
          name,
          tasks,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save the list.");
      }

      alert(`List saved successfully! Your access hash: ${hash}`);
    } catch (error) {
      console.error("Error saving list:", error);
      alert("An error occurred while saving the list.");
    }
  };

  const handleSavePrompt = async () => {
    const bufferTasks = getDeletedTasks();
    if (bufferTasks.length === 0) {
      alert("No tasks to save.");
      return;
    }

    const confirmSave = window.confirm(
      "Are you sure you want to save this list? This action cannot be undone."
    );
    if (!confirmSave) return;

    const hasHash = window.confirm(
      "Do you already have a unique hash for your lists? (Click Cancel to generate a new one)"
    );

    let hash;
    if (hasHash) {
      hash = prompt("Enter your existing hash:");
      if (!hash) {
        alert("Hash is required to save the list.");
        return;
      }
    } else {
      hash = generateHash();
      alert(`Your new hash: ${hash}`);
    }

    const name = prompt("Enter a unique name for this list:");
    if (!name || name.trim() === "") {
      alert("List name is required.");
      return;
    }

    await saveListToDatabase(hash, name, bufferTasks);

    // Clear tasks and reset states
    clearBuffer();
    setTasks([]);
    setCash(0);
    setInput("");
    setTaskCash(0);
  };

  const addTask = () => {
    if (input.trim() && taskCash > 0) {
      setTasks([...tasks, { task: input, value: taskCash }]);
      setInput("");
      setTaskCash(0);
    }
  };

  const deleteTask = (index) => {
    const deletedTask = tasks[index];
    setCash(cash + deletedTask.value);
    storeDeletedTasks(deletedTask);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "black" }}
    >
      <div
        className="container bg-light border border-dark rounded p-4"
        style={{
          maxWidth: "600px",
          fontFamily: "'Courier New', monospace",
          boxShadow: "5px 5px 15px rgba(0,0,0,0.5)",
        }}
      >
        <h1 className="text-center" style={{ color: "black" }}>
          Total Cash: <span className="text-dark">$ {cash}</span>
        </h1>

        <div className="mb-4">
          <div className="input-group mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control border border-dark"
              placeholder="Add a task..."
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              value={taskCash}
              onChange={(e) => setTaskCash(Number(e.target.value))}
              className="form-control border border-dark"
              placeholder="Add task value..."
            />
          </div>
          <button
            className="btn btn-dark w-100 border border-light"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>

        <ul className="list-group mb-3">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center bg-warning border border-dark"
            >
              <span>
                {task.task} - <b>$ {task.value}</b>
              </span>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => deleteTask(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSavePrompt}
          className="btn btn-danger w-100 border border-dark"
        >
          Clear All / Save List
        </button>

        <button
          onClick={handleShowNotes}
          className="btn btn-info w-100 border border-dark mt-3"
        >
          Show Saved Notes
        </button>
      </div>
    </div>
  );
}
