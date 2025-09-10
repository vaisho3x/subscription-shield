const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceName: { type: String, required: true },
    trialEndDate: { type: Date, required: true },
    billingAmount: { type: Number, required: true },
    billingCycle: { type: String, enum: ['Monthly', 'Yearly'], required: true },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);