const app = require("express")();
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");

app.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      status: "success",
      message: "User found & logged in",
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/signup", async (req, res) => {
  const user = User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,
  });

  try {
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = app;
