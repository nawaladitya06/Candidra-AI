import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await auth();
  
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value.substring(0, 5)}...`);
  
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((v, k) => { allHeaders[k] = v; });

  return NextResponse.json({
    session,
    hasSession: !!session,
    cookies: allCookies,
    headers: allHeaders,
    url: req.url,
  });
}
