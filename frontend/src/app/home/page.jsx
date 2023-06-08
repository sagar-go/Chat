"use client";
import LeftChats from "../LeftChats/page";
import RightChats from "../RightChats/page";
import Header from "../Header/page";

const HOME = () => {
  return (
    <div className="container">
      <h1 className="my-4">Home</h1>
      <Header />
      <div
        className="container mt-3 rounded-3 "
        style={{ display: "flex", justifyContent: "center", height: "73vh" }}
      >
        <div className="row overflow-hidden w-100 g-0 chat-border">
          <div className="col-4">
            <LeftChats />
          </div>
          <div className="col-8">
            <RightChats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOME;
