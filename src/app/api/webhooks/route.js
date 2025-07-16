import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createOrUpdateUser, deleteUser } from "../../../lib/actions/user";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req, process.env.CLERK_WEBHOOK_SECRET);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      console.log("userId created : ", evt.data.id);
    }
    if (eventType === "user.updated") {
      console.log("userId updated : ", evt.data.id);
    }

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      } = evt?.data;

      try {
        const user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_address,
          username
        );

        if (user && eventType === "user.created") {
          try {
            await clerkClient.users.updateUserMetadata(id, {
              publicMetadata: {
                userMongoId: user._id,
                isAdmin: user.isAdmin,
              },
            });
          } catch (error) {
            console.log("Error updating user metadata:", error);
          }
        }
      } catch (error) {
        console.log("Error creating or updating user:", error);
        return new Response("Error occured", { status: 400 });
      }
    }

    if (user && eventType === "user.deleted") {
      const { id } = evt?.data;
      try {
        await deleteUser(id);
      } catch (error) {
        console.log("Error deleting user :", error);
        return new Response("Error Occured", { status: 400 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
