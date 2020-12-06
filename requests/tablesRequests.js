import TableOverview from "../models/dbTableOverview.js";

export const addTable = (req, res) => {
  const newId = req.body.id;

  if (newId) {
    TableOverview.countDocuments({ id: newId }).then((count) => {
      if (count != 0) {
        res.send({ tableAdded: false, error: "Table exist!" });
      } else {
        TableOverview.create({
          id: newId,
          user1: "",
          user2: "",
        }).then(() => {
          res.send({
            tableAdded: true,
          });
        });
      }
    });
  } else {
    res.send({ tableAdded: false, error: "Wrong input data!" });
  }
};

export const getTables = (req, res) => {
  TableOverview.find((error, data) => {
    if (error) {
      res.send({ error: error });
    } else {
      res.send(data);
    }
  });
};
