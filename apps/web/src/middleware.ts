import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("accessToken");
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const expDate = new Date(
      JSON.parse(atob(cookie.value.split(".")[1])).exp * 1000
    ).getTime();
    if (expDate < Date.now()) {
      request.cookies.delete("accessToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.redirect(new URL("/login", request.url));
  }

return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard'],
};
