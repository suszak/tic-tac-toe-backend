import User from "../models/dbUser.js";

export const registerUser = (req, res) => {
  const newLogin = req.body.login;
  const newPassword = req.body.password;

  if (newLogin && newPassword) {
    User.countDocuments({ login: newLogin }).then((count) => {
      console.log(count);
      if (count != 0) {
        res.status(500).send({ register: false, error: "user already exist!" });
      } else {
        User.create({
          login: newLogin,
          password: newPassword,
          rankPoints: 0,
          isAdmin: false,
        }).then(() => {
          res
            .status(201)
            .send({
              register: true,
            })
            .catch((error) => {
              res.status(500).send({
                register: false,
                error: error,
              });
            });
        });
      }
    });
  } else {
    res.status(500).send({ register: false, error: "Wrong input data!" });
  }
};
