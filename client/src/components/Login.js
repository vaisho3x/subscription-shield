import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="auth-form">
            <h2>Login to Subscription Shield</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={onSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register Here</Link></p>
        </div>
    );
};

export default Login;

