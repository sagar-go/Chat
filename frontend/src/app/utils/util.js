const fetchChats = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/mainchat/fetchChats",
      {},
      config
    );
    if (data) {
      setChats(data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const Api_URL = "https://chat-app-2ynw.onrender.com";
