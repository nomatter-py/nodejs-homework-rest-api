const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require('jimp');

const User = require("../models/user");
const avatarsDirectory = path.join(__dirname, "../", "public", "avatars");
const { RequestError } = require("../helpers");
const sendEmail = require("../helpers/sendEmail");
const createVerifyEmail = require("../helpers");
const { SECRET_KEY } = process.env;
const { nanoid } = require("nanoid");

const register = async (req, res) => {
  const { name, email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const result = await User.create({ name, email, subscription, password: hashPassword, avatarURL, verificationToken });

  const mail = createVerifyEmail(email, verificationToken);
  await sendEmail(mail);

  res.status(201).json({
    email: result.email,
    subscription: result.subscription,
  });
};


const verify = async(req, res)=> {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw RequestError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.status(200).json({
        message: "Verification successful"
    })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!user || !passwordCompare) {
    throw RequestError(401, "Email or password is wrong");
  }
 
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  await User.findByIdAndUpdate(user._id, { token });

  const userData = {
    email: user.email,
    subscription: user.subscription,
  };

  res.json({
    token,
    user: userData,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json("No Content");
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { runValidators: true }
  );
  res.status(200).json({
    user: {
      email: user.email,
      subscription,
    },
  });
};


const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file;
  const extension = originalname.split(".").pop();
  const filename = `${_id}.${extension}`;
  const resultPath = path.join(avatarsDirectory, filename);

  // image resize
  const image = await Jimp.read(tempPath);
  await image.resize(250, 250);
  await image.writeAsync(tempPath);
  
  await fs.rename(tempPath, resultPath);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });
  
  res.status(200).json({
    avatarURL,
  })
}


const resendVerify = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw RequestError(400, "Email not found")
    }
    
    const mail = createVerifyEmail(email, user.verificationToken);
    await sendEmail(mail);

    res.json({
        message: "Verification email sent"
    })
}


module.exports = {
  register,
  verify,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  resendVerify,
};
