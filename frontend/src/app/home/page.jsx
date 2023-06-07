"use client";
import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useMyContext } from "../MyContext";
import LeftChats from "../LeftChats/page";
import RightChats from "../RightChats/page";
import Header from "../Header/page";
let socket;
// let selectedChatCompare;

const HOME = () => {
  return (
    <div>
      <h1>Home</h1>
      <Header />
      <div style={{ display: "flex" }}>
        <LeftChats />
        <RightChats />
      </div>
    </div>
  );
};

export default HOME;
