const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const AppointmentSchema = new Schema({
    department: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    doctorEmail: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
});
module.exports = Appointment = mongoose.model('appointments', AppointmentSchema);




