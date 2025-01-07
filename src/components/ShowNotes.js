import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ShowNotes() {
  const { hash } = useParams(); // Extract the hash from the URL
  const [notes, setNotes] = useState([]); // State to store notes (array of lists)
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const backendUrl =
          process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Use environment variable
        console.log("Fetching notes for hash:", hash); // Debug log
        const response = await fetch(`${backendUrl}/get-list/${hash}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched notes:", data); // Debug log for notes
          if (Array.isArray(data)) {
            setNotes(data); // Handle array of lists
          } else if (data.tasks && Array.isArray(data.tasks)) {
            setNotes([data]); // Wrap single object in an array
          } else {
            setError("Invalid tasks format received from server.");
          }
        } else {
          console.log("Notes not found for the hash.");
          setError("Notes not found for the provided hash.");
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("An error occurred while fetching notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [hash]);

  // Calculate the total value of all tasks across all lists
  const totalValue = notes.reduce((acc, note) => {
    return (
      acc + note.tasks.reduce((taskAcc, task) => taskAcc + (task.value || 0), 0)
    );
  }, 0);

  // Render loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "black" }}
      >
        <div className="text-light">Loading...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "black" }}
      >
        <div className="text-danger text-center bg-light p-4 rounded border border-dark">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render notes
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <div className="container p-4">
        <h1 className="text-center mb-4 text-light">Your Lists</h1>

        {/* Display the overall total value */}
        <div className="text-center mb-4">
          <h3 className="text-warning">
            Total Money Made:{" "}
            <span className="text-light">${totalValue.toFixed(2)}</span>
          </h3>
        </div>

        {notes.length > 0 ? (
          notes.map((note, idx) => {
            // Calculate the daily total for each list
            const dailyTotal = note.tasks.reduce(
              (taskAcc, task) => taskAcc + (task.value || 0),
              0
            );

            return (
              <div className="card mb-4 bg-dark border border-light" key={idx}>
                <div className="card-body">
                  <h5 className="card-title text-light">
                    List Name: {note.name}
                  </h5>
                  <p className="card-text text-light">
                    Date: {new Date(note.date).toLocaleString()}
                  </p>
                  <h6 className="text-warning">
                    Money Made on this Day:{" "}
                    <span className="text-light">${dailyTotal.toFixed(2)}</span>
                  </h6>
                  <h6 className="text-light">Tasks:</h6>
                  <ul className="list-group">
                    {note.tasks.length > 0 ? (
                      note.tasks.map((task, index) => (
                        <li
                          key={index}
                          className="list-group-item bg-warning border border-dark"
                        >
                          <span>{task.task}</span>
                          <span className="float-end">${task.value}</span>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-center bg-light border border-dark">
                        No tasks available.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center mt-5">
            <p>No notes found for this hash.</p>
          </div>
        )}
      </div>
    </div>
  );
}
