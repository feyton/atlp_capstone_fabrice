const bcrypt = require("bcrypt");
const User = require("../models/User");

const handleNewUser = async (req, res) => {
  const { fName, lName, email, pwd } = req.body;
  console.log("Request recived");

  if (!fName || !lName || !email || !pwd)
    return res.status(400).send("Provide requested information");
  // Check duplicate
  const duplicateEmail = await User.findOne({ email: email }).exec();
  if (duplicateEmail) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      firstName: fName,
      lastName: lName,
      password: hashedPwd,
      email: email,
    });
    console.log(result);
    return res.status(201).send("user created successfully");
  } catch (error) {}
};

module.exports = { handleNewUser };
