import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    // A simple function to check if a token exists
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Dashboard Route */}
                    <Route 
                        path="/dashboard" 
                        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />} 
                    />

                    {/* Default route redirects to dashboard if logged in, otherwise to login */}
                    <Route 
                        path="*" 
                        element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

