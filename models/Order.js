const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const OrderSchema = new Schema({
    cartTotal: {
        type: Number,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    userAfterLogin: {
        type: Array,
        required: true
    },
    currentLocation: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});
module.exports = Order = mongoose.model('lab-test-orders', OrderSchema);




