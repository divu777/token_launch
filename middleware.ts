import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_SECRET;

export type Payload = {
  userId: string;
  walletAddress: string;
};

export function middleware(request: NextRequest) {
  console.log("Middleware executing for path:", request.nextUrl.pathname);

  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token found in request headers");
    return NextResponse.json(
      { message: "You are not logged in" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY!);
    const userId = (<Payload>decoded).userId;
    const walletAddress = (<Payload>decoded).walletAddress;

    console.log("Token decoded successfully. UserId:", userId);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", userId);
    requestHeaders.set("walletAddress", walletAddress);

    console.log("Headers set. userId:", requestHeaders.get("userId"));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/user/:path*"],
};
