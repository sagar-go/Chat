"use client";
import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div style={{position:'absolute', top:'0',left:'0', background:'rgba(0,0,0,0.7)', height:"100vh", width:"100vw", display:'flex',justifyContent:'center',alignItems:'center'}}><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
  )
}

export default Loader