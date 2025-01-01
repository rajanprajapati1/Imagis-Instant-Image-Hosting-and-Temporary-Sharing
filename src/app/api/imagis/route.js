import { redis } from '@/app/libs/RedisClient';
import { NextResponse } from 'next/server'

export async function POST(req, res) {
  const { userId, images } = await req.json();;

  console.log(userId, images, "img");

  try {
    await redis.set(userId, JSON.stringify({ images }), {
      ex: 86400, // Expiration time in seconds (24 hours)
    });
    return NextResponse.json({ message: "User created successfully." });
  } catch (error) {
    console.error('Error saving to Redis:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function GET(req, res) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const userData = await redis.get(userId);
    console.log(`User data for ${userId}:`, userData);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' });

  }
}

