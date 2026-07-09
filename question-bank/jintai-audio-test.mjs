import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, "jintai.html"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(html.includes('id="readQuestionBtn"'), "缺少英文题目朗读按钮");
assert(html.includes('id="englishAudioStatus"'), "缺少英语音频状态提示");
assert(html.includes("function playEnglishAudio"), "缺少英语音频播放入口");
assert(html.includes("function playSystemEnglish"), "缺少系统语音兜底");
assert(html.includes("function playOnlineEnglishAudio"), "缺少在线音频兜底编排");
assert(html.includes("ENGLISH_TTS_SOURCES"), "缺少多在线TTS源配置");
assert(html.includes("translate.google.com/translate_tts"), "缺少Google在线TTS源");
assert(html.includes("fanyi.baidu.com/gettts"), "缺少百度在线TTS源");
assert(html.includes("speechSynthesis.pause()") && html.includes("speechSynthesis.resume()"), "缺少移动端/平板语音保活");
assert(html.includes("addEventListener?.(\"voiceschanged\"") || html.includes("addEventListener(\"voiceschanged\""), "缺少兼容式voiceschanged监听");
assert(html.includes("}, 4500)"), "缺少系统语音启动超时兜底");
assert(html.includes("系统语音不可用，正在尝试在线音频"), "缺少在线音频降级提示");
assert(html.includes("请确认浏览器允许播放声音"), "缺少用户可理解的失败提示");

console.log("Jintai cross-browser audio contract OK");
