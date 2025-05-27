import Post from "../../../models/Post";
import User from "../../../models/User";
import connect from "../../../utils/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  // Fetch Data
  try {
    await connect();
    const user = await User.findOne({ email: email });
    console.log(user);

    const posts = await Post.find({ username: user.username });
    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const body = await request.json(); // Await JSON parsing

    // Find the user based on email from the request
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    // Create a new Post instance with user information
    const newPost = new Post({
      title: body.title,
      desc: body.desc,
      content: body.content,
      img: body.img,
      username: user.username,
    });

    // Connect to the database and save the new post
    await connect();
    await newPost.save(); // Await save operation

    return new NextResponse("Post Has Been Created Successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Database Error", { status: 500 });
  }
};
