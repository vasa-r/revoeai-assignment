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

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string);
};

const extractSheetId = (input: string) => {
  if (/^[a-zA-Z0-9-_]{30,}$/.test(input)) {
    return input;
  }

  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

export {
  generateHashedPassword,
  comparePassword,
  generateToken,
  extractSheetId,
};
