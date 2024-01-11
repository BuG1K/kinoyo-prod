import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { verifyJwtToken } from "@/resources";

const authPath = "/auth";

const authMiddleware = (next: NextMiddleware) => async (
  request: NextRequest,
  _next: NextFetchEvent,
) => {
  const { cookies, nextUrl, url } = request;
  const { value: token } = cookies.get("token") ?? { value: null };
  const currentUser = token && (await verifyJwtToken(token));

  if (!currentUser && nextUrl.pathname !== authPath) {
    const newUrl = new URL(authPath, url);
    const response = NextResponse.redirect(newUrl);

    response.cookies.delete("token");

    return response;
  }

  return next(request, _next);
};

export default authMiddleware;
