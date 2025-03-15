const express = require('express');
const connectDB = require("./config/dbConection");
const dotenv = require("dotenv").config();
const errorHandler = require('./middleware/errorHandler');

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users", require("./routes/userRoute"));
app.use(errorHandler);

app.listen(port, () => {
    console.log('Server is running on port', port);
});
