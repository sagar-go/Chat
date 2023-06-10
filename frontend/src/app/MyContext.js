"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ChatContext = createContext();
// const PORT = "https://chat-yvhx.onrender.com";
import io from "socket.io-client";
import { Api_URL } from "./utils/util";
import axios from "axios";
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
  const [activeChatUsers, setActiveChatUsers] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    setUser(userInfo);
  }, []);
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${
        typeof window !== "undefined" && localStorage.getItem("token")
      }`,
    },
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.post(
        `${Api_URL}/mainchat/fetchChats`,
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

  window.addEventListener("beforeunload", handleUnload);

  function handleUnload() {
    // Close the Socket.IO connection when the browser is closed or the page is unloaded
    if (user) {
      socket.emit("leaving", user);
      socket.disconnect();
    }
  }

  useEffect(() => {
    socket = io(Api_URL);
    if (user && pathname === "/home") {
      socket.emit("setup", user);
      socket.on("connect", () => {});
      socket.on("user online", (data) => {
        fetchChats();
      });
    } else {
      socket && user && socket.emit("setup leave", user);
    }
  }, [`${user}`, pathname]);

  return (
    <>
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
          activeChatUsers,
          setActiveChatUsers,
        }}
      >
        {children}
      </ChatContext.Provider>
    </>
  );
};

export const useMyContext = () => useContext(ChatContext);
