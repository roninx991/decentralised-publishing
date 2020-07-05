const mongoose = require('../config/database');

const Schema = mongoose.Schema;

const PaperSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    reviews: [{
        reviewer: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true,
            default: ""
        }
    }]
}, { typePojoToMixed: false });

module.exports = mongoose.model('Paper', PaperSchema);