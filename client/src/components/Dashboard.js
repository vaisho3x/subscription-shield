import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [formData, setFormData] = useState({ serviceName: '', trialEndDate: '', billingAmount: '', billingCycle: 'Monthly' });
    const navigate = useNavigate();

    // Function to fetch subscriptions from the server
    const fetchSubscriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if no token
                return;
            }
            const res = await axios.get('http://localhost:5000/api/subscriptions', {
                headers: { 'x-auth-token': token },
            });
            setSubscriptions(res.data);
        } catch (err) {
            console.error("Could not fetch subscriptions", err);
             if (err.response && err.response.status === 401) {
                // Handle token expiration or invalid token
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    // Fetch subscriptions when the component mounts
    useEffect(() => {
        fetchSubscriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/subscriptions', formData, {
                headers: { 'x-auth-token': token },
            });
            fetchSubscriptions(); // Refresh list after adding
            setFormData({ serviceName: '', trialEndDate: '', billingAmount: '', billingCycle: 'Monthly' }); // Reset form
        } catch (err) {
            console.error("Error adding subscription", err);
        }
    };

    const deleteSubscription = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/subscriptions/${id}`, {
                headers: { 'x-auth-token': token },
            });
            fetchSubscriptions(); // Refresh list after deleting
        } catch (err) {
            console.error("Error deleting subscription", err);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h2>Subscription Shield 🛡️</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            
            <div className="form-container">
                <h3>Add New Subscription</h3>
                <form onSubmit={onSubmit}>
                    <input type="text" name="serviceName" value={formData.serviceName} placeholder="Service Name (e.g., Netflix)" onChange={onChange} required />
                    <input type="date" name="trialEndDate" value={formData.trialEndDate} onChange={onChange} required />
                    <input type="number" step="0.01" name="billingAmount" value={formData.billingAmount} placeholder="Amount (e.g., 10.99)" onChange={onChange} required />
                    <select name="billingCycle" value={formData.billingCycle} onChange={onChange}>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                    <button type="submit">Add Subscription</button>
                </form>
            </div>

            <div className="list-container">
                <h3>Your Subscriptions</h3>
                {subscriptions.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Renews On</th>
                                <th>Amount</th>
                                <th>Cycle</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub._id}>
                                    <td>{sub.serviceName}</td>
                                    <td>{new Date(sub.trialEndDate).toLocaleDateString()}</td>
                                    <td>${parseFloat(sub.billingAmount).toFixed(2)}</td>
                                    <td>{sub.billingCycle}</td>
                                    <td><button onClick={() => deleteSubscription(sub._id)} className="delete-btn">Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You have no subscriptions yet. Add one above to get started!</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

