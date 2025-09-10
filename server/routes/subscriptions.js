const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT (This was the missing piece)
function authMiddleware(req, res, next) {
    // Get token from the header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}


// GET all subscriptions for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user.id }).sort({ trialEndDate: 'asc' });
        res.json(subscriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ADD a new subscription
router.post('/', authMiddleware, async (req, res) => {
    const { serviceName, trialEndDate, billingAmount, billingCycle } = req.body;
    try {
        const newSubscription = new Subscription({
            user: req.user.id,
            serviceName,
            trialEndDate,
            billingAmount,
            billingCycle,
        });
        const subscription = await newSubscription.save();
        res.json(subscription);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a subscription
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({ msg: 'Subscription not found' });
        if (subscription.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Subscription.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Subscription removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

