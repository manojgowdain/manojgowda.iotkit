import { updateSession } from "./lib/middleware";

export async function proxy(request) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
