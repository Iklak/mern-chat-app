import api from "./api";

export const getConversations = async () => {
  const response = await api.get("/conversations");

  return response.data;
};

export const createConversation = async (members) => {
  const response = await api.post("/conversations", {
    members,
  });

  return response.data;
};
