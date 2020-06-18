const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const UserRouter = require('./src/routes/user.route');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/user", UserRouter);

const PORT = 5000 | process.env.PORT;

app.listen(PORT, () => {
    console.log("Server started on port: ", PORT);
})