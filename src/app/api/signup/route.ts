import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { User } from "@/database";
import { getJwtSecretKey } from "@/resources/authJwtToken";
import { AuthResponse, SingUpBody } from "@/types";

interface ExtendedNextApiRequest extends NextRequest {
  json: () => Promise<SingUpBody>
}

const POST = async (request: ExtendedNextApiRequest) => {
  const { name, email, password } = await request.json();

  if (!(name && email && password)) {
    return NextResponse.json({ message: "valid" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (user) {
    return NextResponse.json({
      message: `Email: ${email} already in use`,
    }, { status: 400 });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    const lastCheckNotifications = new Date(new Date().toISOString());
    const newUser = await new User({
      name,
      email,
      password,
      lastCheckNotifications,
      hash,
    });

    newUser.save();

    const token = await new SignJWT({ id: newUser.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("90d")
      .sign(getJwtSecretKey());
    const response = NextResponse.json<AuthResponse>(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
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
  } catch {
    return NextResponse.json({
      message: "Internal Server Error",
    }, { status: 500 });
  }
};

export { POST };
