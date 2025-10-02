// Import neccessary libraries
import User, { getUser, getUserId } from "../models/User.js"; // import User model, getUser, getUserId function from User.js
import { hashPassword, comparePassword } from "../utils/hashPassword.js"; // import hashPassword, compareFunction arrow function from hashPassword.js
import jwt from "jsonwebtoken"; // import jwt from jsonwebtoken
import AppError from "../utils/AppError.js"; // import app error from app error

// Export registerUser arrow function
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, passwordHash, avatar, bio, createdAt } = req.body; // get neccessary data from request body
    const user = await getUser(username); // check exists user with this username or no
    if (user) throw new AppError("Username is busy", 400);
    const pass = await hashPassword(passwordHash); // hash password for more security

    // Define newUser with User model in DB
    const newUser = new User({
      username,
      email,
      passwordHash: pass,
      avatar: avatar,
      bio,
      createdAt,
    });
    await newUser.save(); // save user in DB

    // Define token system. Create a new session token with JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Add cookie "token" to save token for future actions
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.json({ status: "success", user: { id: newUser.id } });
  } catch (err) {
    next(err);
  }
};

// Export loginUser arrow function
export const loginUser = async (req, res, next) => {
  try {
    const { username, passwordHash } = req.body; // get neccessary username and passwordHash from request body
    const user = await getUser(username); // check exists user with this username or no

    // Check if user with requested username equals user with username from DB
    if (user["username"] === username) {
      const pass = await comparePassword(passwordHash, user["passwordHash"]); // compare password, check correct or not

      // If password compare true -> give a new session token
      if (pass) {
        // Give a new session token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        // Add this session token to cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        // Return login OK
        return res.json({ status: "success", user: { id: user.id } });
      } else {
        throw new AppError("Incorrect password, try again", 401);
      }
    }
  } catch (err) {
    next(err);
  }
};

// Export logOut arrow function
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token"); // clear cookie with param "token"
    return res.json({ status: "success" }); // return status OK when logout
  } catch (err) {
    next(err);
  }
};

// Export me arrow function
export const me = async (req, res) => {
  try {
    const user = await getUserId(req.user.id); // get user with this userId
    res.json({ status: "success", data: user }); // return status OK and give data
  } catch (err) {
    next(err);
  }
};

// Export checkUsername arrow function
export const checkUsername = async (req, res) => {
  const user = await getUser(req.query.u); // get username from frontend and check exists or not

  // If exists then -> true, if no -> false
  if (user) {
    return res.json({ status: "success", exists: true });
  } else {
    return res.json({ status: "success", exists: false });
  }
};
