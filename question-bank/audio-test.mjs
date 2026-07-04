import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const htmlPath = ["坤泰-暑假.html", "index.html"]
  .map((name) => path.join(root, name))
  .find((target) => fs.existsSync(target));

if (!htmlPath) throw new Error("找不到网页入口");
const html = fs.readFileSync(htmlPath, "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(html.includes('id="englishAudioStatus"'), "缺少英语音频状态提示");
assert(html.includes("function playEnglishAudio"), "缺少在线英语音频播放函数");
assert(html.includes("fanyi.baidu.com/gettts"), "缺少可播放的在线英语音频源");
assert(html.includes("new Audio("), "未使用浏览器音频播放器");
assert(html.includes("function stopEnglishAudio"), "缺少停止英语音频功能");
assert(html.includes("系统语音"), "缺少系统语音备用提示");

console.log("English audio fallback contract OK");
