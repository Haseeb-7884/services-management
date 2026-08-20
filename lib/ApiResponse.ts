import { NextResponse } from "next/server";

export function ok<T>(data: T, message = "OK", statusCode = 200) {
  return NextResponse.json({ success: true, message, data }, { status: statusCode });
}

export function created<T>(data: T, message = "Created") {
  return ok(data, message, 201);
}
