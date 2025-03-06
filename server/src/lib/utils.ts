import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateHashedPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password: string, hashedPassword: string) => {
  if (!password || !hashedPassword) {
    throw new Error("password can't be empty genius");
  }

  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  } catch (error) {
    console.log(error);
    throw new Error("Error while hashing password");
  }
};

const generateToken = (id: string, userName: string, email: string) => {
  return jwt.sign({ id, userName, email }, process.env.JWT_SECRET as string);
};

export { generateHashedPassword, comparePassword, generateToken };
