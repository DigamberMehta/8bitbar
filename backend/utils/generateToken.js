import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  const token = jwt.sign({ id: user._id }, secret, {
    expiresIn: "30d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
    .json({
      success: true,
      message,
      user,
    });
};
