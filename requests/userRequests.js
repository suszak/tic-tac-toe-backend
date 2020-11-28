import User from "../models/dbUser.js";

export const registerUser = (req, res) => {
  const userLogin = req.body.login;
  const userPassword = req.body.password;

  if (userLogin && userPassword) {
    User.countDocuments({ login: userLogin }).then((count) => {
      if (count != 0) {
        res
          .status(500)
          .send({ registered: false, error: "user already exist!" });
      } else {
        User.create({
          login: userLogin,
          password: userPassword,
          rankPoints: 0,
          isAdmin: false,
        }).then(() => {
          res.status(201).send({
            registered: true,
          });
        });
      }
    });
  } else {
    res.status(500).send({ registered: false, error: "Wrong input data!" });
  }
};

export const loginUser = (req, res) => {
  const userLogin = req.body.login;
  const userPassword = req.body.password;

  if (req.body.login && req.body.password) {
    User.find({ login: userLogin }).then((userFound) => {
      if (userFound.length === 1) {
        if (userFound[0].password === userPassword) {
          res.status(200).send({ logged: true, userLogin: userLogin });
        } else {
          res
            .status(200)
            .send({ logged: false, error: "Passwords doesn't match!" });
        }
      } else {
        res.status(200).send({ logged: false, error: "User not found!" });
      }
    });
  } else {
    res.status(500).send({ logged: false, error: "Wrong input data!" });
  }
};
