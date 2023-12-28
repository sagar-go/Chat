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
  const [socketId, setSocketId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const[loading,setLoading] = useState(false)

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    if (userInfo) {
      setUser(userInfo);
    }
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

  const sendSocketID = async (id) => {
    try {
      const { data } = await axios.post(
        `${Api_URL}/chat/setsocket`,
        { socketId: id, userId: user._id },
        config
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function handleUnload() {
    console.log("UNLOADDDDDDDDDD");
    // Close the Socket.IO connection when the browser is closed or the page is unloaded
    if (user) {
      socket.emit("leaving", user);
      socket.disconnect();
    }
  }

  // typeof window !== "undefined" &&
  //   window.addEventListener("beforeunload", handleUnload);

  // useEffect(() => {
  //   // Check if the code is running on the client-side
  //   if () {
  //     // Add the event listener to the window object
  //     window.addEventListener("beforeunload", handleUnload);
  //   }
  //   // Clean up the event listener when the component unmounts
  // }, []);

  useEffect(() => {
    if (user && pathname === "/home") {
      socket = io(Api_URL);
      socket.emit("setup", user);
      socket.on("connected", (data) => {
        sendSocketID(data);
      });
      socket.on("user online", (data) => {
        //when someone comes online
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
          socketId,
          notifications,
          setNotifications,
          loading,setLoading
        }}
      >
        {children}
      </ChatContext.Provider>
    </>
  );
};

export const useMyContext = () => useContext(ChatContext);
