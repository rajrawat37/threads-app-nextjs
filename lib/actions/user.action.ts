"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

//first make connection to mongoose
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    //now making calls to database
    //for that we need models ✅

    //🍀 findOneAndUpdate() is used to find a single document in a collection
    //that matches a given query criteria,
    //update it with new data, and return either the original document or the updated document.
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true } //upsert : true means -> if doc present it will update else it will put new document
    );

    if (path === "/profile/edit") {
      revalidatePath(path); //to update the cached data without waiting for revalidation to expire
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    // path:'communities',
    // model:Community
    // });
  } catch (error:any) { 
    throw new Error(`Failed  to fetch User: ${error.message}`);
  }
}


