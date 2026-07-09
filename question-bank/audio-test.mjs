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
assert(html.includes("function loadVoices"), "缺少系统语音 voice 加载");
assert(html.includes("function playOnlineEnglishAudio"), "缺少在线音频兜底编排");
assert(html.includes("ENGLISH_TTS_SOURCES"), "缺少多在线TTS源配置");
assert(html.includes("translate.google.com/translate_tts"), "缺少Google在线TTS源");
assert(html.includes("fanyi.baidu.com/gettts"), "缺少可播放的在线英语音频源");
assert(html.includes("new Audio("), "未使用浏览器音频播放器");
assert(html.includes("function stopEnglishAudio"), "缺少停止英语音频功能");
assert(html.includes("系统语音"), "缺少系统语音备用提示");
assert(html.includes("speechSynthesis.pause()") && html.includes("speechSynthesis.resume()"), "缺少移动端/平板语音保活");
assert(html.includes("addEventListener?.(\"voiceschanged\"") || html.includes("addEventListener(\"voiceschanged\""), "缺少兼容式voiceschanged监听");
assert(html.includes("}, 4500)"), "缺少系统语音启动超时兜底");
assert(html.includes("系统语音不可用，正在尝试在线音频"), "缺少在线音频降级提示");
assert(html.includes("请确认浏览器允许播放声音"), "缺少用户可理解的失败提示");
assert(html.indexOf("const systemPlayed = await playSystemEnglish(cleaned") < html.indexOf("const onlineResult = await playOnlineEnglishAudio(chunks"), "英语音频应先用系统语音，再用在线音频兜底");

console.log("English audio fallback contract OK");
