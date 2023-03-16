import jwt from "jsonwebtoken";
function getNewAccessToken(refreshToken: any) {
  return new Promise((resolve, reject) => {
    // Verify the refresh token
    jwt.verify(
      refreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`,
      (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          // Create a new access token
          const accessToken = jwt.sign(
            { id: decoded.id, isAdmin: decoded.isAdmin },
            `${process.env.REFRESH_TOKEN_SECRET}`,
            { expiresIn: "15m" }
          );
          resolve(accessToken);
        }
      }
    );
  });
}
export default getNewAccessToken;
