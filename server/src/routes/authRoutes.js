// Import neccessary libraries
import express from "express"; // import express from express
import {checkUsername, getUsers, loginUser, logoutUser, me, registerUser} from "../controllers/authController.js"; // import neccessary function from authController.js
import {protect} from "../middlewares/authMiddleware.js"; // import protect middleware

const router = express.Router(); // define express router

// POST routes
router.post("/register", registerUser); // register route
router.post("/login", loginUser); // login route
router.post("/logout", logoutUser); // logout route

// GET routes
router.get("/me", protect, me); // get /me route
router.get("/check-username", checkUsername); // get /check-username route
router.get("/get-users", getUsers);

// Export route
export default router;
