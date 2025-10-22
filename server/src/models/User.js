// Import neccessary libraries
import mongoose from "mongoose"; // import moongoose from moongoose
const {Schema} = mongoose; // import Schema object from moongoose

// Define userSchema with username, email, passwordHash, avatarUrl, bio and createdAt
const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    avatar: {
        url: {type: String, default: ""},
        publicId: {type: String, default: ""},
    },
    bio: {type: String, default: ""},
    createdAt: {type: String, default: ""},
});

// Define a new model from userSchema
const User = mongoose.model("User", userSchema);

// Export getUser function, that checks username
export async function getUser(login) {
    try {
        return await User.findOne({username: login}); // find user with this login
    } catch (err) {
        throw new AppError("Please enter username", 400);
    }
}

// Export getUserId function, that checks id's
export async function getUserId(id) {
    try {
        return await User.findById(id); // find user with this id
    } catch (err) {
        return false;
    }
}

export async function getAllUsers() {
    try {
        const users = await User.find({});
        return users;
    } catch (err) {
        return false;
    }
}

// Export User
export default User;
