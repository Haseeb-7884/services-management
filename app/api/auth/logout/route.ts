import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { REFRESH_COOKIE_NAME } from "../../../../lib/tokens";

export const POST = withHandler(async () => {
  const res = ok(null, "Logged out");
  res.cookies.set(REFRESH_COOKIE_NAME, "", { path: "/api/auth", maxAge: 0 });
  return res;
});
