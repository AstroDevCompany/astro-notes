import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </main>
  );
}

export default App;
