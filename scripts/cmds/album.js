const axios = require("axios");
const fs = require("fs");
const path = require("path");

const aryan = "https://nix-album-api.vercel.app";
const nix = "https://apis-toop.vercel.app/aryan/imgur";

module.exports = {
  config: {
    name: "album",
    version: "0.0.1",
    role: 0,
    author: "ArYAN",
    category: "media",
    guide: {
      en: "{p}{n} [page number] (e.g., {p}{n} 2 to view the next page)\n{p}{n} add [category] [URL] - Add a video to a category\n{p}{n} list - View total categories",
    },
  },

  onStart: async function ({ api, event, args }) {
    if (args[0] === "add") {
      if (!args[1]) {
        return api.sendMessage("[⚜️]➜ Please specify a category. Usage: !album add [category] [video_url] or reply to a video.", event.threadID, event.messageID);
      }

      const category = args[1].toLowerCase();
      let videoUrl = args[2];

      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachment = event.messageReply.attachments[0];
        if (attachment.type !== "video") {
          return api.sendMessage("[⚜️]➜ Only video attachments are allowed.", event.threadID, event.messageID);
        }
        videoUrl = attachment.url;
      }
      
      if (!videoUrl) {
        return api.sendMessage("[⚜️]➜ Please provide a video URL or reply to a video message.", event.threadID, event.messageID);
      }

      try {
        const imgurResponse = await axios.get(nix, {
          params: { url: videoUrl },
        });

        if (!imgurResponse.data || !imgurResponse.data.imgur) {
          throw new Error("Imgur upload failed. No URL returned from the API.");
        }
        
        const imgurLink = imgurResponse.data.imgur;

        const addResponse = await axios.post(`${aryan}/api/album/add`, {
          category,
          videoUrl: imgurLink,
        });

        return api.sendMessage(addResponse.data.message, event.threadID, event.messageID);
      } catch (error) {
        console.error(error);
        return api.sendMessage(`[⚜️]➜ Failed to add video.\nError: ${error.response?.data?.error || error.message}`, event.threadID, event.messageID);
      }
    } else if (args[0] === "list") {
      try {
        const response = await axios.get(`${aryan}/api/category/list`);
        if (response.data.success) {
          const categories = response.data.categories.map((cat, index) => `${index + 1}. ${cat}`).join("\n");
          return api.sendMessage(`𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬:\n\n${categories}`, event.threadID, event.messageID);
        } else {
          return api.sendMessage(`[⚜️]➜ Failed to fetch categories.\nError: ${response.data.error}`, event.threadID, event.messageID);
        }
      } catch (error) {
        return api.sendMessage(`[⚜️]➜ Error while fetching categories from the API. Please check the server and try again later.`, event.threadID, event.messageID);
      }
    } else {
      const categoriesInJson = ["funny", "islamic", "sad", "anime", "lofi", "attitude", "ff", "love", "horny", "baby","romantic","cartoon","pubg","emotional","meme","song","friend","trending","hinata","gojo","car","cat","random","game","asif","azhari","girl","travel","food","nature","tiktok","naruto","phone","editing","neymar","messi","ronaldo","football","hindi","18+"];
      const displayNames = ["𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨", "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐟 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐡𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐛𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨","𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨","𝐜𝐚𝐫𝐭𝐨𝐨𝐧 𝐕𝐢𝐝𝐞𝐨","𝐩𝐮𝐛𝐠 𝐕𝐢𝐝𝐞𝐨","𝐞𝐦𝐨𝐭𝐢𝐨𝐧𝐚𝐥 𝐕𝐢𝐝𝐞𝐨","𝐦𝐞𝐦𝐞 𝐕𝐢𝐝𝐞𝐨","𝐬𝐨𝐧𝐠 𝐕𝐢𝐝𝐞𝐨","𝐟𝐫𝐢𝐞𝐧𝐝 𝐕𝐢𝐝𝐞𝐨","𝐭𝐫𝐞𝐧𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨","𝐡𝐢𝐧𝐚𝐭𝐚 𝐕𝐢𝐝𝐞𝐨","𝐠𝐨𝐣𝐨 𝐕𝐢𝐝𝐞𝐨","𝐜𝐚𝐫 𝐕𝐢𝐝𝐞𝐨","𝐜𝐚𝐭 𝐕𝐢𝐝𝐞𝐨","𝐫𝐚𝐧𝐝𝐨𝐦 𝐕𝐢𝐝𝐞𝐨","𝐠𝐚𝐦𝐞 𝐕𝐢𝐝𝐞𝐨","𝐚𝐬𝐢𝐟 𝐡𝐮𝐣𝐮𝐫 𝐕𝐢𝐝𝐞𝐨","𝐚𝐳𝐡𝐚𝐫𝐢 𝐡𝐮𝐣𝐮𝐫 𝐕𝐢𝐝𝐞𝐨","𝐠𝐢𝐫𝐥 𝐕𝐢𝐝𝐞𝐨","𝐭𝐫𝐚𝐯𝐞𝐥 𝐕𝐢𝐝𝐞𝐨","𝐟𝐨𝐨𝐝 𝐕𝐢𝐝𝐞𝐨","𝐧𝐚𝐭𝐮𝐫𝐞 𝐕𝐢𝐝𝐞𝐨","𝐭𝐢𝐤𝐭𝐨𝐤 𝐕𝐢𝐝𝐞𝐨","𝐧𝐚𝐫𝐮𝐭𝐨 𝐕𝐢𝐝𝐞𝐨","𝐩𝐡𝐨𝐧𝐞 𝐕𝐢𝐝𝐞𝐨","𝐞𝐝𝐢𝐭𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨","𝐍𝐞𝐲𝐦𝐚𝐫 𝐕𝐢𝐝𝐞𝐨","𝐌𝐞𝐬𝐬𝐢 𝐕𝐢𝐝𝐞𝐨","𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐕𝐢𝐝𝐞𝐨","𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨","𝐡𝐢𝐧𝐝𝐢 𝐕𝐢𝐝𝐞𝐨","18+ 𝐕𝐢𝐝𝐞𝐨"];
      const itemsPerPage = 10;
      const page = parseInt(args[0]) || 1;
      const totalPages = Math.ceil(displayNames.length / itemsPerPage);

      if (page < 1 || page > totalPages) {
        return api.sendMessage(`[⚜️]➜ Invalid page! Please choose between 1 - ${totalPages}.`, event.threadID, event.messageID);
      }

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const displayedCategories = displayNames.slice(startIndex, endIndex);

      const message =
        `𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨 𝐋𝐢𝐬𝐭 🎀\n` +
        "𐙚━━━━━━━━━━━━━━━━━ᡣ𐭩\n" +
        displayedCategories.map((option, index) => `${startIndex + index + 1}. ${option}`).join("\n") +
        "\n𐙚━━━━━━━━━━━━━━━━━ᡣ𐭩" +
        `\n♻ | 𝐏𝐚𝐠𝐞 [${page}/${totalPages}]\nℹ | 𝐓𝐲𝐩𝐞 !album ${page + 1} - 𝐭𝐨 𝐬𝐞𝐞 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞.`.repeat(page < totalPages);

      await api.sendMessage(message, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          page,
          startIndex,
          realCategories: categoriesInJson,
          captions: [
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😺",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <✨",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😢",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎶",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <☠️ ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐟 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎮 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <💖 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐡𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🥵 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐛𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🥰 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😍",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐜𝐚𝐫𝐭𝐨𝐨𝐧 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🙅",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐩𝐮𝐛𝐠 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎮",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐞𝐦𝐨𝐭𝐢𝐨𝐧𝐚𝐥 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😌",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐦𝐞𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🐥",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐬𝐨𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎧 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐟𝐫𝐢𝐞𝐧𝐝 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <👭",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐭𝐫𝐞𝐧𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎯",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐡𝐢𝐧𝐚𝐭𝐚 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🧑‍🦰",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐠𝐨𝐣𝐨 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🧔 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐜𝐚𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🚗",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐜𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🐈",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌎",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐠𝐚𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎮",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐚𝐬𝐢𝐟 𝐡𝐮𝐣𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🧑‍🚀",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐚𝐳𝐡𝐚𝐫𝐢 𝐡𝐮𝐣𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <👳 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐠𝐢𝐫𝐥 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <💃",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐭𝐫𝐚𝐯𝐞𝐥 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <👌 ",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐟𝐨𝐨𝐝 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🍔",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐧𝐚𝐭𝐮𝐫𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <❤️",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐭𝐢𝐤𝐭𝐨𝐤 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <💥",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐧𝐚𝐫𝐮𝐭𝐨 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🙋",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐩𝐡𝐨𝐧𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <📱",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐞𝐝𝐢𝐭𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <💻",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐍𝐞𝐲𝐦𝐚𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <⚽",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐌𝐞𝐬𝐬𝐢 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <⚽",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐑𝐨𝐧𝐚𝐥𝐝𝐨 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <⚽",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <⚽",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐡𝐢𝐧𝐝𝐢 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🫂",
            "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 18+ 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🔥",
          ],
        });
      }, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);

    const reply = parseInt(event.body);
    const index = reply - 1;

    if (isNaN(reply) || index < 0 || index >= Reply.realCategories.length) {
      return api.sendMessage("Please reply with a valid number from the list.", event.threadID, event.messageID);
    }

    const category = Reply.realCategories[index];
    const caption = Reply.captions[index];

    try {
      const response = await axios.get(`${aryan}/api/album/videos/${category}`);

      if (!response.data.success) {
        return api.sendMessage(response.data.message, event.threadID, event.messageID);
      }

      const videoUrls = response.data.videos;
      if (!videoUrls || videoUrls.length === 0) {
        return api.sendMessage("[⚜️]➜ 𝐍𝐨 𝐯𝐢𝐝𝐞𝐨𝐬 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲.", event.threadID, event.messageID);
      }

      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      const filePath = path.join(__dirname, "temp_video.mp4");

      const downloadFile = async (url, filePath) => {
        const response = await axios({
          url,
          method: "GET",
          responseType: "stream",
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        return new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      };

      try {
        await downloadFile(randomVideoUrl, filePath);
        api.sendMessage(
          { body: caption, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      } catch (error) {
        api.sendMessage("[⚜️]➜ | 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐭𝐡𝐞 𝐯𝐢𝐝𝐞𝐨.", event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("[⚜️]➜ 𝐄𝐫𝐫𝐨𝐫 𝐰𝐡𝐢𝐥𝐞 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐯𝐢𝐝𝐞𝐨 𝐔𝐑𝐋𝐬 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐀𝐏𝐈.", event.threadID, event.messageID);
    }
  },
};
