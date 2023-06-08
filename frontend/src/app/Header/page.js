"use client";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useMyContext } from "../MyContext";
import axios from "axios";

const Header = () => {
  const [show, setShow] = useState(false);
  let inputRef = useRef(null);
  const handleShow = () => setShow(true);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupIds, setGroupIds] = useState([]);
  const handleClose = () => {
    setShow(false);
    setIsGroupChat(false);
    setGroupIds([]);
  };
  const handleNewChat = () => {
    handleShow();
  };

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
    chats,
    setChats,
    allUsers,
    setAllUsers,
  } = useMyContext();

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${
        typeof window !== "undefined" && localStorage.getItem("token")
      }`,
    },
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/mainchat/getUser",
        {},
        config
      );
      if (data) {
        setAllUsers(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const createNewChat = async (id) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/mainchat/createChat",
        { userId: id },
        config
      );
      if (data.success === false) {
        setChatId(data.data._id);
        socket.emit("join chat", data.data._id);
        console.log(data, "ooiid");
        setShow(false);

        return;
      }

      console.log("VVVVVVVVVVVVVV");
      setChats([...chats, data]);
      setShow(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNewGroupChat = () => {
    setIsGroupChat(true);
    handleShow();
  };

  const createNewGroupChat = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/mainchat/createGroupChat",
        { name: inputRef.current.value, users: JSON.stringify(groupIds) },
        config
      );
      if (data) {
        setChats([...chats, data]);
        setShow(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(groupIds, "groupIdsgroupIds");
  return (
    <div className="container">
      <button
        className="btn btn-primary bg-voilet rounded-2"
        onClick={handleNewChat}
      >
        New Chat +{" "}
      </button>
      <button
        className="btn btn-success mx-3 rounded-2"
        onClick={handleNewGroupChat}
      >
        New GROUP Chat +{" "}
      </button>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            {allUsers &&
              allUsers.map((e, ind) => {
                return (
                  <>
                    {!isGroupChat ? (
                      <div key={ind}>
                        <button
                          className="btn btn-primary"
                          onClick={() => createNewChat(e._id)}
                        >
                          {e.name}
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          name={e.name}
                          value={e._id}
                          onChange={() => {
                            if (!groupIds.includes(e._id)) {
                              setGroupIds([...groupIds, e._id]);
                            } else {
                              let temp = [...groupIds];
                              let res = temp.filter((ele) => ele !== e._id);
                              setGroupIds(res);
                            }
                            console.log(e._id);
                          }}
                        />
                        <label className="btn btn-primary">{e.name}</label>
                        <br />
                      </>
                    )}
                  </>
                );
              })}
            {isGroupChat && (
              <>
                <input ref={inputRef} />
                <button onClick={createNewGroupChat}>CREATE GROUP CHAT</button>
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Header;
