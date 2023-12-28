"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Api_URL } from "../utils/util";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { useMyContext } from "../MyContext";



const Signup = ({user}) => {
  const [email, setEmail] = useState(user ? user.email : "");
  const [uploadedImage, setUploadedImage] = useState(
    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
  );
  const [postImage, setPostImage] = useState(null);
  const [password, setPassword] = useState("");
  const [name, setName] = useState(user ? user.name : "");
  const router = useRouter();
  const {loading,setLoading } = useMyContext();

  useEffect(()=>{

    return (()=>{
      setLoading(false)
    })
  },[])


  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (email && name && password && postImage) {
      const formData = new FormData();
      formData.append("pic", postImage);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      setLoading(true)
      const data = await axios
        .post(`${Api_URL}/chat/createUser`, formData, config)

        .then((ele) => {
          console.log(ele,'aaaaaaaaee')
          if(!ele.data.success){
            
            toast.error(ele.data.message)
            setLoading(false)
            return
          }
          router.push("/login");
        });
    }else{
      toast.info('Please fill all fields')
    }
  }

  function imageChange(event) {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setPostImage(file);
    setUploadedImage(imageURL);
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className={user?`col-md-8`:"col-md-4"}>
          <div className="LoginPage">
            <form className="" onSubmit={handleSubmit}>
              <div className="mein-image">
                <img src={uploadedImage} alt="" />
              </div>
              <input
                value={name}
                className="ChatInput w-100"
                placeholder="Username"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                value={email}
                className="ChatInput w-100"
                placeholder="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="ChatInput w-100"
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="ChatInput pointer w-100">
                <span>
                  Upload Your Image
                  <svg
                    style={{ marginLeft: "15px" }}
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
                </span>
                <input
                  className="opacity-0 w-100"
                  type="file"
                  placeholder=""
                  onChange={(e) => imageChange(e)}
                  // onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button className="btn bg-voilet rounded-1  w-50 m-auto d-block">
               {!user? 'Sign-up' : 'Update Profile'}
               
              </button>
      { !user &&       <div style={{ display: "flex", justifyContent:'center', gap:'10px',marginTop:'20px' }}>
                <p>Already have an account?</p>
                <p
                  onClick={() => router.push("/login")}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Login
                </p>
              </div>}
            </form>
          </div>
        </div>
      </div>
      {loading && <Loader/> }
    </div>
  );
};

export default Signup;
