import jwt from "jsonwebtoken";

const generateToken = async ({ id, isAdmin }: any) => {
  return jwt.sign({ id, isAdmin }, `${process.env.JWT_KEY}`, {
    expiresIn: "60m",
  });
};
export { generateToken };
