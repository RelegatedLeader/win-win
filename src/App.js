import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Notetaking from "./components/Notetaking";
import ShowNotes from "./components/ShowNotes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/show_notes/:hash" element={<ShowNotes />} />
        <Route path="/notetaking" element={<Notetaking />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
