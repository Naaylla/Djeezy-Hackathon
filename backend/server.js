const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/dbConection");
const errorHandler = require('./middleware/errorHandler');

const app = express();

const port = process.env.PORT || 5000;

app.use("/api/users", require("./routes/userRoute"));
app.use(errorHandler);

app.listen(port, () => {
    console.log('Server is running on port', port);
});
