require('dotenv').config();

require("dotenv/config");
const { Client, MessageActivityType } = require("discord.js");
const { OpenAI } = require("openai");

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages"],
});

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

client.on("ready", () => {
  console.log("LCartiGPT is online on Discord");
});

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    message.channel.id !== process.env.CHANNEL_ID ||
    message.content.startsWith("!")
  )
    return;

  await message.channel.sendTyping();

  const prevMessages = await message.channel.messages.fetch({ limit: 15 });
  let conversationLog = [
    {
      role: "system",
      content:
        "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.",
    },
  ];

  prevMessages.forEach((msg) => {
    if (msg.author.id === message.author.id) {
      conversationLog.push({ role: "user", content: msg.content });
    }
  });
  conversationLog.push({ role: "user", content: message.content });

  const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });
  message.reply(result.choices[0].message.content);
});

client.login(process.env.TOKEN);