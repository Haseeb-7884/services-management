import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "./ApiError";
import { isProduction } from "./env";

/**
 * Wraps a Route Handler so every route can just `throw ApiError.xxx(...)`
 * instead of repeating try/catch boilerplate - equivalent to the old
 * Express stack's asyncHandler + centralized errorHandler middleware
 * combined into one place, since Next.js Route Handlers have no middleware
 * chain to hang a global error handler off of.
 */
export function withHandler<Ctx = unknown>(
  fn: (req: NextRequest, ctx: Ctx) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: Ctx): Promise<NextResponse> => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: err.message, details: err.details },
          { status: err.statusCode }
        );
      }
      console.error("[unhandled error]", err);
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          ...(isProduction ? {} : { debug: err instanceof Error ? err.stack : String(err) }),
        },
        { status: 500 }
      );
    }
  };
}
