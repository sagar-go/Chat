"use Client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMyContext } from "../MyContext";
import axios from "axios";

const RightChats = () => {
  const {
    user,
    fetchChatId,
    chatId,
    setChatId,
    soloMsgs,
    setSoloMsgs,
    socket,
    input,
    setInput,
    setChats,
  } = useMyContext();
  const inputRef = useRef(null);

  const [newMessageRecieved, setNewMessageRecieved] = useState(null);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${
        typeof window !== "undefined" && localStorage.getItem("token")
      }`,
    },
  };

  console.log("From Right Page ");
  const fetchAllChatMessages = async () => {
    // setChatId(chatId);
    const data = await axios.get(
      `http://localhost:5000/message/fetchMessage/${chatId}`,
      config
    );
    // socket.emit("join chat", fetchChatId);
    if (data) {
      setSoloMsgs(data.data);
    }
  };
  useEffect(() => {
    if (chatId) {
      fetchAllChatMessages();
    }
  }, [chatId]);

  const sendSingleMessage = async (e) => {
    e.preventDefault();
    const data = await axios.post(
      `http://localhost:5000/message/sendMessage`,
      { content: inputRef.current.value, chatId: chatId },
      config
    );
    socket.emit("new message", data.data);
    setSoloMsgs([...soloMsgs, data.data]);
    inputRef.current.value = "";
  };

  useEffect(() => {
    socket &&
      socket.on("message recieved", (newMessageRecieved) => {
        console.log("pppppppppppp123123123", newMessageRecieved);
        // setNewMessageRecieved(newMessageRecieved);
        if (
          !chatId || // if chat is not selected or doesn't match current chat
          chatId !== newMessageRecieved.chat._id
        ) {
          // if (!notification.includes(newMessageRecieved)) {
          //   setNotification([newMessageRecieved, ...notification]);
          //   setFetchAgain(!fetchAgain);
          // }
          // props.fetchChats();
          console.log(chatId, newMessageRecieved, "pppppppppppp", user);
          // fetchChats();
        } else {
          console.log("pppppppppppp111", newMessageRecieved);
          setSoloMsgs([...soloMsgs, newMessageRecieved]);
        }
      });
  });

  useEffect(() => {
    socket &&
      socket.on("message delete2", (newMessageRecieved) => {
        console.log("pppppppppppp123123123", newMessageRecieved);
        // setNewMessageRecieved(newMessageRecieved);
        if (
          !chatId || // if chat is not selected or doesn't match current chat
          chatId !== newMessageRecieved.chat
        ) {
          // if (!notification.includes(newMessageRecieved)) {
          //   setNotification([newMessageRecieved, ...notification]);
          //   setFetchAgain(!fetchAgain);
          // }
          // props.fetchChats();
          console.log(chatId, newMessageRecieved, "pppppppppppp", user);
          // fetchChats();
        } else {
          console.log("pppppppppppp111", newMessageRecieved);
          let temp = [...soloMsgs];
          let result = temp.filter(
            (ele, ind) => ele._id !== newMessageRecieved._id
          );
          setSoloMsgs(result);
        }
      });
  });

  const handleDeleteMessage = async (id, index) => {
    const { data } = await axios.post(
      `http://localhost:5000/message/deleteMessage`,
      { messageId: id },
      config
    );
    console.log("iddd", data);
    socket.emit("message delete", {
      data: data.data,
      chatIds: ["6475c5f9af74efff3811b548", "6475c611af74efff3811b54b"],
    });

    let temp = [...soloMsgs];
    let result = temp.filter((ele, ind) => ind !== index);
    setSoloMsgs(result);
    // setSoloMsgs([...soloMsgs, data.data]);
  };
  console.log(chatId, "chatIdchatId");

  return (
    <>
      <div style={{ width: "80%", border: "2px solid green" }}>
        {chatId && (
          <div>
            {soloMsgs &&
              soloMsgs.map((ele, ind) => {
                return (
                  <div>
                    {ele.sender._id === user._id ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <p
                          style={{ border: "1px solid green" }}
                          onClick={() => handleDeleteMessage(ele._id, ind)}
                          key={Math.random()}
                        >
                          {ele.content}
                        </p>
                        <img src={ele.sender.pic} width={50} />
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <img src={ele.sender.pic} width={50} />

                        <p key={Math.random()}>{ele.content}</p>
                      </div>
                    )}
                    <br></br>
                  </div>
                );
              })}
            <br></br>
            <br></br>
            <form onSubmit={sendSingleMessage}>
              <input ref={inputRef} />
              <button>Send</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default RightChats;
