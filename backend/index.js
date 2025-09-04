const express = require("express");
const app = express();
require("./db");
const contactModel = require("./contactModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.post("/add", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // get token from cookies
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    // verify token
    const decoded = jwt.verify(token, "akash"); // same secret you used
    const userId = decoded._id;

    // check if contact already exists for this user
    const existing = await contactModel.findOne({ phone, user: userId });
    if (existing) return res.json({ success: false, message: "Already added" });

    // create new contact linked to user
    await contactModel.create({
      name,
      email,
      phone,
      address,
      user: userId,
    });

    console.log(`added number: ${phone} for user ${userId}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("error creating contact", err);
    return res
      .status(500)
      .json({ success: false, message: "Error adding contact" });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    // get token from cookies
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    // decode token
    const decoded = jwt.verify(token, "akash");
    const userId = decoded._id; // this is the logged-in user

    // fetch only contacts belonging to this user
    const contacts = await contactModel.find({ user: userId }).sort({ createdAt: -1 });

    res.json(contacts);
  } catch (err) {
    console.log("error fetching contacts:", err);
    res.status(500).json({ success: false, message: "Error fetching contacts" });
  }
});
// server.js or routes/contacts.js
const mongoose = require("mongoose");
const userModel = require("./userModel");

app.delete("/contacts/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contact id" });
  }

  try {
    const deleted = await contactModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).json({ message: "user already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await userModel.create({
      name,
      email,
      password: hashed,
    });
    return res.status(200).json({
      success: true,
      message: "User Registered",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ _id: user._id, email: user.email }, "akash");
    res.cookie("token", token);

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});
app.get('/me', async (req,res)=>{
  try{
    let token = req.cookies.token;
    const decoded = jwt.verify(token,'akash');
    const userId = decoded._id;
    const user = await userModel.findById(userId);
    res.status(200).json({success:true,user:user})
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false,message:'error'})
  }
})
app.post('/logout',async (req,res)=>{
  res.clearCookie('token');
  res.status(200).json({success:true,message:'logout successfull'});
})
app.listen(3000, () => {
  console.log("listening to port 3000");
});
