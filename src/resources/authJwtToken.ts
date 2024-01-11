import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY || "";

  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }

  return new TextEncoder().encode(secret);
};

const verifyJwtToken = async (token: string) => {
  try {
    const verify = await jwtVerify(token, getJwtSecretKey());

    return verify.payload;
  } catch (error) {
    return null;
  }
};

export { getJwtSecretKey, verifyJwtToken };
