import { redis } from "@/app/libs/RedisClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse request body
    const { userId, imageUrl ,key} = await req.json();
    console.log(userId, imageUrl, "body");

    // Validate request data
    if (!userId || !imageUrl || !key) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Fetch user data from Redis
    const userData = await redis.get(userId);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse user data only if it's a string
    let parsedData;
    if (typeof userData === "string") {
      parsedData = JSON.parse(userData);
    } else {
      parsedData = userData; // If it's already an object, no need to parse
    }

    // Ensure parsedData has images array
    if (!parsedData.images) {
      parsedData.images = [];
    }

    // Update the images array
    const updatedImages = [...parsedData.images, {  key, imageUrl }];
    parsedData.images = updatedImages;

    // Save the updated data back to Redis
    await redis.set(userId, JSON.stringify(parsedData));

    const user = await redis.get(userId);

    return NextResponse.json({ message: "Image added successfully", user: user }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
