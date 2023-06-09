"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();
const PORT = "https://chat-yvhx.onrender.com";
import io from "socket.io-client";
let socket;
export const MyContext = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [chatId, setChatId] = useState(null);
  const [fetchChatId, setFetechChatId] = useState(null);
  const [soloMsgs, setSoloMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    setUser(userInfo);
  }, []);

  useEffect(() => {
    if (user) {
      socket = io(PORT);
      socket.emit("setup", user);
      socket.on("connect", () => {
        console.log("connected");
      });
    }
  }, [`${user}`]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        chatId,
        setChatId,
        fetchChatId,
        setFetechChatId,
        soloMsgs,
        setSoloMsgs,
        socket,
        input,
        setInput,
        allUsers,
        setAllUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

export const useMyContext = () => useContext(ChatContext);
