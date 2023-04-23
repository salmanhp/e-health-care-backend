const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/signup");
const validateLoginInput = require("../../validation/login");
// Load User model
const Doctor = require("../../models/Doctor");
const Patient = require("../../models/Patient");
const Appointment = require("../../models/Appointment");
const Order = require("../../models/Order");
const Prescription = require("../../models/Prescription");
// const { Client } = require('cashfree-sdk');



// Payment Gateway

// const client = Client({
//     clientId: 'TEST37061767559013972a4eb616f1716073',
//     clientSecret: 'TEST6fcc7f3948c8eac6ead58c5a708656e567c14d42',
//     env: 'TEST', // Replace with 'PROD' for production environment
// });

// app.post('/create-payment-order', async (req, res) => {
//     const { amount } = req.body;

//     const order = await client.orders.create({
//         amount,
//         currency: 'INR',
//         orderId: 'ORDER_' + Date.now(),
//         orderNote: 'Test order',
//         customerName: 'John Doe',
//         customerPhone: '9999999999',
//         customerEmail: 'johndoe@example.com',
//         returnUrl: 'http://localhost:3000/payment-success',
//     });

//     res.send({
//         order,
//     });
// });



//Get Doctor
router.get("/doctors", (req, res) => {
    Doctor.find((err, data) => {
        if (!err) {
            res.json(data)
        }
        else {
            console.log(err)
        }
    })
})

//Get Patient
router.get("/patients", (req, res) => {
    Patient.find((err, data) => {
        if (!err) {
            res.json(data)
        }
        else {
            console.log(err)
        }
    })
})
//Get Appointment for Dashboard 
router.get("/getappointment", (req, res) => {
    Appointment.find((err, data) => {
        if (!err) {
            res.json(data)
        }
        else {
            console.log(err)
        }
    })
})



// Get Order Placed for Lab Test
router.get("/getorder", (req, res) => {
    Order.find((err, data) => {
        if (!err) {
            res.json(data)
        }
        else {
            console.log(err)
        }
    })
})

//show Prescription
router.get("/getprescription", (req, res) => {
    Prescription.find((err, data) => {
        if (!err) {
            res.json(data)
        }
        else {
            console.log(err)
        }
    })
})





// Order Place for Lab Test
router.post("/order", (req, res) => {
    const newOrder = new Order({
        cartTotal: req.body.cartTotal,
        items: req.body.items,
        userAfterLogin: req.body.userAfterLogin,
        currentLocation: req.body.currentLocation
    });
    newOrder.save()
        .then(order => res.json(order))
        .catch(err => console.log(err));
})


//Prescription post
router.post("/prescription", (req, res) => {

    Prescription.findOne({ $and: [{ patientemail: req.body.patientEmail }, { doctoremail: req.body.doctorEmail }] }).then(prescription => {
        if (prescription) {
            //update

            const id = req.body.medicines[0].id;
            const medicinesName = req.body.medicines[0].medicinesName;
            const medicinesUnit = req.body.medicines[0].medicinesUnit;
            const medicinesDos = req.body.medicines[0].medicinesDos;
            const date = req.body.medicines[0].date;

            prescription.medicine.push({ id, date, medicinesName, medicinesUnit, medicinesDos });
            prescription.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfullt appended to the array");
                }
            });


        } else {
            const newPrescription = new Prescription({
                patient: req.body.patientName,
                patientemail: req.body.patientEmail,
                age: req.body.patientAge,
                sex: req.body.patientSex,
                doctor: req.body.doctor,
                doctoremail: req.body.doctorEmail,
                medicine: req.body.medicines
            });

            newPrescription
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    });
});




//SignUp for Doctor 

router.post("/dregister", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Doctor.findOne({ email: req.body.email }).then(doctor => {
        if (doctor) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newDoctor = new Doctor({
                name: req.body.name,
                department: req.body.department,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newDoctor.password, salt, (err, hash) => {
                    if (err) throw err;
                    newDoctor.password = hash;
                    newDoctor
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

//Doctor Appointment
router.post("/appointment", (req, res) => {

    Appointment.findOne({ $and: [{ email: req.body.email }, { doctor: req.body.doctor }] }).then(appointment => {
        if (appointment) {
            return res.status(400).json({ email: "You already appointment with this doctor" });
        } else {
            const newAppointment = new Appointment({
                department: req.body.department,
                doctor: req.body.doctor,
                doctorEmail: req.body.doctorEmail,
                date: req.body.date,
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                sex: req.body.sex
            });

            newAppointment
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    });
});


//SignUp for Patient
router.post("/pregister", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Patient.findOne({ email: req.body.email }).then(patient => {
        if (patient) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newPatient = new Patient({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPatient.password, salt, (err, hash) => {
                    if (err) throw err;
                    newPatient.password = hash;
                    newPatient
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


//Login for Doctor
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/dlogin", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    Doctor.findOne({ email }).then(doctor => {
        // Check if user exists
        if (!doctor) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, doctor.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: doctor.id,
                    name: doctor.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                            // token: `Bearer ${token}`
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

//Login For Patient
router.post("/plogin", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    Patient.findOne({ email }).then(patient => {
        // Check if user exists
        if (!patient) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, patient.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: patient.id,
                    name: patient.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                            // token: `Bearer ${token}`
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});




module.exports = router;

