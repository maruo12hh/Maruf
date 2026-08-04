const axios = require("axios");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "Toshiro Editz",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Search Pinterest images"
    },
    longDescription: {
      en: "Search and send Pinterest images from Pinterest."
    },
    category: "search",
    guide: {
      en: "{pn} <keyword>\n{pn} <keyword> - <limit>\n\nExamples:\n{pn} Zenitsu\n{pn} Zenitsu - 10"
    }
  },

  onStart: async function ({ message, args }) {
    try {
      const input = args.join(" ").trim();

      if (!input) {
        return message.reply(
          "❌ Please enter a keyword.\n\nExamples:\n• pin Zenitsu\n• pin Zenitsu - 10"
        );
      }

      let keyword = input;
      let limit = 1;

      if (input.includes("-")) {
        const parts = input.split("-");
        keyword = parts[0].trim();
        limit = parseInt(parts[1]) || 1;
      }

      if (!keyword)
        return message.reply("❌ Please provide a valid keyword.");

      if (limit < 1) limit = 1;
      if (limit > 10) limit = 10;

      const api = `https://toshiro-api-editz6t9.vercel.app/api/search/pin?keyword=${encodeURIComponent(keyword)}&limit=${limit}`;

      const { data } = await axios.get(api);

      if (!data || !Array.isArray(data.images) || data.images.length === 0) {
        return message.reply("❌ No images found.");
      }

      const attachments = [];

      for (const url of data.images) {
        try {
          const stream = (
            await axios.get(url, {
              responseType: "stream"
            })
          ).data;

          attachments.push(stream);
        } catch {}
      }

      if (!attachments.length)
        return message.reply("❌ Failed to download images.");

      return message.reply({
        body: `📌 Pinterest Search\n\n🔎 Keyword: ${keyword}\n🖼️ Results: ${attachments.length}`,
        attachment: attachments
      });

    } catch (err) {
      console.error(err.response?.data || err);

      return message.reply(
        "❌ An error occurred while fetching Pinterest images."
      );
    }
  }
};
