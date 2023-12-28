"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMyContext } from "../MyContext";
import axios from "axios";
import { Api_URL } from "../utils/util";
import { ToastContainer, toast } from "react-toastify";

const RightChats = () => {
  const {
    user,
    chatId,
    soloMsgs,
    setSoloMsgs,
    socket,
    activeChatUsers,
    chats,
    notifications,
    setNotifications,
  } = useMyContext();
  const inputRef = useRef(null);

  const [newMessageRecieved, setNewMessageRecieved] = useState(null);

  const notify = () => toast("Wow so easy!");

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${
        typeof window !== "undefined" && localStorage.getItem("token")
      }`,
    },
  };

  const fetchAllChatMessages = async () => {
    // setChatId(chatId);
    const data = await axios
      .get(`${Api_URL}/message/fetchMessage/${chatId}`, config)
      .then((e) => {
        setSoloMsgs(e.data);
      });
  };

  const setActive = (index) => {
    const activeDiv = document.getElementById(`ActiveMessage_${index}`);
    activeDiv?.scrollIntoView({
      block: "end",
      behavior: "smooth",
      inline: "nearest",
    });
  };
  useEffect(() => {
    if (chatId) {
      console.log('triggered')
      fetchAllChatMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (soloMsgs && soloMsgs.length > 0) {
      setActive(soloMsgs.length - 1);
    }
  }, [soloMsgs.length]);

  const sendSingleMessage = async (e) => {
    e.preventDefault();
    if (inputRef.current.value !== "") {
      const data = await axios.post(
        `${Api_URL}/message/sendMessage`,
        { content: inputRef.current.value, chatId: chatId },
        config
      );
      socket.emit("new message", data.data);
      console.log('check2222')
      setSoloMsgs([...soloMsgs, data.data]);
      inputRef.current.value = "";
    } else {
      notify();
    }
  };
  console.log(chatId, "ooooooooooooooo", notifications);
  useEffect(() => {
    socket &&
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !chatId || // if chat is not selected or doesn't match current chat
          chatId !== newMessageRecieved.chat._id
        ) {
          // if (!notification.includes(newMessageRecieved)) {
          //   setNotification([newMessageRecieved, ...notification]);
          //   setFetchAgain(!fetchAgain);
          // }
          // props.fetchChats();
          // fetchChats();
          console.log("nnnmee", newMessageRecieved);
          setNotifications([...notifications, newMessageRecieved]);
        } else {
          console.log("mmm");
          setSoloMsgs([...soloMsgs, newMessageRecieved]);
        }
      });
  });

  // useEffect(() => {
  //   socket &&
  //     socket.on("message delete2", (newMessageRecieved) => {
  //       // setNewMessageRecieved(newMessageRecieved);
  //       if (
  //         !chatId || // if chat is not selected or doesn't match current chat
  //         chatId !== newMessageRecieved.chat
  //       ) {
  //         // if (!notification.includes(newMessageRecieved)) {
  //         //   setNotification([newMessageRecieved, ...notification]);
  //         //   setFetchAgain(!fetchAgain);
  //         // }
  //         // props.fetchChats();
  //         // fetchChats();
  //         console.log('here')
  //       } else {
  //         console.log('hereeeeeeeeeeeee')
  //         let temp = [...soloMsgs];
  //         let result = temp.filter(
  //           (ele, ind) => ele._id !== newMessageRecieved._id
  //         );
  //         setSoloMsgs(result);
  //       }
  //     });
  // });

  const handleDeleteMessage = async (id, index) => {
    const { data } = await axios.post(
      `${Api_URL}/message/deleteMessage`,
      { messageId: id },
      config
    );
    socket.emit("message delete", {
      data: data.data,
      chatIds: activeChatUsers,
    });

    let temp = [...soloMsgs];
    let result = temp.filter((ele, ind) => ind !== index);
    setSoloMsgs(result);
    // setSoloMsgs([...soloMsgs, data.data]);
  };
  return (
    <>
      <div className="chatDataside position-relative">
        <div className="chatHistory">
          {console.log(soloMsgs.length,chatId,'check')}
          {chats && !chats.length && <p> No Chats, Get Started Now !!</p>}
          {chatId && (
            <>
              {soloMsgs && soloMsgs.length > 0 ? (
                soloMsgs.map((ele, ind) => {
                  return (
                    <div id={`ActiveMessage_${ind}`}>
                      {ele.sender._id === user._id ? (
                        <div className="userMessage d-flex justify-content-end gap-3 align-items-center">
                          <p className="m-0" key={Math.random()}>
                            {ele.content}
                          </p>
                          <span
                            onClick={() => handleDeleteMessage(ele._id, ind)}
                          >
                            x
                          </span>

                          {/* <img src={ele.sender.pic} width={50} /> */}
                        </div>
                      ) : (
                        <div className="ClientMessage d-flex justify-content-start  gap-3 align-items-center">
                          <img
                            width={40}
                            height={40}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            src={`${Api_URL}/uploads/${ele.sender.pic}`}
                          />

                          <p key={Math.random()}>{ele.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <p>Start Chatting with each other</p>
                </div>
              )}
            </>
          )}
        </div>
        {chatId && (
          <div className="chatDiv">
            <form onSubmit={sendSingleMessage}>
              <div style={{ display: "flex" }}>
                <input className="ChatInput shadow-2" ref={inputRef} />
                <button className="chat-Send-Btn shadow-2">Go</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default RightChats;
