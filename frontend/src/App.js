import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/register" element={<h1>Register Page</h1>} />

          {/* Private Route */}
          <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
