const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("../backend/routes/userRoutes");
const chatRoutes = require("../backend/routes/chatRoute");
const messageRoute = require("../backend/routes/messageRoute");

app.use(cors());

dotEnv.config();

app.use(express.json());
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((e) => console.log("CONNECTED TO SERVERrrrrrrr"));

// app.use("/auth", authRoute);

const server = app.listen(process.env.DB_PORT, (req, res) =>
  console.log("SERVER IS RUNNING !!!!!!!!!!!!")
);

app.get("/", (req, res) => {
  return res.send("WORKING");
});

app.use("/chat", userRoutes);
app.use("/mainchat", chatRoutes);
app.use("/message", messageRoute);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  // io.set("origins", "*");
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    console.log(userData?._id, "userDDDDDD");
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    console.log(newMessageRecieved, "CCCCCCCCCCCCCCCCCCCc");
    // console.log('chat',chat)
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      } else {
        console.log("YESSSSSSSSSSSSS", user._id);
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      }
    });
  });
  socket.on("message delete", (newMessageRecieved) => {
    console.log(newMessageRecieved, "eeeeiedsasdqwe");
    newMessageRecieved &&
      newMessageRecieved.chatIds.forEach((ids) => {
        socket.in(ids).emit("message delete2", newMessageRecieved.data);
      });
    // console.log(
    //   newMessageRecieved.chatId,
    //   "newMessageRecievednewMessageRecieved"
    // );
    // socket
    //   .in(newMessageRecieved.chatId)
    //   .emit("message recieved", newMessageRecieved.data);
    // let chat = newMessageRecieved.chat;
    // console.log(chat, "CCCCCCCCCCCCCCCCCCCc");
    // // console.log('chat',chat)
    // if (!chat.users) return console.log("chat.users not defined");

    // chat.users.forEach((user) => {
    //   if (user._id === newMessageRecieved.sender._id) {
    //     return;
    //   } else {
    //     console.log("YESSSSSSSSSSSSS", user._id);
    //     socket.in(user._id).emit("message recieved", newMessageRecieved);
    //   }
    // });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
