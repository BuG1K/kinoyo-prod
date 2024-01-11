import { NextMiddleware, NextResponse } from "next/server";
import middlewaresProps from "@/middlewares";

type OnStackMiddlewares = (
  middlewares: typeof middlewaresProps,
  index?: number
) => NextMiddleware

const onStackMiddlewares: OnStackMiddlewares = (middlewares, index = 0) => {
  const middleware = middlewares[index];

  if (middleware) {
    const next = onStackMiddlewares(middlewares, index + 1);

    return middleware(next);
  }

  return () => NextResponse.next();
};

const stackMiddlewares = onStackMiddlewares(middlewaresProps);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default stackMiddlewares;
