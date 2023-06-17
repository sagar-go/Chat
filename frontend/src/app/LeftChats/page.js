"use client";
import React, { useCallback, useEffect, memo, useState } from "react";
import { useMyContext } from "../MyContext";
import axios from "axios";
import { Api_URL } from "../utils/util";
import { BsCircleFill } from "react-icons/bs";

const LeftChats = () => {
  const {
    chats,
    setChats,
    user,
    chatId,
    setChatId,
    activeChatUsers,
    setActiveChatUsers,
    socket,
  } = useMyContext();

  const [newUserJoined, setNewUserJoined] = useState(null);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${
        typeof window !== "undefined" && localStorage.getItem("token")
      }`,
    },
  };

  const fetchChats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket &&
      socket.on("newuser joined", (data) => {
        if (data.userId === user._id) {
          fetchChats();
        }
      });

    if (newUserJoined !== null) {
      fetchChats();
    }
  });

  return (
    <>
      <div className="chatLists  rounded-3">
        {chats &&
          chats.map((e, ind) => {
            return (
              <div
                className={`${
                  e._id === chatId ? "UserChat active" : "UserChat"
                }`}
                onClick={() => {
                  setChatId(e._id);
                  socket.emit("join chat", e._id);
                  let data = e.users.map((ele) => ele._id);
                  setActiveChatUsers(data);
                }}
                key={ind}
              >
                {e.isGroupChat && (
                  <div className="userdata ">
                    <img width={50} src={e.groupPic} /> <p>{e.chatName}</p>
                  </div>
                )}
                {e.users.map((ele) => {
                  if (ele.email !== user?.email && !e.isGroupChat) {
                    return (
                      <div className="userdata" key={Math.random()}>
                        <img
                          width={60}
                          height={60}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                          src={`${Api_URL}/uploads/${ele.pic}`}
                        />
                        <p>{!e.isGroupChat && ele.name}</p>
                        {!e.isGroupChat && ele.isOnline ? (
                          <BsCircleFill size={10} color="green" />
                        ) : (
                          <BsCircleFill size={10} color="red" />
                        )}
                      </div>
                    );
                  }
                })}
                {/* <p>
                  {e.latestMessage
                    ? e.latestMessage?.content
                    : "START CHATTING"}
                </p> */}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default LeftChats;
