const express = require('express');
const session = require('express-session');

const public_routes = require('./router/general');
const auth_routes = require('./router/auth_users');

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

app.use("/", public_routes.general);

app.use("/customer", auth_routes.authenticated);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});