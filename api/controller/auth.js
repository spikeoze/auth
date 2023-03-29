const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const lowerUsername = username.toLowerCase();
    const user = await prisma.user.create({
      data: {
        username: lowerUsername,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const loginController = (req, res) => {
  try {
    res.status(200).json({ message: "successfully logged in" });
  } catch (error) {
    res.json({
      message: "server error",
    });
  }
};

const logoutController = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "successfully logged out" });
  });
};




module.exports = {
  registerController,
  loginController,
  logoutController,
};
