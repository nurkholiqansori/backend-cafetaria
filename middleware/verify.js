const jwt = require("jsonwebtoken");
const app = require("express")();

app.use((req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return next(new res.Conflict("No token provided!"));
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new res.Unauthorized("Unauthorized!"));
    }
    req.userId = decoded.id;
    next();
  });
});

module.exports = app;
