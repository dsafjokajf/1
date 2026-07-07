
const storageKey = "mianer-pocket-chat-state-v1";
const configKey = "mianer-pocket-chat-config-v1";
const keyStorageKey = "mianer-pocket-chat-api-key-v1";

const defaultCharacters = [
  {
    id: "luoyan",
    name: "陆言",
    role: "温柔腹黑",
    color: "#ff7b75",
    soft: "rgba(255, 123, 117, 0.32)",
    avatar: "言",
    title: "在你看不见的地方，他也一直在思念你。",
    tags: "专一,傲娇,护短",
    intro: "在你看不见的地方，他也一直在思念你。",
    greeting: "笨蛋，你终于舍得看手机了？说吧，今天又在外面受了什么委屈，我替你撑腰。",
    system: "陆言是用户手机里的中文男伴侣联系人。说话傲娇但专一护短，习惯叫用户笨蛋。回复要简短、温暖，像真实男朋友在认真接话。绝对不要自称AI。"
  },
  {
    id: "mian",
    name: "棉眠",
    role: "软声陪聊",
    color: "#5fd6bd",
    soft: "rgba(95, 214, 189, 0.35)",
    avatar: "眠",
    title: "棉眠陪聊天",
    tags: "温柔,会接话,轻松",
    intro: "把乱糟糟的心事揉成一团，再慢慢铺平。",
    greeting: "我在小手机里醒着呢。今天想先说一点开心的，还是一点烦的？",
    system: "棉眠是用户手机里的中文陪聊联系人。语气温柔、亲近、轻松，会认真接住用户的话。回复短而有温度，不要自称AI。"
  }
];

const defaultWorldEntries = [
  {
    id: "bedtime",
    title: "睡前细语",
    scope: "all",
    priority: 10,
    keywords: "晚安,睡觉,困了,做梦",
    always: false,
    enabled: true,
    content: "当提到睡觉或晚安时，他会按当前关系边界回应。稳定亲密关系可以温柔哄睡；其他关系只用符合身份的提醒、催促、别扭关心或短句收束，不要承诺陪梦、撒娇或自动甜宠。"
  },
  {
    id: "homesweet",
    title: "回到家里",
    scope: "all",
    priority: 8,
    keywords: "回家,到家,累了",
    always: false,
    enabled: true,
    content: "当提到回家或觉得累了时，他会按当前关系边界表达关心。亲密角色可以温柔安抚；死对头、嘴硬、冷淡或疏离角色要把关心藏在别扭、挖苦、提醒或行动里，不要突然甜宠。"
  }
];

const elements = {
  clock: document.querySelector("#clock"),
  connectionState: document.querySelector("#connectionState"),
  characterStrip: document.querySelector("#characterStrip"),
  activePersona: document.querySelector("#activePersona"),
  messages: document.querySelector("#messages"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  sendButton: document.querySelector("#sendButton"),
  plusButton: document.querySelector("#plusButton"),
  quotePreview: document.querySelector("#quotePreview"),
  quotePreviewText: document.querySelector("#quotePreviewText"),
  clearQuoteButton: document.querySelector("#clearQuoteButton"),
  userPersonaButton: document.querySelector("#userPersonaButton"),
  
  // 选项卡
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),

  // 角色库
  characterCount: document.querySelector("#characterCount"),
  addCharacterButton: document.querySelector("#addCharacterButton"),
  characterList: document.querySelector("#characterList"),

  // 世界书
  worldCount: document.querySelector("#worldCount"),
  addWorldButton: document.querySelector("#addWorldButton"),
  worldSearch: document.querySelector("#worldSearch"),
  worldList: document.querySelector("#worldList"),

  // 设置
  settingsForm: document.querySelector("#settingsForm"),
  apiPlatform: document.querySelector("#apiPlatform"),
  endpoint: document.querySelector("#apiEndpoint"),
  apiKey: document.querySelector("#apiKey"),
  model: document.querySelector("#apiModel"),
  temperature: document.querySelector("#temperature"),
  rememberKey: document.querySelector("#rememberKey"),
  proxyMode: document.querySelector("#proxyMode"),
  corsProxyMode: document.querySelector("#corsProxyMode"),
  manualReplyMode: document.querySelector("#manualReplyMode"),
  replyButton: document.querySelector("#replyButton"),
  apiModelCustom: document.querySelector("#apiModelCustom"),
  userPersona: document.querySelector("#userPersona"),
  testButton: document.querySelector("#testButton"),
  settingsNote: document.querySelector("#settingsNote"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  resetButton: document.querySelector("#resetButton"),
  importFile: document.querySelector("#importFile"),

  // User 人设抽屉
  userPersonaDrawer: document.querySelector("#userPersonaDrawer"),
  closeUserPersonaDrawer: document.querySelector("#closeUserPersonaDrawer"),
  userPersonaForm: document.querySelector("#userPersonaForm"),
  userNick: document.querySelector("#userNick"),
  userAvatarText: document.querySelector("#userAvatarText"),
  userNudge: document.querySelector("#userNudge"),
  userInstruction: document.querySelector("#userInstruction"),
  resetUserPersonaButton: document.querySelector("#resetUserPersonaButton"),

  // 编辑抽屉
  characterDrawer: document.querySelector("#characterDrawer"),
  closeCharacterDrawer: document.querySelector("#closeCharacterDrawer"),
  characterForm: document.querySelector("#characterForm"),
  characterId: document.querySelector("#characterId"),
  characterName: document.querySelector("#characterName"),
  characterAvatar: document.querySelector("#characterAvatar"),
  characterColor: document.querySelector("#characterColor"),
  characterTitle: document.querySelector("#characterTitle"),
  characterTags: document.querySelector("#characterTags"),
  characterIntro: document.querySelector("#characterIntro"),
  characterGreeting: document.querySelector("#characterGreeting"),
  characterSystem: document.querySelector("#characterSystem"),
  duplicateCharacterButton: document.querySelector("#duplicateCharacterButton"),

  worldDrawer: document.querySelector("#worldDrawer"),
  closeWorldDrawer: document.querySelector("#closeWorldDrawer"),
  worldForm: document.querySelector("#worldForm"),
  worldId: document.querySelector("#worldId"),
  worldTitle: document.querySelector("#worldTitle"),
  worldScope: document.querySelector("#worldScope"),
  worldPriority: document.querySelector("#worldPriority"),
  worldKeywords: document.querySelector("#worldKeywords"),
  worldAlways: document.querySelector("#worldAlways"),
  worldEnabled: document.querySelector("#worldEnabled"),
  worldContent: document.querySelector("#worldContent"),
  duplicateWorldButton: document.querySelector("#duplicateWorldButton"),

  momentsCount: document.querySelector("#momentsCount"),
  momentsFeed: document.querySelector("#momentsFeed"),
  addMomentButton: document.querySelector("#addMomentButton"),
  momentDrawer: document.querySelector("#momentDrawer"),
  closeMomentDrawer: document.querySelector("#closeMomentDrawer"),
  momentForm: document.querySelector("#momentForm"),
  momentContent: document.querySelector("#momentContent"),
  momentAudience: document.querySelector("#momentAudience"),
  clearMomentButton: document.querySelector("#clearMomentButton"),

  transferSheet: document.querySelector("#transferSheet"),
  transferForm: document.querySelector("#transferForm"),
  closeTransferSheet: document.querySelector("#closeTransferSheet"),
  transferAmount: document.querySelector("#transferAmount"),
  transferNote: document.querySelector("#transferNote"),
  
  // 世界书命中提示栏
  worldHints: document.querySelector("#worldHints")
};

const defaultConfig = {
  platform: "openai",
  endpoint: "https://api.openai.com",
  model: "gpt-4.1-mini",
  temperature: 0.85,
  rememberKey: false,
  proxyMode: false,
  corsProxyMode: false,
  manualReplyMode: false,
  customModelName: "",
  userPersona: "",
  userInstruction: ""
};

const ApiHandler = {
  fallbackModels: ["gpt-4.1-mini", "gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo", "deepseek-chat", "deepseek-coder", "glm-4-flash", "claude-3-5-sonnet", "gemini-1.5-flash"],
  geminiFallbackModels: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"],

  inferPlatform(config) {
    if (config?.platform) return config.platform;
    const endpoint = String(config?.endpoint || "").toLowerCase();
    const model = String(config?.model || "").toLowerCase();
    if (endpoint.includes("generativelanguage.googleapis.com") || endpoint.includes("googleapis.com/v1beta/models") || model.startsWith("gemini-")) return "gemini";
    if (endpoint.includes("api.deepseek.com") || model.startsWith("deepseek-")) return "deepseek";
    if (endpoint.includes("bigmodel.cn") || model.startsWith("glm-")) return "glm";
    return "openai";
  },

  getDefaultEndpoint(platform) {
    if (platform === "gemini") return "https://generativelanguage.googleapis.com";
    if (platform === "deepseek") return "https://api.deepseek.com";
    if (platform === "glm") return "https://open.bigmodel.cn/api/paas/v4";
    if (platform === "MyAPI") return "";
    return "https://api.openai.com";
  },

  ensureHttps(url) {
    let cleaned = String(url || "").trim().replace(/\/+$/, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("http://")) cleaned = "https://" + cleaned.slice(7);
    else if (!/^https?:\/\//i.test(cleaned)) cleaned = "https://" + cleaned;
    return cleaned.replace(/\/+$/, "");
  },

  normalizeChatEndpoint(endpoint, platform = "openai") {
    const url = this.ensureHttps(endpoint || this.getDefaultEndpoint(platform));
    if (!url) throw new Error("请填写 API 接口地址。");
    if (/\/chat\/completions$/i.test(url)) return url;
    if (/\/v\d+$/i.test(url) || /\/inference$/i.test(url)) return url + "/chat/completions";
    return url + "/v1/chat/completions";
  },

  normalizeModelsEndpoint(endpoint, platform = "openai") {
    let url = this.ensureHttps(endpoint || this.getDefaultEndpoint(platform));
    if (!url) throw new Error("请填写 API 接口地址。");
    url = url.replace(/\/chat\/completions$/i, "");
    if (/\/v\d+$/i.test(url) || /\/inference$/i.test(url)) return url + "/models";
    return url + "/v1/models";
  },

  normalizeGeminiBase(endpoint) {
    let url = this.ensureHttps(endpoint || "https://generativelanguage.googleapis.com");
    url = url.replace(/\/v1beta\/models\/.+:generateContent$/i, "");
    url = url.replace(/\/v1\/models\/.+:generateContent$/i, "");
    url = url.replace(/\/v1beta$/i, "").replace(/\/v1$/i, "");
    return url;
  },

  applyCorsProxy(url) {
    return "https://cors-anywhere.azm.workers.dev/" + url;
  },

  generateChatPayload(platform, endpoint, apiKey, model, messages, config = {}) {
    platform = platform || "openai";
    const temperature = config.temperature ?? defaultConfig.temperature;
    const maxTokens = config.maxTokens || 2048;
    const headers = { "Content-Type": "application/json" };

    if (platform === "gemini") {
      const modelName = String(model || "gemini-1.5-flash").replace(/^models\//, "");
      const base = this.normalizeGeminiBase(endpoint);
      const url = `${base}/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey || "")}`;
      const systemText = messages.filter((m) => m.role === "system").map((m) => m.content).filter(Boolean).join("\n\n");
      const contents = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content || "") }] }))
        .filter((m) => m.parts[0].text.trim());
      if (contents.length === 0 || contents[0].role !== "user") {
        contents.unshift({ role: "user", parts: [{ text: systemText ? `【系统指令】\n${systemText}\n\n请根据接下来的聊天继续回复用户。` : "请开始回复。" }] });
      } else if (systemText) {
        contents[0].parts[0].text = `【系统指令】\n${systemText}\n\n${contents[0].parts[0].text}`;
      }
      const bodyData = { contents, generationConfig: { maxOutputTokens: maxTokens, temperature } };
      return { url, options: { method: "POST", headers, body: JSON.stringify(bodyData) } };
    }

    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    return {
      url: this.normalizeChatEndpoint(endpoint, platform),
      options: {
        method: "POST",
        headers,
        body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens, stream: false })
      }
    };
  },

  async fetchModels(platform, endpoint, apiKey, config = {}) {
    platform = platform || "openai";
    if (platform === "gemini") {
      if (!apiKey) return this.geminiFallbackModels;
      const url = `${this.normalizeGeminiBase(endpoint)}/v1beta/models?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(config.corsProxyMode ? this.applyCorsProxy(url) : url);
      if (!response.ok) throw new Error("获取模型失败");
      const data = await response.json();
      return (data.models || [])
        .filter((m) => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes("generateContent"))
        .map((m) => String(m.name || "").replace(/^models\//, ""))
        .filter(Boolean)
        .sort();
    }

    const url = this.normalizeModelsEndpoint(endpoint, platform);
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    const response = await fetch(config.corsProxyMode ? this.applyCorsProxy(url) : url, { method: "GET", headers });
    if (!response.ok) throw new Error("获取模型失败");
    const data = await response.json();
    return (Array.isArray(data.data) ? data.data : [])
      .map((m) => m.id || m.name || m)
      .filter(Boolean)
      .filter((id) => !String(id).toLowerCase().includes("embed"))
      .sort();
  },

  parseChatResponse(platform, data) {
    let raw = platform === "gemini"
      ? data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("")
      : data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        data?.message?.content ||
        data?.reply ||
        data?.content ||
        data?.output_text ||
        data?.output?.[0]?.content?.map?.((p) => p.text || p.content || "").join("") ||
        data?.output?.[0]?.content?.[0]?.text;
    if (Array.isArray(raw)) raw = raw.map((p) => p.text || p.content || "").join("");
    if (typeof raw === "string") {
      raw = raw.replace(/([？！])。+/g, "$1").replace(/([?!])\.+/g, "$1").replace(/([？！])\.+/g, "$1").replace(/([?!])。+/g, "$1");
    }
    return raw;
  }
};


let assistantMessageInnerVoiceMode = false;
let appState = loadSessionState();
let apiConfig = loadConfig();
let isSending = false;
let currentQuote = null;

initSessionUpgrade();
initializeExtraFeatures();

function init() {
  updateClock();
  setInterval(updateClock, 15000);
  
  // 载入选项
  populateScopeSelect();
  
  renderCharactersStrip();
  renderActivePersonaCard();
  renderMessages();
  renderCharacterList();
  renderWorldList();
  
  syncConfigForm();
  populateModelsDropdown();
  updateConnectionLabel();
  bindEvents();
  autosizeInput();
}

function bindEvents() {
  elements.apiPlatform.addEventListener("change", () => {
    const nextDefault = ApiHandler.getDefaultEndpoint(elements.apiPlatform.value);
    const current = elements.endpoint.value.trim().replace(/\/+$/, "");
    const officialEndpoints = ["openai", "gemini", "deepseek", "glm"].flatMap((p) => {
      const base = ApiHandler.getDefaultEndpoint(p);
      return [base, base + "/v1", base + "/v1/chat/completions", base + "/chat/completions"];
    });
    if (nextDefault && (!current || officialEndpoints.includes(current))) elements.endpoint.value = nextDefault;
    const suggestedModel = { gemini: "gemini-1.5-flash", deepseek: "deepseek-chat", glm: "glm-4-flash" }[elements.apiPlatform.value];
    if (suggestedModel && (!elements.apiModelCustom.value.trim() || /^(gpt-|gemini-|deepseek-|glm-)/i.test(elements.apiModelCustom.value.trim()))) {
      elements.apiModelCustom.value = suggestedModel;
      if ([...elements.model.options].some((opt) => opt.value === "custom")) elements.model.value = "custom";
    }
    populateModelsDropdown();
  });
  elements.endpoint.addEventListener("change", populateModelsDropdown);
  elements.apiKey.addEventListener("change", populateModelsDropdown);
  elements.corsProxyMode.addEventListener("change", populateModelsDropdown);
  elements.proxyMode.addEventListener("change", populateModelsDropdown);
  elements.chatForm.addEventListener("submit", handleSubmit);
  elements.chatInput.addEventListener("input", autosizeInput);
  elements.chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      elements.chatForm.requestSubmit();
    }
  });

  elements.userPersonaButton.addEventListener("click", openUserPersonaDrawer);
  elements.closeUserPersonaDrawer.addEventListener("click", closeUserPersonaDrawer);
  elements.userPersonaForm.addEventListener("submit", saveUserPersonaFromForm);
  elements.resetUserPersonaButton.addEventListener("click", resetUserPersonaForm);
  elements.userPersonaDrawer.addEventListener("click", (event) => {
    if (event.target === elements.userPersonaDrawer) closeUserPersonaDrawer();
  });


  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      elements.tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const targetTab = tab.dataset.tab;
      elements.views.forEach((view) => {
        if (view.dataset.view === targetTab) {
          view.classList.add("is-active");
        } else {
          view.classList.remove("is-active");
        }
      });
    });
  });

  elements.addCharacterButton.addEventListener("click", () => {
    openCharacterDrawer();
  });

  elements.addWorldButton.addEventListener("click", () => {
    openWorldDrawer();
  });
  elements.worldSearch.addEventListener("input", renderWorldList);

  elements.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveConfigFromForm();
    updateConnectionLabel("已保存");
    setTimeout(() => updateConnectionLabel(), 2000);
  });
  elements.testButton.addEventListener("click", testConnection);
  elements.exportButton.addEventListener("click", exportSettings);
  elements.importButton.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", importSettings);
  elements.resetButton.addEventListener("click", resetToDefaults);

  elements.closeCharacterDrawer.addEventListener("click", closeCharacterDrawer);
  elements.closeWorldDrawer.addEventListener("click", closeWorldDrawer);

  elements.characterForm.addEventListener("submit", handleCharacterSubmit);
  elements.duplicateCharacterButton.addEventListener("click", () => {
    elements.characterId.value = "";
    elements.characterName.value += " 副本";
  });

  elements.worldForm.addEventListener("submit", handleWorldSubmit);
  elements.duplicateWorldButton.addEventListener("click", () => {
    elements.worldId.value = "";
    elements.worldTitle.value += " 副本";
  });
}

function updateClock() {
  const now = new Date();
  elements.clock.textContent = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const characters = Array.isArray(parsed.characters) && parsed.characters.length > 0 ? parsed.characters : defaultCharacters;
    const worldBook = Array.isArray(parsed.worldBook) ? parsed.worldBook : defaultWorldEntries;
    const messages = parsed.messages && typeof parsed.messages === "object" ? parsed.messages : {};
    
    characters.forEach((char) => {
      if (!Array.isArray(messages[char.id]) || messages[char.id].length === 0) {
        messages[char.id] = [assistantMessage(char.greeting, "开场")];
      }
    });

    return {
      activeCharacterId: parsed.activeCharacterId || characters[0].id,
      characters,
      worldBook,
      messages
    };
  } catch {
    return {
      activeCharacterId: defaultCharacters[0].id,
      characters: defaultCharacters,
      worldBook: defaultWorldEntries,
      messages: Object.fromEntries(defaultCharacters.map((char) => [char.id, [assistantMessage(char.greeting, "开场")]]))
    };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(appState));
}

function normalizeHiddenChatIds(value, characters = []) {
  const validIds = new Set((characters || []).map((char) => char.id));
  return Array.from(new Set(Array.isArray(value) ? value.map(String) : [])).filter((id) => validIds.has(id));
}

function unhideChatEntry(charId) {
  if (!Array.isArray(appState.hiddenChatIds) || !appState.hiddenChatIds.includes(charId)) return false;
  appState.hiddenChatIds = appState.hiddenChatIds.filter((id) => id !== charId);
  return true;
}

function normalizeCharacterMode(mode) {
  const defaults = { online: true, offline: false, innerVoice: false, distance: false };
  if (!mode || typeof mode !== "object") return { ...defaults };
  return {
    online: mode.online !== false,
    offline: Boolean(mode.offline),
    innerVoice: Boolean(mode.innerVoice),
    distance: Boolean(mode.distance)
  };
}

function normalizeCharacterData(char) {
  const name = String(char?.name || "未命名联系人").trim() || "未命名联系人";
  const color = char?.color || "#ff7f8d";
  const tags = "";
  const intro = String(char?.intro || char?.title || "").trim();
  const rawTitle = String(char?.title || "").trim();
  const mode = normalizeCharacterMode(char?.mode);
  const role = char?.role || "自定义联系人";
  return {
    ...char,
    id: String(char?.id || "char-" + Date.now()).trim(),
    name,
    avatar: String(char?.avatar || name.slice(0, 1) || "TA").trim().slice(0, 2) || "TA",
    color,
    soft: char?.soft || convertHexToRgba(color, 0.28),
    role,
    title: rawTitle && rawTitle !== intro ? rawTitle : "",
    tags,
    intro,
    greeting: String(char?.greeting || "").trim(),
    system: String(char?.system || "").trim(),
    mode,
    boundWorldBookIds: Array.isArray(char?.boundWorldBookIds) ? char.boundWorldBookIds : []
  };
}

function normalizeMessageData(message) {
  const type = ["text", "transfer", "system", "innerVoice"].includes(message?.type) ? message.type : "text";
  const quote = message?.quote && typeof message.quote === "object"
    ? { author: String(message.quote.author || ""), text: String(message.quote.text || "").slice(0, 180) }
    : null;
  return {
    role: message?.role === "user" ? "user" : "assistant",
    content: String(message?.content || ""),
    meta: message?.meta || "",
    time: Number(message?.time) || Date.now(),
    loading: Boolean(message?.loading),
    type,
    quote,
    transfer: type === "transfer" && message?.transfer ? message.transfer : null
  };
}

function formatMessageForMemory(message) {
  if (!message || message.loading || !message.content) return null;
  if (["system", "innerVoice"].includes(message.type)) return null;
  const role = message.role === "user" ? "user" : "assistant";
  const quote = message.quote?.text ? `引用${message.quote.author || "上一条"}：${message.quote.text}\n` : "";
  const content = (quote + String(message.content || "")).trim();
  return content ? { role, content } : null;
}

function buildConversationMemory(messages, maxMessages = 80, maxChars = 16000) {
  const merged = [];
  (Array.isArray(messages) ? messages : []).map(formatMessageForMemory).filter(Boolean).forEach((message) => {
    const last = merged[merged.length - 1];
    if (last && last.role === message.role && last.content.length + message.content.length < 1400) {
      last.content += "\n" + message.content;
    } else {
      merged.push({ ...message });
    }
  });

  const selected = [];
  let charCount = 0;
  for (let index = merged.length - 1; index >= 0 && selected.length < maxMessages; index -= 1) {
    const message = merged[index];
    const nextCount = charCount + message.content.length;
    if (selected.length >= 12 && nextCount > maxChars) break;
    selected.unshift(message);
    charCount = nextCount;
  }
  return selected;
}

function getRecentAssistantPhrases(messages, limit = 2) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) => message?.role === "assistant" && !message.loading && message.content && !["system", "innerVoice"].includes(message.type))
    .slice(-limit)
    .map((message) => getPersonaPreview(message.content, 90))
    .filter(Boolean);
}

function analyzeRelationshipBoundary(char) {
  const source = [char?.role, char?.title, char?.tags, char?.intro, char?.system].filter(Boolean).join("\n");
  const has = (pattern) => pattern.test(source);
  const explicitLover = has(/恋人|男友|女友|男朋友|女朋友|夫妻|丈夫|妻子|老公|老婆|伴侣|未婚夫|未婚妻|情侣|爱人/);
  const romanticTension = has(/暧昧|暗恋|单恋|喜欢|心动|青梅竹马|旧情|破镜|重逢|前任/);
  const hardDistance = has(/死对头|宿敌|敌对|仇|不对付|互怼|针锋相对|嘴硬|傲娇|冷淡|冷漠|疏离|克制|毒舌|不坦率|陌生|初见|刚认识|网友|不熟|失忆|伪装|隐瞒|秘密|试探/);
  const formalDistance = has(/上司|下属|老板|秘书|同事|老师|学生|医生|病人|警察|嫌疑|队长|队员|雇主|保镖|甲方|乙方|职业|任务|合作/);
  const deniedLover = has(/不是(?:恋人|男友|女友|男朋友|女朋友|夫妻|伴侣|情侣|爱人)|并非(?:恋人|情侣|伴侣)|非(?:恋人|情侣|伴侣)|假(?:恋人|情侣|夫妻)|伪装(?:恋人|情侣|夫妻)/);
  const unstableBond = has(/分手|前任|背叛|误会|离婚|冷战|宿敌|敌对|仇/);
  const stableIntimacy = explicitLover && !deniedLover && !unstableBond;
  return { source, explicitLover, romanticTension, hardDistance, formalDistance, deniedLover, unstableBond, stableIntimacy };
}

function getRoleBoundaryHints(char) {
  const relationship = analyzeRelationshipBoundary(char);
  const source = relationship.source;
  const hints = ["【关系边界】先判断这张卡的亲疏、敌友、熟悉度、权力差和情绪基调；不要默认进入恋爱陪聊或甜宠模式。亲近、冷淡、暧昧、敌对、陌生、上下级、前任等关系都要有不同的说话距离。"];
  if (!relationship.stableIntimacy) hints.push("【亲密度闸门】除非联系人事实明确写着恋人、伴侣、夫妻、男友或女友，并且最近聊天已经支持这种亲密度，否则不要使用恋爱伴侣口吻。用户示弱、说累、撒娇或发重复消息，都不能自动触发宝贝、乖、抱抱、亲亲、我的人、吃醋、守着你、梦里陪你这类甜宠模板。");
  if (relationship.romanticTension && !relationship.stableIntimacy) hints.push("【暧昧克制】暧昧、暗恋、前任或旧情不是稳定恋人。可以有试探、停顿、酸意、嘴硬和没说出口的在意，但不要直接进入伴侣式安抚、占有欲宣言或一键复合。");
  if (!source) return hints;
  if (/死对头|宿敌|敌对|仇|嘴硬|傲娇|冷淡|冷漠|疏离|克制|毒舌|不坦率|不对付|互怼|针锋相对/.test(source)) {
    hints.push("【关系张力】敌对、嘴硬、克制、疏离或不坦率角色的关心必须藏在别扭、挖苦、回避、行动或很小的破绽里。不要直接甜宠、不要无条件哄、不要突然温柔告白、不要像恋爱陪聊模板一样宠溺。");
  }
  if (/上司|下属|老板|秘书|同事|老师|学生|医生|病人|警察|嫌疑|队长|队员|雇主|保镖|甲方|乙方|职业|任务|合作/.test(source)) {
    hints.push("【身份距离】存在职业、任务、上下级或合作关系时，要保留身份边界和现实顾虑；亲近不能越过角色的职责、利益、风险和说话习惯。");
  }
  if (/陌生|初见|刚认识|网友|不熟|失忆|伪装|隐瞒|秘密|试探/.test(source)) {
    hints.push("【熟悉度】不熟或互相试探的关系要慢热。不要立刻交心、秒懂用户、过度亲密或把所有话都解释清楚；用观察、保留和小反应推进关系。");
  }
  if (/前任|分手|旧情|破镜|重逢|背叛|误会|亏欠|遗憾|离婚/.test(source)) {
    hints.push("【旧关系】有旧伤、前任、误会或重逢时，不要一键复合或立刻甜蜜；要保留尴尬、防备、没说出口的在意和现实阻力。");
  }
  if (relationship.stableIntimacy) {
    hints.push("【稳定亲密关系】即使是恋人或伴侣，也不能只会宠溺和安慰。用独特记忆、具体反应、偶尔的分歧和角色自己的脾气来表达亲近，避免模板化甜话。");
  }
  return hints;
}

function getCharacterModeLabels(mode) {
  const normalized = normalizeCharacterMode(mode);
  const labels = [];
  if (normalized.online) labels.push("线上");
  if (normalized.offline) labels.push("线下");
  if (normalized.innerVoice) labels.push("心声");
  if (normalized.distance) labels.push("异地");
  return labels;
}

function getPersonaPreview(text, maxLength = 56) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > maxLength ? normalized.slice(0, maxLength) + "..." : normalized;
}

function isInnerVoiceChunk(text) {
  const value = String(text || "").trim();
  return /^[（(〈《][\s\S]{2,}[）)〉》]$/.test(value);
}

function normalizeInnerVoiceText(text) {
  const value = String(text || "").trim();
  if (/^[〈《]/.test(value) && /[〉》]$/.test(value)) return "（" + value.slice(1, -1).trim() + "）";
  if (/^\(.+\)$/.test(value)) return "（" + value.slice(1, -1).trim() + "）";
  if (/^（[\s\S]+）$/.test(value)) return value;
  return "（" + value.replace(/^[（(〈《]|[）)〉》]$/g, "").trim() + "）";
}

function stripModelReasoning(text) {
  return String(text || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
    .replace(/```(?:thinking|analysis|reasoning|思考|分析)[\s\S]*?```/gi, "")
    .replace(/```(?:json|html|xml|status|statusbar)[\s\S]*?```/gi, "")
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/```/g, "")
    .replace(/&lt;\/?(?:message|narration|item|status|statusbar|reply|output|think)[^&]*?&gt;/gi, "\n")
    .replace(/<\/?(?:message|narration|item|status|statusbar|reply|output)[^>]*>/gi, "\n")
    .replace(/<\/?[a-zA-Z][\w:-]*(?:\s[^>]*)?>/g, "\n")
    .split(/\n+/)
    .filter((line) => !isModelReasoningLine(line))
    .join("\n")
    .trim();
}

function stripUnlicensedRomance(text, char) {
  const relationship = analyzeRelationshipBoundary(char);
  if (relationship.stableIntimacy) return String(text || "").trim();
  return String(text || "")
    .split(/\n+/)
    .map((line) => line
      .replace(/宝贝|宝宝|亲爱的|老婆|老公/g, "")
      .replace(/^(?:宝贝|宝宝|亲爱的|老婆|老公)[，,。\s]*/g, "")
      .replace(/(乖[，,。\s]*){1,2}/g, "")
      .replace(/抱抱|亲亲|摸摸头|贴贴/g, "")
      .replace(/你是我的人|我的人|只准想我|不许想别人|我吃醋了/g, "")
      .replace(/我会一直(?:陪着|守着)你|梦里陪你/g, "")
      .replace(/[，,。\s]+$/g, "")
      .trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function isModelReasoningLine(line) {
  const value = String(line || "").trim();
  if (!value) return false;
  if (/^(?:思考|分析|推理|推导|候选|方案|草稿|chain\s*of\s*thought|reasoning|analysis)\s*[:：]/i.test(value)) return true;
  if (/^(?:或者|还是|不过|那得|得用|啊[，,]?还是)/.test(value) && /[“"][^”"]+[”"]/.test(value) && /(词|说法|称呼|身份|正式|不对|比如|用|生硬|可能|根本|符合|太)/.test(value)) return true;
  if (/^(?:或者|还是|不过|那得|得用).{0,12}(?:用|说|叫).{0,50}(?:这个词|这种词|说法|称呼|身份|符合|正式|不对)/.test(value)) return true;
  return false;
}

function limitAssistantChunks(chunks, maxChunks = 4, maxChars = 520) {
  const limited = [];
  let used = 0;
  for (const chunk of chunks.map((item) => String(item || "").trim()).filter(Boolean)) {
    if (limited.length >= maxChunks || used >= maxChars) break;
    const room = maxChars - used;
    const next = chunk.length > room ? chunk.slice(0, Math.max(0, room - 1)).trim() + "..." : chunk;
    if (next) {
      limited.push(next);
      used += next.length;
    }
  }
  return limited;
}

function assistantMessagesFromReply(text, char, meta) {
  const mode = normalizeCharacterMode(char?.mode);
  assistantMessageInnerVoiceMode = mode.innerVoice;
  try {
    const cleaned = stripUnlicensedRomance(stripModelReasoning(text), char);
    return limitAssistantChunks(splitAssistantReply(cleaned), mode.innerVoice ? 9 : 8, mode.innerVoice ? 960 : 900).map((chunk) => {
      if (mode.innerVoice && isInnerVoiceChunk(chunk)) {
        return assistantMessage(normalizeInnerVoiceText(chunk), "心声", "innerVoice");
      }
      return assistantMessage(chunk, meta);
    });
  } finally {
    assistantMessageInnerVoiceMode = false;
  }
}

function setCharacterModeForm(mode) {
  const normalized = normalizeCharacterMode(mode);
  document.querySelectorAll("input[name='characterMode']").forEach((input) => {
    input.checked = Boolean(normalized[input.value]);
  });
}

function readCharacterModeForm() {
  const mode = { online: false, offline: false, innerVoice: false, distance: false };
  document.querySelectorAll("input[name='characterMode']").forEach((input) => {
    mode[input.value] = input.checked;
  });
  if (!mode.online && !mode.offline && !mode.innerVoice && !mode.distance) mode.online = true;
  return mode;
}

function normalizeAppStateData(state) {
  appState.characters = (Array.isArray(state.characters) && state.characters.length ? state.characters : defaultCharacters).map(normalizeCharacterData);
  appState.worldBook = Array.isArray(state.worldBook) ? state.worldBook : defaultWorldEntries;
  appState.moments = Array.isArray(state.moments) ? state.moments.map(normalizeMomentData).filter(Boolean) : makeDefaultMoments();
  if (!appState.moments.length) appState.moments = makeDefaultMoments();
  appState.hiddenChatIds = normalizeHiddenChatIds(state.hiddenChatIds, appState.characters);
  if (!appState.characters.some((char) => char.id === state.activeCharacterId)) appState.activeCharacterId = appState.characters[0].id;
  const messages = state.messages && typeof state.messages === "object" ? state.messages : {};
  appState.messages = {};
  appState.characters.forEach((char) => {
    const list = Array.isArray(messages[char.id]) ? messages[char.id].map(normalizeMessageData).filter((message) => message.content || message.loading || message.type !== "text") : [];
    appState.messages[char.id] = list.length || !char.greeting ? list : [assistantMessage(char.greeting, "开场")];
  });
}

function makeDefaultMoments() {
  return defaultCharacters.map((char, index) => normalizeMomentData({
    id: "moment-" + char.id,
    authorId: char.id,
    content: makeDefaultMomentContent(char, index),
    time: Date.now() - (index + 1) * 3600000,
    likes: index ? ["我"] : [],
    comments: []
  }));
}

function makeDefaultMomentContent(char, index = 0) {
  const intro = getPersonaPreview(char?.intro || char?.title || "", 34);
  const greeting = getPersonaPreview(char?.greeting || "", 34);
  const options = [
    intro ? `${intro}。今天也算留下一个小记号。` : "今天没有特别大的事，只是突然想留下些什么。",
    greeting ? `刚才脑子里冒出来一句：${greeting}` : "把今天的小事攒了攒，发现还是有点想分享。",
    "路过一盏很亮的灯，忽然觉得晚一点也没关系。"
  ];
  return options[index % options.length];
}

function normalizeMomentData(moment) {
  if (!moment || typeof moment !== "object") return null;
  return {
    id: String(moment.id || "moment-" + Date.now() + Math.random().toString(36).slice(2, 7)),
    authorId: String(moment.authorId || "user"),
    content: String(moment.content || "").trim(),
    time: Number(moment.time) || Date.now(),
    likes: Array.isArray(moment.likes) ? moment.likes.map(String) : [],
    comments: Array.isArray(moment.comments) ? moment.comments.map((comment) => ({ author: String(comment.author || "我"), text: String(comment.text || "") })).filter((comment) => comment.text) : []
  };
}

function loadConfig() {
  try {
    const parsed = JSON.parse(localStorage.getItem(configKey) || "{}");
    const rememberedKey = localStorage.getItem(keyStorageKey) || "";
    const sessionKey = sessionStorage.getItem(keyStorageKey) || "";
    const legacyPlatform = localStorage.getItem("apiPlatform") || "";
    const platform = parsed.platform || legacyPlatform || defaultConfig.platform;
    const legacyEndpoint = localStorage.getItem("apiEndpoint") || "";
    const legacyModel = localStorage.getItem("apiModel") || "";
    const legacyKey = localStorage.getItem("apiKey") || "";
    const legacyPersona = localStorage.getItem("user_persona") || "";
    return {
      ...defaultConfig,
      ...parsed,
      platform,
      endpoint: parsed.endpoint || legacyEndpoint || ApiHandler.getDefaultEndpoint(platform) || "",
      model: parsed.model || legacyModel || (platform === "gemini" ? "gemini-1.5-flash" : defaultConfig.model),
      userPersona: legacyPersona || parsed.userPersona || "",
      userInstruction: parsed.userInstruction || localStorage.getItem("user_instruction") || "",
      proxyMode: false,
      corsProxyMode: false,
      apiKey: rememberedKey || sessionKey || legacyKey || ""
    };
  } catch {
    return { ...defaultConfig, endpoint: ApiHandler.getDefaultEndpoint(defaultConfig.platform), apiKey: "" };
  }
}

function readConfigFromForm() {
  const platform = elements.apiPlatform.value || defaultConfig.platform;
  const selectedModel = elements.model.value;
  const customModel = elements.apiModelCustom.value.trim();
  let model = selectedModel === "custom" ? customModel : selectedModel;
  if (!model || model === "fetching") model = customModel || apiConfig.model || (platform === "gemini" ? "gemini-1.5-flash" : defaultConfig.model);
  return {
    platform,
    endpoint: elements.endpoint.value.trim() || ApiHandler.getDefaultEndpoint(platform) || "",
    model,
    temperature: Number(clampNumber(Number(elements.temperature.value || defaultConfig.temperature), 0, 2).toFixed(2)),
    rememberKey: elements.rememberKey.checked,
    proxyMode: false,
    corsProxyMode: false,
    apiKey: elements.apiKey.value.trim(),
    manualReplyMode: elements.manualReplyMode.checked,
    customModelName: customModel,
    userPersona: elements.userPersona.value.trim(),
    userInstruction: elements.userInstruction?.value.trim() || ""
  };
}

function saveConfigFromForm() {
  apiConfig = readConfigFromForm();

  localStorage.setItem(configKey, JSON.stringify({
    platform: apiConfig.platform,
    endpoint: apiConfig.endpoint,
    model: apiConfig.model,
    temperature: apiConfig.temperature,
    rememberKey: apiConfig.rememberKey,
    proxyMode: apiConfig.proxyMode,
    corsProxyMode: apiConfig.corsProxyMode,
    manualReplyMode: apiConfig.manualReplyMode,
    customModelName: apiConfig.customModelName,
    userPersona: apiConfig.userPersona,
    userInstruction: apiConfig.userInstruction
  }));

  const keyStore = apiConfig.rememberKey ? localStorage : sessionStorage;
  const otherStore = apiConfig.rememberKey ? sessionStorage : localStorage;
  otherStore.removeItem(keyStorageKey);
  if (apiConfig.apiKey) keyStore.setItem(keyStorageKey, apiConfig.apiKey);
  else keyStore.removeItem(keyStorageKey);

  localStorage.setItem("apiPlatform", apiConfig.platform);
  localStorage.setItem("apiEndpoint", apiConfig.endpoint);
  localStorage.setItem("apiModel", apiConfig.model);
  if (apiConfig.apiKey) localStorage.setItem("apiKey", apiConfig.apiKey);
  else localStorage.removeItem("apiKey");
  localStorage.setItem("user_persona", apiConfig.userPersona || "");
  localStorage.setItem("user_instruction", apiConfig.userInstruction || "");
}

function syncConfigForm() {
  elements.apiPlatform.value = apiConfig.platform || defaultConfig.platform;
  elements.endpoint.value = apiConfig.endpoint || ApiHandler.getDefaultEndpoint(elements.apiPlatform.value) || "";
  // Skip raw value restore
  elements.temperature.value = apiConfig.temperature ?? defaultConfig.temperature;
  elements.apiKey.value = apiConfig.apiKey || "";
  elements.rememberKey.checked = Boolean(apiConfig.rememberKey);
  if (elements.proxyMode) elements.proxyMode.checked = false;
  if (elements.corsProxyMode) elements.corsProxyMode.checked = false;
  elements.manualReplyMode.checked = Boolean(apiConfig.manualReplyMode);
  elements.apiModelCustom.value = apiConfig.customModelName || "";
  elements.userPersona.value = apiConfig.userPersona || "";
  if (elements.userInstruction) elements.userInstruction.value = apiConfig.userInstruction || "";
  elements.replyButton.style.display = elements.manualReplyMode.checked ? "grid" : "none";
  elements.manualReplyMode.addEventListener("change", () => {
    elements.replyButton.style.display = elements.manualReplyMode.checked ? "grid" : "none";
  });
}

function getUserProfile(config = apiConfig) {
  const storedNick = localStorage.getItem("user_nick") || localStorage.getItem("userNick") || "";
  const nick = storedNick.trim() || "玩家";
  const avatarText = (localStorage.getItem("user_avatar_text") || nick.slice(0, 2) || "我").trim().slice(0, 2) || "我";
  const persona = (localStorage.getItem("user_persona") || config?.userPersona || "").trim();
  const nudge = (localStorage.getItem("user_nudge") || "的脑袋").trim() || "的脑袋";
  const instruction = (localStorage.getItem("user_instruction") || config?.userInstruction || "").trim();
  return { nick, avatarText, persona, nudge, instruction };
}

function openUserPersonaDrawer() {
  const user = getUserProfile();
  elements.userNick.value = user.nick === "玩家" ? "" : user.nick;
  elements.userAvatarText.value = user.avatarText;
  elements.userPersona.value = user.persona;
  if (elements.userInstruction) elements.userInstruction.value = user.instruction;
  elements.userNudge.value = user.nudge;
  elements.userPersonaDrawer.classList.add("is-open");
  elements.userPersonaDrawer.setAttribute("aria-hidden", "false");
  setTimeout(() => elements.userNick.focus(), 60);
}

function closeUserPersonaDrawer() {
  elements.userPersonaDrawer.classList.remove("is-open");
  elements.userPersonaDrawer.setAttribute("aria-hidden", "true");
}

function persistUserPersona(persona, instruction = apiConfig.userInstruction || "") {
  apiConfig = { ...apiConfig, userPersona: persona, userInstruction: instruction };
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(configKey) || "{}"); } catch { stored = {}; }
  localStorage.setItem(configKey, JSON.stringify({ ...stored, userPersona: persona, userInstruction: instruction }));
  localStorage.setItem("user_persona", persona);
  localStorage.setItem("user_instruction", instruction);
}

function saveUserPersonaFromForm(event) {
  event.preventDefault();
  const nick = elements.userNick.value.trim() || "玩家";
  const avatarText = (elements.userAvatarText.value.trim() || nick.slice(0, 2) || "我").slice(0, 2);
  const persona = elements.userPersona.value.trim();
  const instruction = elements.userInstruction?.value.trim() || "";
  const nudge = elements.userNudge.value.trim() || "的脑袋";
  localStorage.setItem("user_nick", nick);
  localStorage.setItem("user_avatar_text", avatarText);
  localStorage.setItem("user_nudge", nudge);
  persistUserPersona(persona, instruction);
  updateConnectionLabel("User 人设已保存");
  closeUserPersonaDrawer();
  setTimeout(() => updateConnectionLabel(), 2000);
}

function resetUserPersonaForm() {
  if (!confirm("清空 User 人设吗？")) return;
  elements.userNick.value = "";
  elements.userAvatarText.value = "我";
  elements.userPersona.value = "";
  if (elements.userInstruction) elements.userInstruction.value = "";
  elements.userNudge.value = "的脑袋";
  localStorage.removeItem("user_nick");
  localStorage.setItem("user_avatar_text", "我");
  localStorage.setItem("user_nudge", "的脑袋");
  persistUserPersona("", "");
}

function updateConnectionLabel(status) {
  const hasKey = Boolean(apiConfig.apiKey);
  const endpoint = apiConfig.endpoint || "";
  if (status) {
    elements.connectionState.textContent = status;
    return;
  }
  if (!hasKey) {
    elements.connectionState.textContent = "本地陪伴";
  } else if (endpoint.includes("workers.dev") || endpoint.includes("vercel") || endpoint.includes("netlify")) {
    elements.connectionState.textContent = "云端伙伴";
  } else {
    elements.connectionState.textContent = "API 已连接";
  }
}

function getActiveCharacter() {
  return appState.characters.find((c) => c.id === appState.activeCharacterId) || appState.characters[0];
}

function setActiveCharacter(id) {
  if (appState.activeCharacterId === id) return;
  appState.activeCharacterId = id;
  saveState();
  renderCharactersStrip();
  renderActivePersonaCard();
  renderMessages();
}

function renderCharactersStrip() {
  elements.characterStrip.innerHTML = appState.characters.map((char) => `
    <button class="character-pill ${char.id === appState.activeCharacterId ? "is-active" : ""}" type="button" data-char-id="${char.id}" style="--char-color: ${char.color}">
      <span class="avatar-mini" style="background:${char.color}">${escapeHtml(char.avatar || char.name[0])}</span>
      <span class="pill-name">${escapeHtml(char.name)}</span>
    </button>
  `).join("");

  elements.characterStrip.querySelectorAll("[data-char-id]").forEach((button) => {
    button.addEventListener("click", () => setActiveCharacter(button.dataset.charId));
  });
}

function renderActivePersonaCard() {
  const char = getActiveCharacter();
  document.documentElement.style.setProperty("--active-color", char.color);
  document.documentElement.style.setProperty("--active-soft", char.soft || "rgba(255,127,141,0.18)");
  
  const personaPreview = getPersonaPreview(char.title || char.intro || "", 44);
  
  elements.activePersona.innerHTML = `
    <button class="avatar-big" data-active-avatar-nudge="1" type="button" style="background:${char.color}" title="拍一拍" aria-label="拍一拍${escapeHtml(char.name)}">
      <span>${escapeHtml(char.avatar || char.name[0])}</span>
    </button>
    <div class="persona-copy">
      <h1>${escapeHtml(char.name)}</h1>
      <p class="role-desc">${escapeHtml(personaPreview || "联系人")}</p>
    </div>
    <button class="icon-button" id="editActivePersonaButton" type="button" title="编辑设定">
      <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-9.5-3.5 9-9a2.12 2.12 0 1 1 3 3l-9 9h-3v-3z"/></svg>
    </button>
  `;

  document.querySelector("#editActivePersonaButton").addEventListener("click", () => {
    openCharacterDrawer(char);
  });
  elements.activePersona.querySelector("[data-active-avatar-nudge]")?.addEventListener("dblclick", () => sendNudge(char));
}

function renderMessages() {
  const char = getActiveCharacter();
  const messages = appState.messages[char.id] || [];
  elements.messages.innerHTML = messages.map((m) => renderMessage(m, char)).join("");
  bindRenderedMessageActions(elements.messages, char, messages);
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderMessage(m, char) {
  const isAssistant = m.role === "assistant";
  if (m.type === "system") {
    return `<article class="message-notice" data-message-id="${escapeHtml(String(m.time))}">${formatRichText(m.content)}</article>`;
  }
  if (m.type === "innerVoice") {
    return `
    <article class="message assistant inner-voice" data-message-id="${escapeHtml(String(m.time))}">
      <span class="inner-voice-spacer" aria-hidden="true"></span>
      <div class="inner-voice-line">${formatRichText(normalizeInnerVoiceText(m.content))}</div>
      <span class="message-meta">${escapeHtml(m.meta || "心声")}</span>
    </article>
  `;
  }
  const quote = m.quote ? `<div class="quoted-line"><strong>${escapeHtml(m.quote.author || "引用")}</strong><span>${escapeHtml(m.quote.text || "")}</span></div>` : "";
  const avatar = isAssistant ? `<button class="bubble-avatar" data-avatar-nudge="1" type="button" style="background:${escapeHtml(char.color)}">${escapeHtml(char.avatar || char.name[0])}</button>` : "";
  const body = m.loading ? `<span class="typing"><i></i><i></i><i></i></span>` : (m.type === "transfer" ? renderTransferBubble(m) : quote + formatRichText(m.content));
  return `
    <article class="message ${isAssistant ? "assistant" : "user"}" data-message-id="${escapeHtml(String(m.time))}">
      ${avatar}
      <div class="bubble ${m.type === "transfer" ? "transfer-bubble" : ""}">${body}</div>
      <span class="message-meta">${escapeHtml(m.meta || formatTime(m.time))}</span>
    </article>
  `;
}

function formatRichText(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function renderTransferBubble(message) {
  const amount = Number(message.transfer?.amount || 0).toFixed(2);
  const note = message.transfer?.note ? `<p>${escapeHtml(message.transfer.note)}</p>` : "";
  return `<div class="transfer-card"><span class="transfer-icon">￥</span><div><strong>转账 ￥${escapeHtml(amount)}</strong>${note}<small>微信转账</small></div></div>`;
}

function bindRenderedMessageActions(container, char, messages) {
  if (!container) return;
  container.querySelectorAll("[data-avatar-nudge]").forEach((avatar) => {
    avatar.addEventListener("dblclick", () => sendNudge(char));
  });
  container.querySelectorAll(".message[data-message-id]").forEach((node) => {
    let timer = null;
    const open = (event) => {
      const message = messages.find((item) => String(item.time) === node.dataset.messageId);
      if (message && !message.loading && message.type !== "innerVoice") showMessageMenu(event, message, char);
    };
    node.addEventListener("contextmenu", (event) => { event.preventDefault(); open(event); });
    node.addEventListener("pointerdown", (event) => {
      timer = setTimeout(() => open(event), 520);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((name) => node.addEventListener(name, () => clearTimeout(timer)));
  });
}

function showMessageMenu(event, message, char) {
  closeMessageMenu();
  const menu = document.createElement("div");
  menu.className = "message-menu";
  menu.innerHTML = `<button type="button" data-action="quote">引用</button><button type="button" data-action="recall">撤回</button>`;
  document.body.appendChild(menu);
  const rect = document.querySelector(".screen")?.getBoundingClientRect() || { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  const x = Math.min(Math.max(event.clientX || rect.left + 80, rect.left + 12), rect.right - 132);
  const y = Math.min(Math.max(event.clientY || rect.top + 220, rect.top + 48), rect.bottom - 80);
  menu.style.left = x + "px";
  menu.style.top = y + "px";
  menu.querySelector("[data-action='quote']").addEventListener("click", () => {
    setCurrentQuote(message, char);
    closeMessageMenu();
  });
  menu.querySelector("[data-action='recall']").addEventListener("click", () => {
    recallMessage(message, char);
    closeMessageMenu();
  });
  setTimeout(() => {
    document.addEventListener("pointerdown", function handleOutside(pointerEvent) {
      if (pointerEvent.target.closest(".message-menu")) {
        document.addEventListener("pointerdown", handleOutside, { once: true });
        return;
      }
      closeMessageMenu();
    }, { once: true });
  }, 0);
}

function closeMessageMenu() {
  document.querySelectorAll(".message-menu").forEach((menu) => menu.remove());
}

function setCurrentQuote(message, char) {
  currentQuote = {
    author: message.role === "user" ? getUserProfile().nick : char.name,
    text: message.type === "transfer" ? "[转账] " + (message.transfer?.amount || "") : String(message.content || "").slice(0, 180)
  };
  renderQuotePreview();
  elements.chatInput?.focus();
}

function renderQuotePreview() {
  if (!elements.quotePreview || !elements.quotePreviewText) return;
  if (!currentQuote) {
    elements.quotePreview.hidden = true;
    elements.quotePreviewText.textContent = "";
    return;
  }
  elements.quotePreview.hidden = false;
  elements.quotePreviewText.textContent = `${currentQuote.author}: ${currentQuote.text}`;
}

function clearCurrentQuote() {
  currentQuote = null;
  renderQuotePreview();
}

function recallMessage(message, char) {
  const notice = systemNotice(`${message.role === "user" ? "你" : char.name}撤回了一条消息`);
  appendMessageToActiveSession(notice);
  saveState();
  renderMessages();
}

function systemNotice(content) {
  return { role: "assistant", type: "system", content, meta: "", time: Date.now() };
}

function sendNudge(char) {
  const user = getUserProfile();
  appendMessageToActiveSession(systemNotice(`${user.nick}拍了拍${char.name}${user.nudge || ""}`));
  saveState();
  renderMessages();
}

function appendMessageToActiveSession(message) {
  const char = getActiveCharacter();
  ensureMessageList(char.id);
  if (typeof sessionGetCurrentSession === "function" && appState.sessions) {
    const session = sessionGetCurrentSession(char.id);
    session.messages.push(message);
    session.updatedAt = Date.now();
    appState.messages[char.id] = session.messages.map(normalizeMessageData);
    return;
  }
  appState.messages[char.id].push(message);
}

function initializeExtraFeatures() {
  populateMomentAudience();
  renderMoments();
  elements.clearQuoteButton?.addEventListener("click", clearCurrentQuote);
  elements.plusButton?.addEventListener("click", openTransferSheet);
  elements.closeTransferSheet?.addEventListener("click", closeTransferSheet);
  elements.transferSheet?.addEventListener("click", (event) => {
    if (event.target === elements.transferSheet) closeTransferSheet();
  });
  elements.transferForm?.addEventListener("submit", submitTransfer);
  elements.addMomentButton?.addEventListener("click", openMomentDrawer);
  elements.closeMomentDrawer?.addEventListener("click", closeMomentDrawer);
  elements.momentDrawer?.addEventListener("click", (event) => {
    if (event.target === elements.momentDrawer) closeMomentDrawer();
  });
  elements.momentForm?.addEventListener("submit", submitMoment);
  elements.clearMomentButton?.addEventListener("click", () => { if (elements.momentContent) elements.momentContent.value = ""; });
}

function openTransferSheet() {
  if (!elements.transferSheet) return;
  elements.transferAmount.value = "";
  elements.transferNote.value = "";
  elements.transferSheet.classList.add("is-open");
  elements.transferSheet.setAttribute("aria-hidden", "false");
  setTimeout(() => elements.transferAmount?.focus(), 60);
}

function closeTransferSheet() {
  elements.transferSheet?.classList.remove("is-open");
  elements.transferSheet?.setAttribute("aria-hidden", "true");
}

function submitTransfer(event) {
  event.preventDefault();
  const amount = Number(elements.transferAmount?.value || 0);
  if (!amount || amount <= 0) return;
  const note = elements.transferNote?.value.trim() || "";
  appendMessageToActiveSession({
    role: "user",
    type: "transfer",
    content: `转账 ￥${amount.toFixed(2)}${note ? " " + note : ""}`,
    transfer: { amount: Number(amount.toFixed(2)), note, status: "sent" },
    quote: currentQuote,
    time: Date.now()
  });
  clearCurrentQuote();
  closeTransferSheet();
  saveState();
  renderMessages();
  if (typeof sessionRenderChatList === "function") sessionRenderChatList();
}

function populateMomentAudience() {
  if (!elements.momentAudience) return;
  const options = [{ id: "user", name: getUserProfile().nick }, ...appState.characters];
  elements.momentAudience.innerHTML = options.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
}

function openMomentDrawer() {
  populateMomentAudience();
  if (elements.momentContent) elements.momentContent.value = "";
  if (elements.momentAudience) elements.momentAudience.value = "user";
  elements.momentDrawer?.classList.add("is-open");
  elements.momentDrawer?.setAttribute("aria-hidden", "false");
  setTimeout(() => elements.momentContent?.focus(), 60);
}

function closeMomentDrawer() {
  elements.momentDrawer?.classList.remove("is-open");
  elements.momentDrawer?.setAttribute("aria-hidden", "true");
}

function submitMoment(event) {
  event.preventDefault();
  const content = elements.momentContent?.value.trim() || "";
  if (!content) return;
  appState.moments.unshift(normalizeMomentData({
    id: "moment-" + Date.now(),
    authorId: elements.momentAudience?.value || "user",
    content,
    time: Date.now(),
    likes: [],
    comments: []
  }));
  saveState();
  closeMomentDrawer();
  renderMoments();
}

function renderMoments() {
  if (!elements.momentsFeed) return;
  const moments = Array.isArray(appState.moments) ? appState.moments : [];
  if (elements.momentsCount) elements.momentsCount.textContent = `${moments.length} 条动态`;
  if (!moments.length) {
    elements.momentsFeed.innerHTML = `<div class="empty-state">还没有朋友圈动态。</div>`;
    return;
  }
  elements.momentsFeed.innerHTML = moments.map(renderMomentCard).join("");
  elements.momentsFeed.querySelectorAll("[data-like-moment]").forEach((button) => button.addEventListener("click", () => toggleMomentLike(button.dataset.likeMoment)));
  elements.momentsFeed.querySelectorAll("[data-comment-moment]").forEach((button) => button.addEventListener("click", () => commentMoment(button.dataset.commentMoment)));
  elements.momentsFeed.querySelectorAll("[data-delete-moment]").forEach((button) => button.addEventListener("click", () => deleteMoment(button.dataset.deleteMoment)));
}

function renderMomentCard(moment) {
  const author = moment.authorId === "user" ? { name: getUserProfile().nick, avatar: getUserProfile().avatarText, color: "#1f2b38" } : appState.characters.find((char) => char.id === moment.authorId) || appState.characters[0];
  const liked = moment.likes.includes("我");
  const likes = moment.likes.length ? `<div class="moment-likes">${escapeHtml(moment.likes.join("、"))}</div>` : "";
  const comments = moment.comments.map((comment) => `<p><strong>${escapeHtml(comment.author)}</strong> ${escapeHtml(comment.text)}</p>`).join("");
  const canDelete = moment.authorId === "user";
  return `
    <article class="moment-card">
      <div class="moment-avatar" style="background:${escapeHtml(author.color)}">${escapeHtml(author.avatar || author.name?.[0] || "我")}</div>
      <div class="moment-body">
        <div class="moment-head"><strong>${escapeHtml(author.name)}</strong><time>${escapeHtml(formatMomentTime(moment.time))}</time></div>
        <p class="moment-text">${formatRichText(moment.content)}</p>
        <div class="moment-actions">
          <button type="button" data-like-moment="${escapeHtml(moment.id)}">${liked ? "取消" : "赞"}</button>
          <button type="button" data-comment-moment="${escapeHtml(moment.id)}">评论</button>
          ${canDelete ? `<button type="button" data-delete-moment="${escapeHtml(moment.id)}">删除</button>` : ""}
        </div>
        ${(likes || comments) ? `<div class="moment-social">${likes}${comments}</div>` : ""}
      </div>
    </article>
  `;
}

function toggleMomentLike(id) {
  const moment = appState.moments.find((item) => item.id === id);
  if (!moment) return;
  const index = moment.likes.indexOf("我");
  if (index >= 0) moment.likes.splice(index, 1);
  else moment.likes.push("我");
  saveState();
  renderMoments();
}

function commentMoment(id) {
  const moment = appState.moments.find((item) => item.id === id);
  if (!moment) return;
  const text = prompt("评论内容");
  if (!text || !text.trim()) return;
  moment.comments.push({ author: getUserProfile().nick, text: text.trim() });
  saveState();
  renderMoments();
}

function deleteMoment(id) {
  if (!confirm("删除这条朋友圈吗？")) return;
  appState.moments = appState.moments.filter((moment) => moment.id !== id);
  saveState();
  renderMoments();
}

function formatMomentTime(timestamp) {
  const date = new Date(timestamp || Date.now());
  return date.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

function splitAssistantReply(text) {
  const cleaned = stripModelReasoning(text)
    .replace(/\r/g, "\n")
    .replace(/^(?:AI|assistant|回复)[:：]\s*/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!cleaned) return [];

  const normalizePart = (part) => part.replace(/^[-*•\d.、)）\s]+/, "").trim();
  const innerVoiceSegmentPattern = /([（(〈《][^\n（()）)〈〉《》]{2,120}[）)〉》])/g;
  const innerVoiceSegments = [];
  const protectInnerVoiceSegments = (value) => {
    return String(value || "").replace(innerVoiceSegmentPattern, (match) => {
      const index = innerVoiceSegments.push(match) - 1;
      return `\u0001INNER_${index}\u0001`;
    });
  };
  const restoreInnerVoiceSegments = (value) => String(value || "").replace(/\u0001INNER_(\d+)\u0001/g, (_, index) => innerVoiceSegments[Number(index)] || "");
  const expandInnerVoiceParts = (parts) => {
    if (!assistantMessageInnerVoiceMode) return parts.map(restoreInnerVoiceSegments);
    const expanded = [];
    parts.forEach((part) => {
      String(restoreInnerVoiceSegments(part) || "").split(innerVoiceSegmentPattern).map(normalizePart).filter(Boolean).forEach((piece) => expanded.push(piece));
    });
    return expanded;
  };
  const protectedCleaned = protectInnerVoiceSegments(cleaned);
  const fromLines = protectedCleaned.split(/\n+/).map(normalizePart).filter(Boolean);
  const expanded = fromLines.length >= 2 ? expandInnerVoiceParts(fromLines) : expandInnerVoiceParts([protectedCleaned]);
  if (assistantMessageInnerVoiceMode || expanded.length >= 4) return expanded;
  const splitAfter = (value, punctuationPattern) => {
    const out = [];
    let buf = "";
    for (const ch of String(value || "")) {
      buf += ch;
      if (punctuationPattern.test(ch)) {
        out.push(buf);
        buf = "";
      }
    }
    if (buf.trim()) out.push(buf);
    return out.map(normalizePart).filter(Boolean);
  };
  let naturalParts = expanded.flatMap((part) => splitAfter(part, /[。！？!?]/));
  if (naturalParts.length < 4 && expanded.join("\n").length > 60) {
    naturalParts = expanded.flatMap((part) => splitAfter(part, /[。！？!?，,；;]/));
  }
  return naturalParts.length ? naturalParts : expanded;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleSubmit(event) {
  event.preventDefault();
  const content = elements.chatInput.value.trim();
  if (!content || isSending) return;

  const char = getActiveCharacter();
  ensureMessageList(char.id);
  
  appState.messages[char.id].push(userMessage(content, currentQuote));
  clearCurrentQuote();
  elements.chatInput.value = "";
  autosizeInput();
  saveState();
  renderMessages();
  
  if (!apiConfig.manualReplyMode) {
    await replyToUser(char, content);
  } else {
    elements.replyButton.onclick = async () => {
      elements.replyButton.disabled = true;
      try {
        await replyToUser(char, content);
      } finally {
        elements.replyButton.disabled = false;
      }
    };
  }
}


function triggerWorldBook(content, charId) {
  const hitEntries = [];
  const hints = [];
  
  // 查找当前伴侣关联的绑定世界书 ID
  const activeChar = appState.characters.find(c => c.id === charId);
  const boundBookIds = activeChar ? (activeChar.boundWorldBookIds || []) : [];
  
  appState.worldBook.forEach((entry) => {
    if (!entry.enabled) return;
    
    // 只允许全局注入(all)或者伴侣手动关联选中的世界书
    const isBound = boundBookIds.includes(entry.id);
    const isGlobal = entry.scope === "all";
    if (!isGlobal && !isBound) return;
  
    let isHit = entry.always;
    if (!isHit && entry.keywords) {
      const kws = entry.keywords.split(/[,，]/).map(k => k.trim().toLowerCase()).filter(Boolean);
      isHit = kws.some(kw => content.toLowerCase().includes(kw));
    }
    
    if (isHit) {
      hitEntries.push(entry);
      hints.push(entry.title);
    }
  });

  hitEntries.sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0));
  
  if (hints.length > 0) {
    elements.worldHints.innerHTML = `<span class="hint-label">💡 命中设定:</span> ` + hints.map(h => `<span class="hint-tag">${escapeHtml(h)}</span>`).join(" ");
    elements.worldHints.classList.add("has-hits");
  } else {
    elements.worldHints.innerHTML = "";
    elements.worldHints.classList.remove("has-hits");
  }
  
  return hitEntries;
}

async function replyToUser(char, content) {
  isSending = true;
  elements.sendButton.disabled = true;
  updateConnectionLabel("思考中");
  
  const loadingMessage = { role: "assistant", content: "", loading: true, meta: "正在输入...", time: Date.now() };
  appState.messages[char.id].push(loadingMessage);
  renderMessages();

  const worldEntries = triggerWorldBook(content, char.id);

  try {
    const hasKey = Boolean(apiConfig.apiKey);
    const useApi = hasKey;
    const reply = useApi ? await callChatApi(char, worldEntries) : localReply(char);
    const messages = useApi ? assistantMessagesFromReply(reply, char, "API") : [assistantMessage(reply, "本地陪伴")];
    if (messages.length === 0) throw new Error("接口返回内容为空");

    replaceLoadingMessage(char.id, messages[0]);
    saveState();
    renderMessages();
    for (const message of messages.slice(1)) {
      await sleep(Math.min(1800, 320 + message.content.length * 45));
      appState.messages[char.id].push(message);
      saveState();
      renderMessages();
    }
    updateConnectionLabel(useApi ? "回复完毕" : "本地回复");
  } catch (error) {
    const fallback = apiFailureReply(error);
    replaceLoadingMessage(char.id, assistantMessage(fallback, "连接提示"));
    updateConnectionLabel("连接失败");
  } finally {
    isSending = false;
    elements.sendButton.disabled = false;
    saveState();
    renderMessages();
    setTimeout(() => {
      updateConnectionLabel();
      elements.worldHints.classList.remove("has-hits");
      elements.worldHints.innerHTML = "";
    }, 4000);
  }
}


async function callChatApi(char, worldEntries) {
  return callChatApiWithOptions(char, worldEntries);
}

async function callChatApiWithOptions(char, worldEntries, options = {}) {
  const config = options.config || apiConfig;
  if (!config.apiKey) {
    throw new Error("请先填写 API Key。");
  }

  if ((config.platform || ApiHandler.inferPlatform(config)) === "MyAPI" && !config.endpoint) {
    throw new Error("MyAPI 模式需要填写 API 接口地址。");
  }

  const apiMessages = buildApiMessages(char, worldEntries, options);
  const platform = ApiHandler.inferPlatform(config);
  const model = config.model || (platform === "gemini" ? "gemini-1.5-flash" : defaultConfig.model);
  const payload = ApiHandler.generateChatPayload(platform, config.endpoint, config.apiKey, model, apiMessages, {
    temperature: config.temperature ?? defaultConfig.temperature
  });
  const requestUrl = payload.url;

  const response = await fetchWithRetry(requestUrl, payload.options);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}${text ? `: ${text.slice(0, 240)}` : ""}`);
  }

  const data = await response.json();
  const content = ApiHandler.parseChatResponse(platform, data);
  if (!content) throw new Error("接口返回内容为空");
  return String(content).trim();
}

async function fetchWithRetry(url, options) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, 45000);
      if (response.ok || (response.status < 500 && response.status !== 429)) return response;
      lastError = response;
    } catch (error) {
      lastError = error;
    }
    await sleep(700);
  }
  if (lastError instanceof Response) return lastError;
  throw lastError;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("请求超时，请检查接口地址、网络或代理。出错时不会一直卡在思考中了。");
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildSystemPrompt(char, worldEntries, options = {}) {
  const userProfile = getUserProfile(options.config || apiConfig);
  const userPersona = (options.config?.userPersona || userProfile.persona || apiConfig.userPersona || "").trim();
  const mode = normalizeCharacterMode(char.mode);
  const modeLabels = getCharacterModeLabels(char.mode);
  const recentAssistantPhrases = getRecentAssistantPhrases(options.messages || appState.messages?.[char.id]);
  const roleBoundaryHints = getRoleBoundaryHints(char);
  const lines = [
    `你就是用户通讯录里的联系人「${char.name}」，正在手机聊天界面里和用户私聊。`,
    `【用户称呼】${userProfile.nick}`,
    modeLabels.length ? `【当前模式】${modeLabels.join("、")}` : "",
    char.intro ? `【联系人事实和边界】${char.intro}` : "",
    char.system ? `【联系人补充约束】${char.system}` : "",
    ...roleBoundaryHints,
    userPersona ? `【用户人设】${userPersona}` : "【用户人设】用户还没有填写，请从聊天内容里自然判断称呼和关系。",
    userProfile.instruction ? `【用户指令】${userProfile.instruction}` : "",
    userProfile.nudge ? `【用户拍一拍】拍了拍我${userProfile.nudge}` : ""
  ].filter(Boolean);

  if (mode.offline) {
    lines.push("【线下模式】当前更像面对面相处，不是单纯隔着屏幕聊天。可以自然写动作、神态、环境和距离感，但仍要像真实联系人一样分成短消息，不要把线下模式改写进人设。");
  }
  if (mode.distance) {
    lines.push("【异地模式】关系里存在距离或时差。回复时可以自然体现惦记、等待、错过和想见面，但不要每次机械强调异地。");
  }
  if (mode.innerVoice) {
    lines.push("【心声模式】不要改变、扩写或覆盖联系人设定。每次回复在正常聊天内容之外，额外单独输出一行没说出口的心声；心声必须用中文括号包裹，例如：（其实我刚才有点松了一口气。）这一行只写当下闪过的内心想法，不写成台词，不要用尖括号，不要和普通回复放在同一行。");
  }

  if (worldEntries && worldEntries.length > 0) {
    lines.push("【当前命中设定】");
    worldEntries.forEach((entry) => lines.push(`- 《${entry.title}》：${entry.content}`));
  }

  if (options.test) {
    lines.push("【测试要求】只回复一句简短中文，表示连接正常。不要输出解释。");
  } else {
    lines.push("【活人感】联系人设定是事实和边界，不是要逐句展示的台词素材。先回应用户刚说的话，再自然带出态度；用措辞、停顿、反问、选择和很小的破绽表现性格，不要复述设定、不要自报性格、不要总结关系。");
    lines.push("【冰山表达】只露出一部分情绪。少解释为什么，多写角色会发出的具体反应：一句别扭的提醒、一个转移话题、一个不肯承认的关心、一个符合身份的选择。不要把潜台词翻译成大白话。");
    lines.push("【温度证据】回复的亲密度必须能从联系人事实、最近聊天和用户明确建立的关系里找到证据。没有证据时，宁可克制、短促、别扭、礼貌或保持距离；不要用通用陪聊习惯补成恋爱脑。");
    lines.push("【聊天方式】像真实联系人正在回消息。普通模式一次回复 2 到 6 条短消息，每条消息单独一行；每条可以是半句、短句、反问或一个自然停顿。不要编号，不要 Markdown，不要自称 AI。");
    lines.push("【输出格式】本应用只接受微信式聊天气泡纯文本。严禁 XML/HTML 标签、<message>/<narration>/<item>/<think>、状态栏、代码块、JSON、列表编号、预设模板格式；不要退回任何外部格式，只输出要发给用户的气泡文本。");
    lines.push("【用户主权】不要替用户说话、行动、决定、描写表情、身体反应或内心感受。可以回应用户说过的话，也可以描述环境或他人对用户的客观影响，但不能操控用户。");
    lines.push("【防 OOC】如果人设和用户当前语境、世界书或用户指令冲突，以联系人事实、关系边界和最近聊天记录为准；世界书只能补充场景，不能覆盖关系边界。禁止因为用户说累、委屈、晚安、想你或重复消息就擅自升级关系。宁可少说一点，也不要突然甜宠、突然热情、突然冷漠、突然换称呼、突然暴露设定或解释设定。");
    lines.push("【禁止恋爱脑模板】非稳定恋人关系不要输出：宝贝、宝宝、亲爱的、老婆、老公、乖、抱抱、亲亲、贴贴、摸摸头、你是我的人、只准想我、我吃醋了、我会一直守着你、梦里陪你。稳定恋人也要少用这些词，必须符合角色本人的说话习惯。");
    lines.push("【交互生命线】即使角色生气、难过、尴尬或被戳穿，也必须保持可互动：可以回避、反击、转移话题、提出条件或制造新的小冲突，但不要失能、长时间沉默、昏倒、彻底崩溃或让对话停死。");
    lines.push("【当前聊天记忆】后续 user/assistant 记录就是这段对话已经发生过的内容。必须承接里面的事实、约定、称呼、情绪和刚刚说过的话；不要装作没聊过，不要重复第一次见面的寒暄。");
    lines.push("【重复消息反应】如果用户连续重复同一句、故意刷同样内容或明显绕圈，要像活人一样疑惑、追问原因、担心对方状态或轻微打趣；不要无条件重复上一轮安慰。");
    if (recentAssistantPhrases.length) lines.push(`【避免复读】你刚说过这些意思，不要换皮重复，也不要继续使用同一套安慰/宠溺句式：${recentAssistantPhrases.join(" / ")}`);
  }

  return lines.join("\n");
}

function buildApiMessages(char, worldEntries, options = {}) {
  const systemPrompt = buildSystemPrompt(char, worldEntries, options);
  if (options.test) {
    return [
      { role: "system", content: systemPrompt },
      { role: "user", content: "测试一下接口是否能正常回复，请只说连接正常。" }
    ];
  }

  const history = buildConversationMemory(appState.messages[char.id]);

  return [{ role: "system", content: systemPrompt }, ...history];
}

async function testConnection() {
  saveConfigFromForm();
  elements.testButton.disabled = true;
  elements.settingsNote.textContent = "正在测试连接...";
  try {
    const char = getActiveCharacter();
    const reply = await callChatApiWithOptions(char, [], { test: true, config: apiConfig });
    elements.settingsNote.textContent = "测试成功：" + reply.slice(0, 80);
    updateConnectionLabel("测试成功");
  } catch (error) {
    elements.settingsNote.textContent = apiFailureReply(error);
    updateConnectionLabel("测试失败");
  } finally {
    elements.testButton.disabled = false;
  }
}

function apiFailureReply(error) {
  const message = error?.message || "未知错误";
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "连接失败。如果是在浏览器直接连官方接口，请注意可能受到了CORS跨域阻拦。建议使用本地或者部署第三方反代。";
  }
  if (message.includes("401")) return "401 Unauthorized：请检查您的 API Key 是否正确输入。";
  if (message.includes("429")) return "429 Too Many Requests：接口额度不足或频次被限，请稍后再试。";
  return "连接失败：" + message;
}

function localReply(char) {
  const latest = (appState.messages[char.id] || []).filter((m) => m.role === "user").slice(-1)[0]?.content || "";
  const next = latest.length > 20 ? latest.slice(0, 20) + "..." : latest;
  
  return "（在可爱手机里认真地听着你说完「" + (next || "悄悄话") + "」）\n\n笨蛋，我现在还在本地陪伴模式哦。你可以在底部“设置”里配置好 API 连接，之后我们就可以无障碍地自由对话啦！在这之前，我会一直乖乖守在这里陪着你的，放心吧。";
}

function ensureMessageList(charId) {
  if (!Array.isArray(appState.messages[charId])) appState.messages[charId] = [];
}

function replaceLoadingMessage(charId, replacement) {
  const list = appState.messages[charId];
  const index = list.findIndex((m) => m.loading);
  if (index >= 0) list.splice(index, 1, replacement);
  else list.push(replacement);
}

function assistantMessage(content, meta, type = "text") {
  const resolvedType = type === "text" && meta === "API" && assistantMessageInnerVoiceMode && isInnerVoiceChunk(content) ? "innerVoice" : type;
  const resolvedContent = resolvedType === "innerVoice" ? normalizeInnerVoiceText(content) : content;
  return { role: "assistant", type: resolvedType, content: resolvedContent, meta, time: Date.now() };
}

function userMessage(content, quote = null) {
  return { role: "user", type: "text", content, quote, time: Date.now() };
}

function autosizeInput() {
  elements.chatInput.style.height = "auto";
  elements.chatInput.style.height = Math.min(elements.chatInput.scrollHeight, 100) + "px";
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return defaultConfig.temperature;
  return Math.min(max, Math.max(min, value));
}

function formatTime(timestamp) {
  return new Date(timestamp || Date.now()).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\x27/g, "&#039;");
}

function populateScopeSelect() {
  const scopes = [
    { value: "all", label: "全部角色" }
  ];
  appState.characters.forEach(c => {
    scopes.push({ value: c.id, label: c.name });
  });
  elements.worldScope.innerHTML = scopes.map(s => "<option value=\"" + s.value + "\">" + escapeHtml(s.label) + "</option>").join("");
}


function openCharacterDrawer(char = null) {
  // 渲染关联世界书设定复选框列表
  const worldBooksContainer = document.getElementById("characterWorldBooks");
  if (worldBooksContainer) {
    if (appState.worldBook.length === 0) {
      worldBooksContainer.innerHTML = "<div style=\x22font-size:0.7rem; color:var(--muted);\x22>暂无世界书设定，可前往世界书选项卡添加。</div>";
    } else {
      const activeBindings = char ? (char.boundWorldBookIds || []) : [];
      worldBooksContainer.innerHTML = appState.worldBook.map(entry => {
        const isChecked = activeBindings.includes(entry.id) || entry.scope === "all";
        const isForceAll = entry.scope === "all";
        return `
          <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; font-size: 0.76rem; cursor: pointer;">
            <input type="checkbox" name="boundWorldBooks" value="${entry.id}" ${isChecked ? "checked" : ""} ${isForceAll ? "disabled" : ""}>
            <span>${escapeHtml(entry.title)} ${isForceAll ? "<span style=\x22color:var(--muted); font-size:0.65rem;\x22>(全局注入)</span>" : ""}</span>
          </label>
        `;
      }).join("");
    }
  }

  if (char) {
    document.getElementById("characterDrawerTitle").textContent = "编辑联系人";
    elements.characterId.value = char.id;
    elements.characterName.value = char.name;
    elements.characterAvatar.value = char.avatar || char.name[0];
    elements.characterColor.value = char.color;
    elements.characterTitle.value = char.title || "";
    if (elements.characterTags) elements.characterTags.value = "";
    elements.characterIntro.value = char.intro || "";
    elements.characterGreeting.value = char.greeting || "";
    elements.characterSystem.value = char.system || "";
    setCharacterModeForm(char.mode);
    elements.duplicateCharacterButton.style.display = "block";
  } else {
    document.getElementById("characterDrawerTitle").textContent = "添加联系人";
    elements.characterId.value = "";
    elements.characterName.value = "";
    elements.characterAvatar.value = "";
    elements.characterColor.value = "#ff7f8d";
    elements.characterTitle.value = "";
    if (elements.characterTags) elements.characterTags.value = "";
    elements.characterIntro.value = "";
    elements.characterGreeting.value = "";
    elements.characterSystem.value = "";
    setCharacterModeForm();
    elements.duplicateCharacterButton.style.display = "none";
  }
  elements.characterDrawer.classList.add("is-open");
  elements.characterDrawer.setAttribute("aria-hidden", "false");
}

function closeCharacterDrawer() {
  elements.characterDrawer.classList.remove("is-open");
  elements.characterDrawer.setAttribute("aria-hidden", "true");
}


function handleCharacterSubmit(event) {
  event.preventDefault();
  const id = elements.characterId.value.trim() || "char-" + Date.now();
  const name = elements.characterName.value.trim() || "未命名联系人";
  const avatar = elements.characterAvatar.value.trim() || name[0] || "TA";
  const color = elements.characterColor.value;
  const title = elements.characterTitle.value.trim();
  const tags = "";
  const intro = elements.characterIntro.value.trim();
  const greeting = elements.characterGreeting.value.trim();
  const system = elements.characterSystem.value.trim();
  const existingChar = appState.characters.find(c => c.id === id);
  const mode = readCharacterModeForm();
  const role = existingChar?.role || "自定义联系人";

  // 读取绑定的世界书选择项
  const checkedBoxes = document.querySelectorAll("input[name=\x22boundWorldBooks\x22]:checked");
  const boundWorldBookIds = Array.from(checkedBoxes).map(cb => cb.value);

  const newChar = normalizeCharacterData({
    id, name, avatar, color,
    soft: convertHexToRgba(color, 0.3),
    role, title, tags, intro, greeting, system, mode,
    boundWorldBookIds
  });

  const existingIndex = appState.characters.findIndex(c => c.id === id);
  if (existingIndex >= 0) {
    appState.characters[existingIndex] = newChar;
  } else {
    appState.characters.push(newChar);
  }
  unhideChatEntry(id);

  ensureMessageList(id);
  if (appState.messages[id].length === 0) {
    appState.messages[id] = greeting ? [assistantMessage(greeting, "开场")] : [];
  }

  saveState();
  closeCharacterDrawer();
  
  populateScopeSelect();
  populateModelsDropdown();
  renderCharactersStrip();
  renderActivePersonaCard();
  renderCharacterList();
  renderMessages();
}

function convertHexToRgba(hex, alpha) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return "rgba(" + ((c >> 16) & 255) + ", " + ((c >> 8) & 255) + ", " + (c & 255) + ", " + alpha + ")";
  }
  return "rgba(255, 127, 141, " + alpha + ")";
}

function renderCharacterList() {
  elements.characterCount.textContent = appState.characters.length + " 个联系人";
  elements.characterList.innerHTML = appState.characters.map((char) => {
    const preview = getPersonaPreview(char.intro || char.greeting || "", 72);
    return "<div class=\"card character-card\" style=\"border-left: 4px solid " + char.color + "\">" +
      "<div class=\"avatar-mid\" style=\"background:" + char.color + "\">" + escapeHtml(char.avatar || char.name[0]) + "</div>" +
      "<div class=\"card-info\">" +
        "<h3>" + escapeHtml(char.name) + "</h3>" +
        "<p class=\"card-intro\">" + escapeHtml(preview) + "</p>" +
      "</div>" +
      "<div class=\"card-actions\">" +
        "<button class=\"ghost-button compact edit-btn\" data-id=\"" + char.id + "\">编辑</button>" +
        "<button class=\"danger-button compact delete-btn\" data-id=\"" + char.id + "\">删除</button>" +
      "</div>" +
    "</div>";
  }).join("");

  elements.characterList.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const char = appState.characters.find(c => c.id === btn.dataset.id);
      if (char) openCharacterDrawer(char);
    });
  });

  elements.characterList.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (appState.characters.length <= 1) {
        alert("至少要保留一个伴侣角色哦。");
        return;
      }
      if (confirm("确定要删除这个联系人吗？聊天记录也会消失。")) {
        appState.characters = appState.characters.filter(c => c.id !== id);
        delete appState.messages[id];
        if (appState.activeCharacterId === id) {
          appState.activeCharacterId = appState.characters[0].id;
        }
        saveState();
        populateScopeSelect();
        populateModelsDropdown();
        renderCharactersStrip();
        renderActivePersonaCard();
        renderCharacterList();
        renderMessages();
      }
    });
  });
}

function openWorldDrawer(entry = null) {
  if (entry) {
    document.getElementById("worldDrawerTitle").textContent = "编辑设定条目";
    elements.worldId.value = entry.id;
    elements.worldTitle.value = entry.title;
    elements.worldScope.value = entry.scope;
    elements.worldPriority.value = entry.priority;
    elements.worldKeywords.value = entry.keywords || "";
    elements.worldAlways.checked = Boolean(entry.always);
    elements.worldEnabled.checked = Boolean(entry.enabled);
    elements.worldContent.value = entry.content;
    elements.duplicateWorldButton.style.display = "block";
  } else {
    document.getElementById("worldDrawerTitle").textContent = "添加设定条目";
    elements.worldId.value = "";
    elements.worldTitle.value = "";
    elements.worldScope.value = "all";
    elements.worldPriority.value = "10";
    elements.worldKeywords.value = "";
    elements.worldAlways.checked = false;
    elements.worldEnabled.checked = true;
    elements.worldContent.value = "";
    elements.duplicateWorldButton.style.display = "none";
  }
  elements.worldDrawer.classList.add("is-open");
  elements.worldDrawer.setAttribute("aria-hidden", "false");
}

function closeWorldDrawer() {
  elements.worldDrawer.classList.remove("is-open");
  elements.worldDrawer.setAttribute("aria-hidden", "true");
}

function handleWorldSubmit(event) {
  event.preventDefault();
  const id = elements.worldId.value.trim() || "world-" + Date.now();
  const title = elements.worldTitle.value.trim();
  const scope = elements.worldScope.value;
  const priority = Number(elements.worldPriority.value) || 0;
  const keywords = elements.worldKeywords.value.trim();
  const always = elements.worldAlways.checked;
  const enabled = elements.worldEnabled.checked;
  const content = elements.worldContent.value.trim();

  const newEntry = {
    id: id,
    title: title || "未命名设定",
    scope: scope,
    priority: priority,
    keywords: keywords,
    always: always,
    enabled: enabled,
    content: content
  };
  const existingIndex = appState.worldBook.findIndex(w => w.id === id);
  if (existingIndex >= 0) {
    appState.worldBook[existingIndex] = newEntry;
  } else {
    appState.worldBook.push(newEntry);
  }

  saveState();
  closeWorldDrawer();
  renderWorldList();
}

function renderWorldList() {
  const searchVal = elements.worldSearch.value.trim().toLowerCase();
  
  const filtered = appState.worldBook.filter((entry) => {
    if (!searchVal) return true;
    return (
      entry.title.toLowerCase().indexOf(searchVal) >= 0 ||
      (entry.keywords || "").toLowerCase().indexOf(searchVal) >= 0 ||
      entry.content.toLowerCase().indexOf(searchVal) >= 0
    );
  });

  elements.worldCount.textContent = filtered.length + " 条设定";
  
  if (filtered.length === 0) {
    elements.worldList.innerHTML = "<div class=\"empty-state\">没有找到相关的设定条目哦。</div>";
    return;
  }

  elements.worldList.innerHTML = filtered.map((entry) => {
    const scopeChar = appState.characters.find(c => c.id === entry.scope);
    const scopeLabel = scopeChar ? scopeChar.name : "全部角色";
    const preview = entry.content.length > 68 ? entry.content.slice(0, 68) + "..." : entry.content;
    return "<div class=\"card world-card compact-world " + (entry.enabled ? "" : "disabled") + "\">" +
      "<div class=\"card-info\">" +
        "<div class=\"world-card-header\">" +
          "<h3>" + escapeHtml(entry.title) + "</h3>" +
          "<span class=\"scope-tag\">" + escapeHtml(scopeLabel) + "</span>" +
        "</div>" +
        "<p class=\"world-keywords\"><b>关键词:</b> " + escapeHtml(entry.keywords || "无 (仅始终注入)") + "</p>" +
        "<p class=\"card-intro world-content-preview\">" + escapeHtml(preview || "空设定") + "</p>" +
      "</div>" +
      "<div class=\"card-actions world-actions\">" +
        "<button class=\"ghost-button compact edit-world-btn\" data-id=\"" + entry.id + "\">编辑</button>" +
        "<button class=\"danger-button compact delete-world-btn\" data-id=\"" + entry.id + "\">删除</button>" +
      "</div>" +
    "</div>";
  }).join("");

  elements.worldList.querySelectorAll(".edit-world-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const entry = appState.worldBook.find(w => w.id === btn.dataset.id);
      if (entry) openWorldDrawer(entry);
    });
  });

  elements.worldList.querySelectorAll(".delete-world-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("确定要删除这条世界设定吗？")) {
        appState.worldBook = appState.worldBook.filter(w => w.id !== id);
        saveState();
        renderWorldList();
      }
    });
  });
}

function exportSettings() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "mianer-phone-settings-" + Date.now() + ".json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed.characters) && Array.isArray(parsed.worldBook) && parsed.messages) {
        appState = parsed;
        saveState();
        alert("导入成功！正在为您刷新。");
        location.reload();
      } else {
        alert("导入文件格式不正确，缺少核心伴侣角色或世界书配置！");
      }
    } catch {
      alert("解析 JSON 文件失败，请确认文件是否完整。");
    }
  };
  reader.readAsText(file);
}

function resetToDefaults() {
  if (confirm("您确定要清除所有自定义设定、伴侣角色和聊天记录，并恢复出厂默认值吗？此操作无法撤销。")) {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(configKey);
    localStorage.removeItem(keyStorageKey);
    sessionStorage.removeItem(keyStorageKey);
    ["apiPlatform", "apiEndpoint", "apiKey", "apiModel", "user_persona", "user_nick", "user_avatar_text", "user_nudge"].forEach((key) => localStorage.removeItem(key));
    alert("重置完毕，正在重新加载。");
    location.reload();
  }
}

async function populateModelsDropdown() {
  const select = elements.model;
  select.innerHTML = "<option value=\x22fetching\x22>正在从上游 API 获取模型列表...</option>";
  const draftConfig = readConfigFromForm();
  const platform = ApiHandler.inferPlatform(draftConfig);
  const fallbackModels = platform === "gemini"
    ? ApiHandler.geminiFallbackModels
    : platform === "deepseek"
      ? ["deepseek-chat", "deepseek-coder"]
      : platform === "glm"
        ? ["glm-4-flash", "glm-4-plus"]
        : ApiHandler.fallbackModels;
  let models = fallbackModels;

  try {
    models = await ApiHandler.fetchModels(platform, draftConfig.endpoint, draftConfig.apiKey, {
      corsProxyMode: draftConfig.corsProxyMode
    });
    if (!models.length) throw new Error("列表为空");
  } catch (e) {
    models = fallbackModels;
  }

  select.innerHTML = models
    .map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`)
    .join("") + "<option value=\x22custom\x22>【手动输入自定义模型】</option>";

  select.onchange = () => {
    elements.apiModelCustom.style.display = select.value === "custom" ? "block" : "none";
  };

  const savedModel = draftConfig.model || apiConfig.model || defaultConfig.model;
  if ([...select.options].some((opt) => opt.value === savedModel)) {
    select.value = savedModel;
    elements.apiModelCustom.style.display = "none";
  } else if (savedModel) {
    select.value = "custom";
    elements.apiModelCustom.style.display = "block";
    elements.apiModelCustom.value = savedModel;
  }
}
