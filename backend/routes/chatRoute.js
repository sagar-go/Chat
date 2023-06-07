const router = require("express").Router();
const { accessChat,fetchChats,createGroupChat } = require("../controller/chatController");
const {allUsers} = require('../controller/userController');
const { protect } = require("../middleware/verifyToken");


// router.post("/createUser", createUser);
router.post('/createChat',protect,accessChat)
router.post('/getUser',protect,allUsers )
router.post('/fetchChats',protect,fetchChats )
router.post('/createGroupChat',protect,createGroupChat )




module.exports = router;
