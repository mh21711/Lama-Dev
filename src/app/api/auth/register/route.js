import User from "../../../../models/User";
import connect from "../../../../utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  let userData;
  try {
    userData = await request.json();
  } catch (error) {
    return new NextResponse("Invalid JSON data", { status: 400 });
  }

  const { name, email, password } = userData;

  // Validate required fields
  if (!name || !email || !password) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Proceed if data is valid
  await connect();

  const hashedPassword = await bcrypt.hash(password, 5);

  // Ensure username matches schema field
  const newUser = new User({
    username: name, // Assign name to username field
    email,
    password: hashedPassword,
  });

  console.log(newUser);

  try {
    await newUser.save();
    return new NextResponse("User has been created", { status: 201 });
  } catch (err) {
    return new NextResponse(err.message, { status: 500 });
  }
};
