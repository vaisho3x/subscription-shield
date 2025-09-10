import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('User already exists or there was a server error.');
            console.error(err);
        }
    };

    return (
        <div className="auth-form">
            <h2>Create Your Account</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={onSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={onChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
                <input type="password" name="password" placeholder="Password (min 6 characters)" value={formData.password} onChange={onChange} required />
                <button type="submit">Register</button>
            </form>
             <p>Already have an account? <Link to="/login">Login Here</Link></p>
        </div>
    );
};

export default Register;

