"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";
import { Api_URL } from "../utils/util";
import { toast } from "react-toastify";
// import "react-toastify/dist/react-toastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useMyContext();

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await axios
      .post(
        `${Api_URL}/chat/login`,
        { email: email, password: password },
        config
      )
      .then((e) => {
        if (!e.data.success) {
          toast.error("Please check your credentials");
          return;
        } else {
          localStorage.setItem("token", e.data.data.token);
          localStorage.setItem("loggedUser", JSON.stringify(e.data.data));
          setUser(e.data.data);

          setTimeout(() => {
            router.push("/home");
          }, 400);
        }
      });
  }
  return (
    <>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="LoginPage">
              <form className="" onSubmit={handleSubmit}>
                <input
                  className="ChatInput w-100"
                  placeholder="EMAIL"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  className="ChatInput w-100"
                  placeholder="Pass"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn bg-voilet rounded-1  w-50 m-auto d-block">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SignUP */}
    </>
  );
};

export default Login;
