import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8002",
});

export const axiosDisconnectUserFromDB = async (userName) => {
  const body = {
    userName,
  };

  return await instance.put("/disconnectUser", body);
};

export const axiosUpdatePoints = async (userLogin, newPoints) => {
  const body = {
    userLogin,
    newPoints,
  };

  return await instance.put("/updatePoints", body);
};

export const axiosUpdateTablesPoints = async (userName, rankPoints) => {
  const body = {
    userName,
    rankPoints,
  };

  return await instance.put("/updateTablesPoints", body);
};
