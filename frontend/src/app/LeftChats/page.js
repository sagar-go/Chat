"use client";
import React, { useCallback, useEffect, memo, useState } from "react";
import { useMyContext } from "../MyContext";
import axios from "axios";

const LeftChats = () => {
  const {
    chats,
    setChats,
    user,
    chatId,
    fetchChatId,
    setFetechChatId,
    socket,
    input,
    setChatId,
    soloMsgs,
  } = useMyContext();

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
        "http://localhost:5000/mainchat/fetchChats",
        {},
        config
      );
      if (data) {
        setChats(data);
        console.log("pppppppppppp4444444444444444443");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  console.log("RENDERED LEFT PAGE");

  useEffect(() => {
    fetchChats();
    console.log("pppppppppppp3333333333333");
  }, []);

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
                  console.log(e._id);
                  setChatId(e._id);
                  socket.emit("join chat", e._id);
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
                          width={50}
                          height={50}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                          src={ele.pic}
                        />
                        <p>{!e.isGroupChat && ele.name}</p>
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
