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
          user1RankPoints: 0,
          user2RankPoints: 0,
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

export const updateTables = async (req, res) => {
  if (req.body.userNumber == 1) {
    try {
      await TableOverview.updateOne(
        { id: req.body.tableID },
        {
          $set: {
            user1: req.body.userName,
            user1RankPoints: req.body.rankPoints,
          },
        }
      );
    } catch (e) {
      res.send({ updated: false, error: e });
    }
    res.send({
      updated: true,
    });
  } else if (req.body.userNumber == 2) {
    try {
      await TableOverview.updateOne(
        { id: req.body.tableID },
        {
          $set: {
            user2: req.body.userName,
            user2RankPoints: req.body.rankPoints,
          },
        }
      );
    } catch (e) {
      res.send({ updated: false, error: e });
    }
    res.send({
      updated: true,
    });
  } else {
    res.send({ updated: false });
  }
};

export const disconnectUserFromTable = async (req, res) => {
  const userName = req.body.userName;
  let response = "";
  try {
    await TableOverview.updateOne(
      { user1: userName },
      { $set: { user1: "", user1RankPoints: 0 } }
    );
    await TableOverview.updateOne(
      { user2: userName },
      { $set: { user2: "", user2RankPoints: 0 } }
    );
  } catch (err) {
    response = { updated: false, error: err };
  } finally {
    if (!response) {
      response = {
        updated: true,
      };
    }
    res.send(response);
  }
};
