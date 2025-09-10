Subscription Shield
A full-stack web application to track digital subscriptions and send automated email alerts before free trials expire, preventing unwanted charges.

About The Project
Subscription Shield is a full-stack web application designed to help users manage their digital subscriptions and free trials effectively. The primary goal is to prevent unwanted charges from auto-renewing subscriptions by sending timely email notifications before a trial period ends or a payment is due.

The application provides a secure, user-friendly dashboard where users can add, view, and delete their various subscriptions. The core feature is an automated daily background task that identifies upcoming renewals and sends a proactive alert to the user's registered email address, empowering them to take action and maintain control over their finances.

Tech Stack
This project is built with a modern, decoupled architecture using the following technologies:

Frontend
React.js: A JavaScript library for building dynamic and responsive user interfaces.

Axios: A promise-based HTTP client for making API requests to the backend.

React Router: For handling client-side navigation between pages.

Backend
Node.js: A JavaScript runtime for building the server-side application.

Express.js: A web application framework for Node.js, used to build the RESTful API.

MongoDB: A NoSQL database used to store user and subscription data.

Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.

JSON Web Tokens (JWT): For implementing secure, stateless user authentication.

Nodemailer: A module to send automated email notifications from the server.

node-cron: A task scheduler to run the daily check for expiring subscriptions.
