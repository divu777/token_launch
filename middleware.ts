import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_SECRET;

export type Payload = {
  userId: string;
  walletAddress: string;
};

export function middleware(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { message: "You are not logged in" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY!);
    const userId = (<Payload>decoded).userId;
    const walletAddress = (<Payload>decoded).walletAddress;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", userId);
    requestHeaders.set("walletAddress", walletAddress);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/*", "/api/user/*"],
};
