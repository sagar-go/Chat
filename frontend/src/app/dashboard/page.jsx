"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user, setUser } = useMyContext();

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await axios
      .post(
        "http://localhost:5000/chat/login",
        { email: email, password: password },
        config
      )
      .then((e) => {
        localStorage.setItem("token", e.data.data.token);
        localStorage.setItem("loggedUser", JSON.stringify(e.data.data));
        setUser(e.data.data);
      })
      .then((ele) => {
        router.push("/home");
      });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input placeholder="EMAIL" onChange={(e) => setEmail(e.target.value)} />

        <input
          placeholder="Pass"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </>
  );
};

export default Page;
