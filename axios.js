import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8001",
});

export const axiosDisconnectUserFromDB = async (userName) => {
  const body = {
    userName,
  };

  return await instance.put("/disconnectUser", body);
};
