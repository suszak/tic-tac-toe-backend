import User from "../models/dbUser.js";

export const registerUser = (req, res) => {
  const userLogin = req.body.login;
  const userPassword = req.body.password;

  if (userLogin && userPassword) {
    User.countDocuments({ login: userLogin }).then((count) => {
      if (count != 0) {
        res.send({ registered: false, error: "User already exist!" });
      } else {
        User.create({
          login: userLogin,
          password: userPassword,
          rankPoints: 0,
          isAdmin: false,
        }).then(() => {
          res.send({
            registered: true,
          });
        });
      }
    });
  } else {
    res.send({ registered: false, error: "Wrong input data!" });
  }
};

export const loginUser = (req, res) => {
  const userLogin = req.body.login;
  const userPassword = req.body.password;

  if (req.body.login && req.body.password) {
    User.find({ login: userLogin }).then((userFound) => {
      if (userFound.length === 1) {
        if (userFound[0].password === userPassword) {
          res.send({ logged: true, userLogin: userLogin });
        } else {
          res.send({ logged: false, error: "Passwords doesn't match!" });
        }
      } else {
        res.send({ logged: false, error: "User not found!" });
      }
    });
  } else {
    res.send({ logged: false, error: "Wrong input data!" });
  }
};

export const getTop5Users = (req, res) => {
  User.find((error, data) => {
    if (error) {
      res.send({ error: error });
    } else {
      res.send({ data: data });
    }
  })
    .sort({ rankPoints: -1 })
    .limit(5);
};

export const getUserRank = (req, res) => {
  const userLogin = req.body.login;

  if (userLogin) {
    User.find({ login: userLogin }).then((userFound) => {
      res.send({ rankPoints: userFound[0].rankPoints });
    });
  } else {
    res.send({ error: "Bad input data!" });
  }
};
