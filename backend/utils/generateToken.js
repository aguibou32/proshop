import  jwt  from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({userId: userId}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  }); // Token is created

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict', // Avoid cross site scripting
    maxAge: 30 * 24 * 60 * 60 * 100 // 30 days
  });
}

export default generateToken;