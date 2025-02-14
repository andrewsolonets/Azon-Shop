import { NextResponse } from "next/server";
import { redis } from "~/server/redis/redis";

export async function POST() {
  await redis.set("hello", "world");
  return NextResponse.json({ data: "Testing Redis ..." });
}
