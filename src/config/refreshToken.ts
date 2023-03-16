import jwt from "jsonwebtoken";

const generateRefreshToken = async ({ id, isAdmin }: any) => {
  return jwt.sign({ id, isAdmin }, `${process.env.JWT_KEY}`);
};
export { generateRefreshToken };
