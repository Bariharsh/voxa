import dbConnect from "@/lib/dbConnect";
import { getGeminiResponse } from "@/lib/gemini";

import ChatModel from "@/model/Chat";

export async function POST(req: Request) {
  await dbConnect();

  const { text } = await req.json();

  if (!text) {
    return Response.json(
      {
        success: false,
        message: "Text is required",
      },
      { status: 400 }
    );
  }

  try {
    const UserMessage = await ChatModel.create({
      sender: "user",
      text,
    });

    const botText = await getGeminiResponse(text);

    const airesponse = await ChatModel.create({
      sender: "bot",
      text: botText,
    });

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
        user: UserMessage,
        bot: airesponse,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Send message Route", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
