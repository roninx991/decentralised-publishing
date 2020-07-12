const express = require('express');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

require('./src/config/passport');

const AuthRouter = require('./src/routes/auth.route');
const UserRouter = require('./src/routes/user.route');
const TokenRouter = require('./src/routes/token.route');
const PaperRouter = require('./src/routes/paper.route');
const ReviewRouter = require('./src/routes/review.route');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileupload());

app.use("/auth/", AuthRouter)
app.use("/user/", passport.authenticate('jwt', {session: false}), UserRouter);
app.use("/token/", passport.authenticate('jwt', {session: false}), TokenRouter);
app.use("/paper/", passport.authenticate('jwt', {session: false}), PaperRouter);
app.use("/review/", passport.authenticate('jwt', {session: false}), ReviewRouter);

const PORT = 5000 | process.env.PORT;

app.listen(PORT, () => {
    console.log("Server started on port: ", PORT);
})