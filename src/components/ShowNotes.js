import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ShowNotes() {
  const { hash } = useParams(); // Extract the hash from the URL
  const [notes, setNotes] = useState(null); // State to store notes
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
          if (data.tasks && Array.isArray(data.tasks)) {
            setNotes(data); // Ensure tasks is an array
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

  // Render loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div>Loading...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-danger text-center">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render notes
  return (
    <div className="container mt-5">
      <h1 className="text-center">Your Notes</h1>
      {notes ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">List Name: {notes.name}</h5>
            <p className="card-text">
              Date: {new Date(notes.date).toLocaleString()}
            </p>
            <h6>Tasks:</h6>
            <ul className="list-group">
              {notes.tasks.length > 0 ? (
                notes.tasks.map((task, index) => (
                  <li key={index} className="list-group-item">
                    <span>{task.task}</span>
                    <span className="float-end">${task.value}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center">
                  No tasks available.
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <p>No notes found for this hash.</p>
        </div>
      )}
    </div>
  );
}
