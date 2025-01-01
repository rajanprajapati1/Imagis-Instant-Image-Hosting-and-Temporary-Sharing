import { Redis } from "@upstash/redis";
import {NextResponse} from 'next/server'

export default async function POST(req, res) {
  const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = process.env;
  const redis = new Redis({
    token: UPSTASH_REDIS_REST_TOKEN,
    url: UPSTASH_REDIS_REST_URL,
  });

  const { id } = req.query;

  const { userId , images } = await req.json();;

  console.log( userId ,images, "img");

  try {
    // Store the images in Redis with the key `id`
    await redis.set(id, JSON.stringify({ images }));

    // Respond with a success message
    return NextResponse.json({ message: "User created successfully." });
  } catch (error) {
    console.error('Error saving to Redis:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}























































// import { Hono } from "hono";
// import { cors } from 'hono/cors'
// import { handle } from "hono/vercel";
// import { env } from 'hono/adapter'
// import { Redis } from "@upstash/redis/cloudflare";

// export const runtime = "edge";

// const app = new Hono().basePath('/api');


// app.use('/*', cors())

// app.post("/generateId/:id", async (c) => {
//     const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = env;
//     const redis = new Redis({
//         token: UPSTASH_REDIS_REST_TOKEN,
//         url: UPSTASH_REDIS_REST_URL,
//     })
//     const id = c.req.param('id')
//     const body = await c.req.json();
//     const images = body.images;

//     console.log(body, "img")
//     await redis.set(id, JSON.stringify({ images }));
//     return c.json({ message: "User created successfully." });
// })


// app.get("/image", (c) => {
//     return c.json({ msg: "hi" })
// })



// export const GET = handle(app);
// export default app ;