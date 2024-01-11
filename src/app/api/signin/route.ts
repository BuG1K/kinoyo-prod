import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { User } from "@/database";
import { getJwtSecretKey } from "@/resources/authJwtToken";
import { AuthResponse, SingInBody } from "@/types";

interface ExtendedNextApiRequest extends NextRequest {
  json: () => Promise<SingInBody>
}

const POST = async (request: ExtendedNextApiRequest) => {
  const { email, password } = await request.json();

  if (!(email && password)) {
    return NextResponse.json({ message: "valid" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({
      message: `Email: ${email} not found`,
    }, { status: 404 });
  }

  if (!(user.hash && bcrypt.compareSync(password, user.hash))) {
    return NextResponse.json({
      message: "Password is incorrect",
    }, { status: 400 });
  }

  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(getJwtSecretKey());
  const response = NextResponse.json<AuthResponse>(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      success: true,
      token,
    },
    { status: 200 },
  );

  response.cookies.set({
    name: "token",
    value: token,
    path: "/",
  });

  return response;
};

export { POST };
