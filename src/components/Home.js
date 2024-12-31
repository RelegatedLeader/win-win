import { Link } from "react-router-dom";
import "../css/home.css";

export default function Home() {
  return (
    <div
      id="home_menu"
      className="text-center d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "black", color: "white" }}
    >
      <h1
        className="display-4 mb-4"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        Win-Win!
      </h1>
      <Link to="/notetaking">
        <button className="btn btn-primary btn-lg">Get Started</button>
      </Link>
    </div>
  );
}
