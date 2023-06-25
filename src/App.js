import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your screens from the "./screens" folder
import Login from "./screens/Login";
import Home from "./screens/Home";

function App() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/home" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
