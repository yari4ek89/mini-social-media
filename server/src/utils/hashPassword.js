// Import neccessary library
import bcrypt from "bcrypt"; // import bcrypt from bcrypt

// Export hashPassword function, that hashes password with salt
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); // hash
};

// Export comparePassword function, that compares hash with original password
export const comparePassword = async (password, hashPassword1) => {
  return await bcrypt.compare(password, hashPassword1); // it will be true or false
};
