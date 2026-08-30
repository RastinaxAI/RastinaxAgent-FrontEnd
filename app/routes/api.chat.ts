import { type ActionFunctionArgs } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function action({ request }: ActionFunctionArgs) {
    try {
        const body = await request.json();
        const { text, history } = body;

        // خواندن امن کلید از سمت سرور
        const apiKey = process.env.GEMINI_API_KEY || "";
        if (!apiKey) {
            return Response.json({ error: "API Key is missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // ارسال درخواست به گوگل
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(text);
        const aiResponseText = result.response.text();

        return Response.json({ text: aiResponseText });
    } catch (error) {
        console.error("Server API Error:", error);
        return Response.json({ error: "Failed to generate response" }, { status: 500 });
    }
}