const axios = require("axios");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

const aspectRatioMap = {
  '1:1': { width: 1024, height: 1024 },
  '9:7': { width: 1152, height: 896 },
  '7:9': { width: 896, height: 1152 },
  '19:13': { width: 1216, height: 832 },
  '13:19': { width: 832, height: 1216 },
  '7:4': { width: 1344, height: 768 },
  '4:7': { width: 768, height: 1344 },
  '12:5': { width: 1500, height: 625 },
  '5:12': { width: 640, height: 1530 },
  '16:9': { width: 1344, height: 756 },
  '9:16': { width: 756, height: 1344 },
  '2:3': { width: 1024, height: 1536 },
  '3:2': { width: 1536, height: 1024 }
};

module.exports = {
  config: {
    name: "nijix",
    version: "1.1",
    author: "Vincenzo",
    description: {
      en: "Anime-style image generation with style, preset, and aspect ratio support."
    },
    category: "ai-generated",
    guide: {
      en:
        "{pn} <prompt> [--ar <ratio>] [--s <style>] [--preset <id>] [--1]\n\n" +
        "• Available Styles:\n" +
        "  1. Cinematic\n" +
        "  2. Photographic\n" +
        "  3. Anime\n" +
        "  4. Manga\n" +
        "  5. Digital Art\n" +
        "  6. Pixel Art\n" +
        "  7. Fantasy Art\n" +
        "  8. Neon Punk\n" +
        "  9. 3D Model\n\n" +
        "• Available Presets:\n" +
        "  1. Standard v3.0\n" +
        "  2. Standard v3.1\n" +
        "  3. Light v3.1\n" +
        "  4. Heavy v3.1"
    }
  },

  onStart: async function ({ args, message }) {
    let prompt = args.join(" ");

    const styleMatch = prompt.match(/--style (\d+)/);
    const presetMatch = prompt.match(/--preset (\d+)/);
    const arMatch = prompt.match(/--ar (\d+:\d+)/);

    const styleIndex = styleMatch ? styleMatch[1] : "0";
    const presetIndex = presetMatch ? presetMatch[1] : "0";
    const aspectRatio = arMatch ? arMatch[1] : "1:1";

    prompt = prompt
      .replace(/--style \d+/, "")
      .replace(/--preset \d+/, "")
      .replace(/--ar \d+:\d+/, "")
      .trim();

    if (!prompt || !/^[\x00-\x7F]*$/.test(prompt)) {
      return message.reply("❌ Please provide a valid English prompt.");
    }

    const presets = {
      "0": {
        prompt: `${prompt}, (medium quality, aesthetic, perfect face)`,
        negative_prompt: "nsfw, (low quality, worst quality:1.2), very displeasing, 3d, watermark, signature, ugly, poorly drawn"
      },
      "1": {
        prompt: `${prompt}, masterpiece, best quality`,
        negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name"
      },
      "2": {
        prompt: `${prompt}, masterpiece, best quality, very aesthetic, absurdres`,
        negative_prompt: "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]"
      },
      "3": {
        prompt: `${prompt}, (masterpiece), best quality, very aesthetic, perfect face`,
        negative_prompt: "nsfw, (low quality, worst quality:1.2), very displeasing, 3d, watermark, signature, ugly, poorly drawn"
      },
      "4": {
        prompt: `${prompt}, (masterpiece), (best quality), (ultra-detailed), very aesthetic, illustration, disheveled hair, perfect composition, moist skin, intricate details`,
        negative_prompt: "nsfw, longbody, lowres, bad anatomy, bad hands, missing fingers, pubic hair, extra digit, fewer digits, cropped, worst quality, low quality, very displeasing"
      }
    };

    const styles = {
      "0": { prompt: "", negative_prompt: "" }, // do nothing if style is 0
      "1": {
        prompt: `${prompt}, cinematic still, emotional, harmonious,...
