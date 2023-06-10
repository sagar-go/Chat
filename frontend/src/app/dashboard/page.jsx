"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";
import { Api_URL } from "../utils/util";

const Login = () => {
  const [email, setEmail] = useState("");
  const [uploadedImage, setUploadedImage] = useState(
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
  );
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
        `${Api_URL}/chat/login`,
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

      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="LoginPage">
              <form className="" onSubmit={handleSubmit}>
                <div className="mein-image">
                  <img src={uploadedImage} alt="" />
                </div>
                <input
                  className="ChatInput w-100"
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="ChatInput w-100"
                  placeholder="Password"
                  type="text"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  className="ChatInput w-100"
                  placeholder="Pass"
                  // onChange={(e) => setPassword(e.target.value)}
                />
                <label className="ChatInput pointer w-100">
                  <span>
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48"
                      viewBox="0 -960 960 960"
                      width="25"
                    >
                      <path
                        d="M250-160q-86 0-148-62T40-370q0-78 49.5-137.5T217-579q20-97 94-158.5T482-799q113 0 189.5 81.5T748-522v24q72-2 122 46.5T920-329q0 69-50 119t-119 50H510q-24 0-42-18t-18-42v-258l-83 83-43-43 156-156 156 156-43 43-83-83v258h241q45 0 77-32t32-77q0-45-32-77t-77-32h-63v-84q0-89-60.5-153T478-739q-89 0-150 64t-61 153h-19q-62 0-105 43.5T100-371q0 62 43.929 106.5Q187.857-220 250-220h140v60H250Zm230-290Z"
                        fill="white"
                      />
                    </svg>{" "}
                    Upload Your Image
                  </span>
                  <input
                    className="opacity-0 w-100"
                    type="file"
                    placeholder=""
                    // onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <button className="btn bg-voilet rounded-1  w-50 m-auto d-block">
                  Sign-up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
