"use client";
import { MyContext } from "./MyContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MyContext>{children}</MyContext>
      </body>
    </html>
  );
}
