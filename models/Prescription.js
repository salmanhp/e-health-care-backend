const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PrescriptionSchema = new Schema({
    patient: {
        type: String,
    },
    patientemail: {
        type: String,
    },
    age: {
        type: String,
    },
    sex: {
        type: String,
    },
    doctor: {
        type: String,
    },
    doctoremail: {
        type: String,
    },
    medicine: {
        type: Array,
    },
});
module.exports = Prescription = mongoose.model('prescriptions', PrescriptionSchema);




