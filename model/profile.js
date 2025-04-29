const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    current_level: {
        type: String,
    },
    email: {
        type: String,
    },
    profileImg: {
        type: String
    },
    referral_code: {
        type: String
    },
    next_level: {
        type: String,
    },
    level: {
        type: Number,
    },
    emailIsVerified: {
        type: Boolean,
    },
    emailIsLinked: {
        type: Boolean,
    },
    profileIsHidden: {
        type: Boolean,
    },
    kyc1: {
        type: Object,
    },
    kycToken: {
        type: String,
    },
    is_verified: {
        type: Boolean,
    },
    status: {
        type: String,
        enum: ['active', 'disabled'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Profile', profileSchema);
