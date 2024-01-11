import { NextRequest, NextResponse } from "next/server";
import { User } from "@/database";
import { RecoveryBody } from "@/types";

interface ExtendedNextApiRequest extends NextRequest {
  json: () => Promise<RecoveryBody>
}

const POST = async (request: ExtendedNextApiRequest) => {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: "valid" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({
      message: `Email: ${email} not found`,
    }, { status: 404 });
  }

  return NextResponse.json({
    message: "valid",
  }, { status: 500 });
};

export { POST };
