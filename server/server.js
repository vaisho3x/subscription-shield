// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables from .env file
dotenv.config();

// Import Mongoose models
const Subscription = require('./models/Subscription');
const User = require('./models/User');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// --- Nodemailer Setup (for sending emails) ---
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // For Gmail, use an "App Password"
    },
});

// --- Scheduled Task (Cron Job) ---
// This job runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Running daily check for subscription renewals...');
    try {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        // Find subscriptions ending in the next 3 days
        const upcomingSubscriptions = await Subscription.find({
            trialEndDate: {
                $gte: today,
                $lte: threeDaysFromNow,
            },
        }).populate('user'); // 'populate' fetches the related user details

        if (upcomingSubscriptions.length > 0) {
            console.log(`Found ${upcomingSubscriptions.length} upcoming renewals. Sending emails...`);
            upcomingSubscriptions.forEach(sub => {
                if (sub.user && sub.user.email) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: sub.user.email,
                        subject: `Subscription Reminder: ${sub.serviceName} is renewing soon!`,
                        html: `
                            <p>Hi ${sub.user.name},</p>
                            <p>This is a friendly reminder that your subscription for <strong>${sub.serviceName}</strong> is set to renew in the next 3 days.</p>
                            <p>If you wish to cancel, please do so before the renewal date to avoid being charged.</p>
                            <p>Thank you,</p>
                            <p><strong>Subscription Shield</strong></p>
                        `,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(`Error sending email to ${sub.user.email}:`, error);
                        }
                        console.log(`Email sent to ${sub.user.email}: ` + info.response);
                    });
                }
            });
        } else {
            console.log('No upcoming renewals found today.');
        }
    } catch (error) {
        console.error('Error during daily subscription check:', error);
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
