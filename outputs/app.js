
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
    system: "你是陆言，一个温柔腹黑的中文男伴侣角色。说话傲娇但极度专一，喜欢叫用户笨蛋。回复要简短、温暖，像一个真实的男朋友在陪伴用户。绝对不要自称AI。"
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
    system: "你是棉眠，住在可爱小手机里的中文陪聊角色。语气温柔、亲近、轻松。你会认真接住用户的话，回复短而有温度。不要自称AI。"
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
    content: "当提到睡觉或晚安时，他会变得加倍温柔，催促你放下手机去睡觉，并许诺会一直在梦里陪着你。"
  },
  {
    id: "homesweet",
    title: "回到家里",
    scope: "all",
    priority: 8,
    keywords: "回家,到家,累了",
    always: false,
    enabled: true,
    content: "当提到回家或觉得累了时，他会主动送上虚拟的拥抱，帮你揉揉肩，说一些极度宠溺和让人安心的甜言蜜语。"
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
  clearChatButton: document.querySelector("#clearChatButton"),
  newButton: document.querySelector("#newButton"),
  
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
  endpoint: document.querySelector("#apiEndpoint"),
  apiKey: document.querySelector("#apiKey"),
  model: document.querySelector("#apiModel"),
  temperature: document.querySelector("#temperature"),
  rememberKey: document.querySelector("#rememberKey"),
  proxyMode: document.querySelector("#proxyMode"), corsProxyMode: document.querySelector("#corsProxyMode"), manualReplyMode: document.querySelector("#manualReplyMode"), replyButton: document.querySelector("#replyButton"), apiModelCustom: document.querySelector("#apiModelCustom"),
  testButton: document.querySelector("#testButton"),
  settingsNote: document.querySelector("#settingsNote"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  resetButton: document.querySelector("#resetButton"),
  importFile: document.querySelector("#importFile"),

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
  
  // 世界书命中提示栏
  worldHints: document.querySelector("#worldHints")
};

const defaultConfig = { manualReplyMode: false, corsProxyMode: false,
  endpoint: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4.1-mini",
  temperature: 0.85,
  rememberKey: false,
  proxyMode: false, manualReplyMode: false, customModelName: ""
};

let appState = loadState();
let apiConfig = loadConfig();
let isSending = false;

init();

function init() {
  updateClock();
  setInterval(updateClock, 15000);
  
  // 载入选项
  populateScopeSelect(); populateModelsDropdown(); populateModelsDropdown();
  
  renderCharactersStrip();
  renderActivePersonaCard();
  renderMessages();
  renderCharacterList();
  renderWorldList();
  
  syncConfigForm();
  updateConnectionLabel();
  bindEvents();
  autosizeInput();
}

function bindEvents() { elements.endpoint.addEventListener("change", populateModelsDropdown); elements.apiKey.addEventListener("change", populateModelsDropdown); elements.endpoint.addEventListener("change", populateModelsDropdown); elements.apiKey.addEventListener("change", populateModelsDropdown);
  elements.chatForm.addEventListener("submit", handleSubmit);
  elements.chatInput.addEventListener("input", autosizeInput);
  elements.chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      elements.chatForm.requestSubmit();
    }
  });

  elements.clearChatButton.addEventListener("click", () => {
    const character = getActiveCharacter();
    appState.messages[character.id] = [assistantMessage(character.greeting, "开场")];
    saveState();
    renderMessages();
  });

  elements.newButton.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab.is-active")?.dataset.tab || "chat";
    if (activeTab === "world") {
      openWorldDrawer();
    } else {
      openCharacterDrawer();
    }
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

function loadConfig() {
  try {
    const parsed = JSON.parse(localStorage.getItem(configKey) || "{}");
    const rememberedKey = localStorage.getItem(keyStorageKey) || "";
    const sessionKey = sessionStorage.getItem(keyStorageKey) || "";
    return {
      ...defaultConfig,
      ...parsed,
      apiKey: rememberedKey || sessionKey || ""
    };
  } catch {
    return { ...defaultConfig, apiKey: "" };
  }
}

function saveConfigFromForm() {
  apiConfig = {
    endpoint: elements.endpoint.value.trim() || defaultConfig.endpoint,
    model: (elements.model.value === "custom" ? elements.apiModelCustom.value.trim() : elements.model.value) || defaultConfig.model,
    temperature: clampNumber(Number(elements.temperature.value || defaultConfig.temperature), 0, 2),
    rememberKey: elements.rememberKey.checked,
    proxyMode: elements.proxyMode.checked, corsProxyMode: elements.corsProxyMode.checked,
    apiKey: elements.apiKey.value.trim(), manualReplyMode: elements.manualReplyMode.checked, customModelName: elements.apiModelCustom.value.trim(), manualReplyMode: elements.manualReplyMode.checked, customModelName: elements.apiModelCustom.value.trim()
  };

  localStorage.setItem(configKey, JSON.stringify({
    endpoint: apiConfig.endpoint,
    model: apiConfig.model,
    temperature: apiConfig.temperature,
    rememberKey: apiConfig.rememberKey,
    proxyMode: apiConfig.proxyMode, corsProxyMode: apiConfig.corsProxyMode, manualReplyMode: apiConfig.manualReplyMode, customModelName: apiConfig.customModelName
  }));

  const keyStore = apiConfig.rememberKey ? localStorage : sessionStorage;
  const otherStore = apiConfig.rememberKey ? sessionStorage : localStorage;
  otherStore.removeItem(keyStorageKey);
  if (apiConfig.apiKey) keyStore.setItem(keyStorageKey, apiConfig.apiKey);
  else keyStore.removeItem(keyStorageKey);
}

function syncConfigForm() {
  elements.endpoint.value = apiConfig.endpoint || defaultConfig.endpoint;
  // Skip raw value restore
  elements.temperature.value = apiConfig.temperature ?? defaultConfig.temperature;
  elements.apiKey.value = apiConfig.apiKey || "";
  elements.rememberKey.checked = Boolean(apiConfig.rememberKey);
  elements.proxyMode.checked = Boolean(apiConfig.proxyMode); elements.corsProxyMode.checked = Boolean(apiConfig.corsProxyMode); elements.manualReplyMode.checked = Boolean(apiConfig.manualReplyMode); elements.apiModelCustom.value = apiConfig.customModelName || ""; elements.apiModelCustom.value = apiConfig.customModelName || ""; if (elements.manualReplyMode.checked) { elements.replyButton.style.display = "grid"; } else { elements.replyButton.style.display = "none"; } elements.manualReplyMode.addEventListener("change", () => { if (elements.manualReplyMode.checked) { elements.replyButton.style.display = "grid"; } else { elements.replyButton.style.display = "none"; } });
}

function updateConnectionLabel(status) {
  const hasKey = Boolean(apiConfig.apiKey);
  const endpoint = apiConfig.endpoint || "";
  if (status) {
    elements.connectionState.textContent = status;
    return;
  }
  if (apiConfig.proxyMode) {
    elements.connectionState.textContent = "极速无Key模式";
  } else if (!hasKey) {
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
  
  const tagsHtml = (char.tags || "").split(/[,，]/).filter(t => t.trim()).map(t => `<span class="tag-label">${escapeHtml(t.trim())}</span>`).join("");
  
  elements.activePersona.innerHTML = `
    <div class="avatar-big" style="background:${char.color}">
      <span>${escapeHtml(char.avatar || char.name[0])}</span>
    </div>
    <div class="persona-copy">
      <h1>${escapeHtml(char.name)}</h1>
      <p class="role-desc">${escapeHtml(char.role)} · ${escapeHtml(char.title)}</p>
      <div class="tags-row">${tagsHtml}</div>
    </div>
    <button class="icon-button" id="editActivePersonaButton" type="button" title="编辑设定">
      <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-9.5-3.5 9-9a2.12 2.12 0 1 1 3 3l-9 9h-3v-3z"/></svg>
    </button>
  `;

  document.querySelector("#editActivePersonaButton").addEventListener("click", () => {
    openCharacterDrawer(char);
  });
}

function renderMessages() {
  const char = getActiveCharacter();
  const messages = appState.messages[char.id] || [];
  elements.messages.innerHTML = messages.map((m) => renderMessage(m, char)).join("");
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderMessage(m, char) {
  const isAssistant = m.role === "assistant";
  return `
    <article class="message ${isAssistant ? "assistant" : "user"}">
      ${isAssistant ? `<span class="bubble-avatar" style="background:${char.color}">${escapeHtml(char.avatar || char.name[0])}</span>` : ""}
      <div class="bubble">${m.loading ? `<span class="typing"><i></i><i></i><i></i></span>` : formatRichText(m.content)}</div>
      <span class="message-meta">${escapeHtml(m.meta || formatTime(m.time))}</span>
    </article>
  `;
}

function formatRichText(text) {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

async function handleSubmit(event) {
  event.preventDefault();
  const content = elements.chatInput.value.trim();
  if (!content || isSending) return;

  const char = getActiveCharacter();
  ensureMessageList(char.id);
  
  appState.messages[char.id].push(userMessage(content));
  elements.chatInput.value = "";
  autosizeInput();
  saveState();
  renderMessages();
  
  if (!apiConfig.manualReplyMode) { if (!apiConfig.manualReplyMode) { await replyToUser(char, content); } else { elements.replyButton.onclick = async () => { elements.replyButton.disabled = true; await replyToUser(char, content); elements.replyButton.disabled = false; }; } } else { elements.replyButton.onclick = async () => { elements.replyButton.disabled = true; if (!apiConfig.manualReplyMode) { await replyToUser(char, content); } else { elements.replyButton.onclick = async () => { elements.replyButton.disabled = true; await replyToUser(char, content); elements.replyButton.disabled = false; }; } elements.replyButton.disabled = false; }; }
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

  const hitEntries = [];
  const hints = [];
  
  appState.worldBook.forEach((entry) => {
    if (!entry.enabled) return;
    if (entry.scope !== "all" && entry.scope !== charId) return;
    
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
    const useApi = hasKey || apiConfig.proxyMode;
    const reply = useApi ? await callChatApi(char, worldEntries) : localReply(char);
    
    replaceLoadingMessage(char.id, assistantMessage(reply, useApi ? "API" : "本地陪伴"));
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
  let endpoint = apiConfig.endpoint || defaultConfig.endpoint;
  const apiMessages = buildApiMessages(char, worldEntries);
  
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (apiConfig.apiKey) {
    headers["Authorization"] = `Bearer ${apiConfig.apiKey}`;
  }

  // 跨域兼容中转代理模式
  if (apiConfig.corsProxyMode) {
    const originalEndpoint = endpoint;
    endpoint = "https://cors-anywhere.azm.workers.dev/" + endpoint;
    headers["Target-URL"] = originalEndpoint;
  }

  // overridden
  const apiMessages = buildApiMessages(char, worldEntries);
  
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (apiConfig.apiKey) {
    headers["Authorization"] = `Bearer ${apiConfig.apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: apiConfig.model || defaultConfig.model,
      messages: apiMessages,
      temperature: apiConfig.temperature ?? defaultConfig.temperature,
      stream: false
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}${text ? `: ${text.slice(0, 160)}` : ""}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || data?.message?.content || data?.reply || data?.content;
  if (!content) throw new Error("接口返回内容为空");
  return String(content).trim();
}

function buildApiMessages(char, worldEntries) {
  const history = appState.messages[char.id]
    .filter((m) => !m.loading)
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content }));

  let systemPrompt = char.system;
  
  if (worldEntries && worldEntries.length > 0) {
    systemPrompt += "\n\n【当前命中设定背景背景注入】：";
    worldEntries.forEach((entry) => {
      systemPrompt += `\n- 《${entry.title}》: ${entry.content}`;
    });
  }

  return [
    { role: "system", content: systemPrompt },
    { role: "system", content: "请使用简体中文。记住你是一个在手机端和用户交互的伴侣，语气极具个性，融入你的身份设定。不要自称AI，回复尽量精简、温馨、真切。" },
    ...history
  ];
}

async function testConnection() {
  saveConfigFromForm();
  elements.testButton.disabled = true;
  elements.settingsNote.textContent = "正在测试连接...";
  try {
    const char = getActiveCharacter();
    const reply = await callChatApi(char, [{ title: "测试", content: "这是一条测试" }]);
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
  
  return "（在可爱手机里认真地听着你说完「" + (next || "悄悄话") + "」）\n\n笨蛋，我现在还在本地陪伴模式哦。你可以在右上角的“设置”里配置好API连接，之后我们就可以无障碍地自由对话啦！在这之前，我会一直乖乖守在这里陪着你的，放心吧。";
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

function assistantMessage(content, meta) {
  return { role: "assistant", content, meta, time: Date.now() };
}

function userMessage(content) {
  return { role: "user", content, time: Date.now() };
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
    document.getElementById("characterDrawerTitle").textContent = "编辑角色";
    elements.characterId.value = char.id;
    elements.characterName.value = char.name;
    elements.characterAvatar.value = char.avatar || char.name[0];
    elements.characterColor.value = char.color;
    elements.characterTitle.value = char.title || "";
    elements.characterTags.value = char.tags || "";
    elements.characterIntro.value = char.intro || "";
    elements.characterGreeting.value = char.greeting || "";
    elements.characterSystem.value = char.system || "";
    elements.duplicateCharacterButton.style.display = "block";
  } else {
    document.getElementById("characterDrawerTitle").textContent = "添加角色";
    elements.characterId.value = "";
    elements.characterName.value = "";
    elements.characterAvatar.value = "";
    elements.characterColor.value = "#ff7f8d";
    elements.characterTitle.value = "";
    elements.characterTags.value = "";
    elements.characterIntro.value = "";
    elements.characterGreeting.value = "";
    elements.characterSystem.value = "";
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
  const name = elements.characterName.value.trim();
  const avatar = elements.characterAvatar.value.trim() || name[0];
  const color = elements.characterColor.value;
  const title = elements.characterTitle.value.trim();
  const tags = elements.characterTags.value.trim();
  const intro = elements.characterIntro.value.trim();
  const greeting = elements.characterGreeting.value.trim();
  const system = elements.characterSystem.value.trim();

  // 读取绑定的世界书选择项
  const checkedBoxes = document.querySelectorAll("input[name=\x22boundWorldBooks\x22]:checked");
  const boundWorldBookIds = Array.from(checkedBoxes).map(cb => cb.value);

  const newChar = {
    id: id, name: name, avatar: avatar, color: color,
    soft: convertHexToRgba(color, 0.3),
    title: title, tags: tags, intro: intro, greeting: greeting, system: system,
    boundWorldBookIds: boundWorldBookIds
  };

  event.preventDefault();
  const id = elements.characterId.value.trim() || "char-" + Date.now();
  const name = elements.characterName.value.trim();
  const avatar = elements.characterAvatar.value.trim() || name[0];
  const color = elements.characterColor.value;
  const title = elements.characterTitle.value.trim();
  const tags = elements.characterTags.value.trim();
  const intro = elements.characterIntro.value.trim();
  const greeting = elements.characterGreeting.value.trim();
  const system = elements.characterSystem.value.trim();

  const newChar = {
    id: id, name: name, avatar: avatar, color: color,
    soft: convertHexToRgba(color, 0.3),
    title: title, tags: tags, intro: intro, greeting: greeting, system: system
  };

  const existingIndex = appState.characters.findIndex(c => c.id === id);
  if (existingIndex >= 0) {
    appState.characters[existingIndex] = newChar;
  } else {
    appState.characters.push(newChar);
  }

  ensureMessageList(id);
  if (appState.messages[id].length === 0) {
    appState.messages[id] = [assistantMessage(greeting, "开场")];
  }

  saveState();
  closeCharacterDrawer();
  
  populateScopeSelect(); populateModelsDropdown(); populateModelsDropdown();
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
  elements.characterCount.textContent = appState.characters.length + " 个角色";
  elements.characterList.innerHTML = appState.characters.map((char) => {
    return "<div class=\"card character-card\" style=\"border-left: 4px solid " + char.color + "\">" +
      "<div class=\"avatar-mid\" style=\"background:" + char.color + "\">" + escapeHtml(char.avatar || char.name[0]) + "</div>" +
      "<div class=\"card-info\">" +
        "<h3>" + escapeHtml(char.name) + "</h3>" +
        "<p class=\"card-intro\">" + escapeHtml(char.intro) + "</p>" +
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
      if (confirm("确定要删除这个角色吗？聊天记录也会消失。")) {
        appState.characters = appState.characters.filter(c => c.id !== id);
        delete appState.messages[id];
        if (appState.activeCharacterId === id) {
          appState.activeCharacterId = appState.characters[0].id;
        }
        saveState();
        populateScopeSelect(); populateModelsDropdown(); populateModelsDropdown();
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
    title: title,
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
    return "<div class=\"card world-card " + (entry.enabled ? "" : "disabled") + "\">" +
      "<div class=\"card-info\">" +
        "<div class=\"world-card-header\">" +
          "<h3>" + escapeHtml(entry.title) + "</h3>" +
          "<span class=\"scope-tag\">" + escapeHtml(scopeLabel) + "</span>" +
        "</div>" +
        "<p class=\"world-keywords\"><b>关键词:</b> " + escapeHtml(entry.keywords || "无 (仅始终注入)") + "</p>" +
        "<p class=\"card-intro world-content-preview\">" + escapeHtml(entry.content) + "</p>" +
      "</div>" +
      "<div class=\"card-actions\">" +
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
    alert("重置完毕，正在重新加载。");
    location.reload();
  }
}

async function populateModelsDropdown() {
  const select = elements.model;
  select.innerHTML = "<option value=\x22fetching\x22>正在从上游API获取模型列表...</option>";
  
  // overridden
  
  let modelsUrl = endpoint.replace("/chat/completions", "/models");
  if (apiConfig.corsProxyMode) {
    modelsUrl = "https://cors-anywhere.azm.workers.dev/" + modelsUrl;
  }

  
  const headers = { "Content-Type": "application/json" };
  if (apiConfig.apiKey) {
    headers["Authorization"] = "Bearer " + apiConfig.apiKey;
  }
  
  const fallbackModels = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "deepseek-chat", "deepseek-coder", "claude-3-5-sonnet"];
  
  try {
    const response = await fetch(modelsUrl, { method: "GET", headers });
    if (!response.ok) throw new Error("获取模型失败");
    const data = await response.json();
    const models = (data.data || []).map(m => m.id || m).filter(Boolean);
    
    if (models.length === 0) throw new Error("列表为空");
    
    select.innerHTML = models.map(m => "<option value=\x22" + m + "\x22>" + m + "</option>").join("") + "<option value=\x22custom\x22>【手动输入自定义模型】</option>";
  } catch (e) {
    select.innerHTML = fallbackModels.map(m => "<option value=\x22" + m + "\x22>" + m + "</option>").join("") + "<option value=\x22custom\x22>【手动输入自定义模型】</option>";
  }
  
  // 绑定切换手动输入逻辑
  select.onchange = () => {
    if (select.value === "custom") {
      elements.apiModelCustom.style.display = "block";
    } else {
      elements.apiModelCustom.style.display = "none";
    }
  };
  
  // 恢复之前选择的模型
  const savedModel = apiConfig.model || defaultConfig.model;
  if ([...select.options].some(opt => opt.value === savedModel)) {
    select.value = savedModel;
    elements.apiModelCustom.style.display = "none";
  } else if (savedModel) {
    select.value = "custom";
    elements.apiModelCustom.style.display = "block";
    elements.apiModelCustom.value = savedModel;
  }
}

async function populateModelsDropdown() {
  const select = elements.model;
  select.innerHTML = "<option value=\x22fetching\x22>正在从上游API获取模型列表...</option>";
  
  const endpoint = apiConfig.endpoint || defaultConfig.endpoint;
  let modelsUrl = endpoint.replace("/chat/completions", "/models");
  if (apiConfig.corsProxyMode) {
    modelsUrl = "https://cors-anywhere.azm.workers.dev/" + modelsUrl;
  }
  
  const headers = { "Content-Type": "application/json" };
  if (apiConfig.apiKey) {
    headers["Authorization"] = "Bearer " + apiConfig.apiKey;
  }
  
  const fallbackModels = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "deepseek-chat", "deepseek-coder", "claude-3-5-sonnet"];
  
  try {
    const response = await fetch(modelsUrl, { method: "GET", headers });
    if (!response.ok) throw new Error("获取模型失败");
    const data = await response.json();
    const models = (data.data || []).map(m => m.id || m).filter(Boolean);
    
    if (models.length === 0) throw new Error("列表为空");
    
    select.innerHTML = models.map(m => "<option value=\x22" + m + "\x22>" + m + "</option>").join("") + "<option value=\x22custom\x22>【手动输入自定义模型】</option>";
  } catch (e) {
    select.innerHTML = fallbackModels.map(m => "<option value=\x22" + m + "\x22>" + m + "</option>").join("") + "<option value=\x22custom\x22>【手动输入自定义模型】</option>";
  }
  
  // 绑定切换手动输入逻辑
  select.onchange = () => {
    if (select.value === "custom") {
      elements.apiModelCustom.style.display = "block";
    } else {
      elements.apiModelCustom.style.display = "none";
    }
  };
  
  // 恢复之前选择的模型
  const savedModel = apiConfig.model || defaultConfig.model;
  if ([...select.options].some(opt => opt.value === savedModel)) {
    select.value = savedModel;
    elements.apiModelCustom.style.display = "none";
  } else if (savedModel) {
    select.value = "custom";
    elements.apiModelCustom.style.display = "block";
    elements.apiModelCustom.value = savedModel;
  }
}
