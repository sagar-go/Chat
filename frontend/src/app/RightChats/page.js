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
    const data = await axios
      .get(`http://localhost:5000/message/fetchMessage/${chatId}`, config)
      .then((e) => {
        console.log(e.data.length, "eeeeeeeeeeee");
        setSoloMsgs(e.data);
      });
    // socket.emit("join chat", fetchChatId);
    // if (data) {

    // }
  };

  const setActive = (index) => {
    console.log(index);
    const activeDiv = document.getElementById(`ActiveMessage_${index}`);
    console.log(activeDiv, "opasdpaosdasd");
    activeDiv?.scrollIntoView({
      block: "end",
      behavior: "smooth",
      inline: "nearest",
    });
  };
  useEffect(() => {
    if (chatId) {
      fetchAllChatMessages();
      // setActive(soloMsgs.length - 2);
    }
  }, [chatId]);

  useEffect(() => {
    if (soloMsgs && soloMsgs.length > 0) {
      setActive(soloMsgs.length - 1);
    }
  }, [soloMsgs.length]);

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

  const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ block: "end" });
  // };

  // useEffect(setActive(soloMsgs.length - 1), [soloMsgs.length]);

  return (
    <>
      <div className="chatDataside position-relative">
        <div className="chatHistory">
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
                          <img src={ele.sender.pic} width={50} />

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
        <div className="chatDiv">
          <form onSubmit={sendSingleMessage}>
            <div style={{ display: "flex" }}>
              <input className="ChatInput shadow-2" ref={inputRef} />
              <button className="chat-Send-Btn shadow-2">Go</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RightChats;
