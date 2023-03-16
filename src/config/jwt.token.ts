import jwt from "jsonwebtoken";

const generateToken = async ({ id, isAdmin }: any) => {
  return jwt.sign({ id, isAdmin }, `${process.env.JWT_KEY}`, {
    expiresIn: "15m",
  });
};
export { generateToken };
