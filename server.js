const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors')

const port = process.env.PORT || 5000;

const users = require("./routes/api/users");

const app = express();

app.use(cors());


// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


// Passport middleware
app.use(passport.initialize());
// Passport config
// require("./config/passport")(passport);
// Routes
app.use("/api", users);





app.listen(port, () => console.log(`Server running on port ${port} !`));


