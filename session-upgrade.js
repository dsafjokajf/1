/* Adds WeChat-style chat entry, named archives, and a session-only memory model. */
function loadSessionState() {
  try {
    return sessionNormalizeState(JSON.parse(localStorage.getItem(storageKey) || "{}"));
  } catch {
    return sessionNormalizeState({});
  }
}

function initSessionUpgrade() {
  sessionHydrateElements();
  sessionInstallOverrides();

  updateClock();
  setInterval(updateClock, 15000);
  populateScopeSelect();
  sessionEnsureCurrentSession(appState.activeCharacterId);
  sessionShowChatList(false);
  sessionRenderChatList();
  sessionRenderCharacterList();
  renderWorldList();
  sessionRenderActivePersonaCard();
  sessionRenderMessages();
  syncConfigForm();
  populateModelsDropdown();
  updateConnectionLabel();
  sessionBindEvents();
  autosizeInput();
}

function sessionInstallOverrides() {
  saveState = sessionSaveState;
  getActiveCharacter = sessionGetActiveCharacter;
  setActiveCharacter = sessionSetActiveCharacter;
  renderCharactersStrip = sessionRenderChatList;
  renderActivePersonaCard = sessionRenderActivePersonaCard;
  renderMessages = sessionRenderMessages;
  handleSubmit = sessionHandleSubmit;
  replyToUser = sessionReplyToUser;
  ensureMessageList = sessionEnsureMessageList;
  replaceLoadingMessage = sessionReplaceLoadingMessage;
  localReply = sessionLocalReply;
  buildApiMessages = sessionBuildApiMessages;
  renderCharacterList = sessionRenderCharacterList;
  handleCharacterSubmit = sessionHandleCharacterSubmit;
  exportSettings = sessionExportSettings;
  importSettings = sessionImportSettings;
}

function sessionHydrateElements() {
  Object.assign(elements, {
    globalArchiveButton: document.querySelector("#globalArchiveButton"),
    chatListScreen: document.querySelector("#chatListScreen"),
    conversationScreen: document.querySelector("#conversationScreen"),
    chatOverview: document.querySelector("#chatOverview"),
    chatSearch: document.querySelector("#chatSearch"),
    chatList: document.querySelector("#chatList"),
    chatArchiveButton: document.querySelector("#chatArchiveButton"),
    backToChatsButton: document.querySelector("#backToChatsButton"),
    conversationArchiveButton: document.querySelector("#conversationArchiveButton"),
    conversationTitle: document.querySelector("#conversationTitle"),
    newConversationButton: document.querySelector("#newConversationButton"),
    characterSearch: document.querySelector("#characterSearch"),
    contactStats: document.querySelector("#contactStats"),
    archiveDrawer: document.querySelector("#archiveDrawer"),
    closeArchiveDrawer: document.querySelector("#closeArchiveDrawer"),
    archiveDrawerSubtitle: document.querySelector("#archiveDrawerSubtitle"),
    archiveNameInput: document.querySelector("#archiveNameInput"),
    saveArchiveButton: document.querySelector("#saveArchiveButton"),
    startFreshArchiveButton: document.querySelector("#startFreshArchiveButton"),
    archiveSearch: document.querySelector("#archiveSearch"),
    archiveList: document.querySelector("#archiveList"),
    archiveFilterButtons: document.querySelectorAll("[data-archive-filter]")
  });
}

function sessionListen(target, eventName, handler) {
  if (target) target.addEventListener(eventName, handler);
}

function sessionBindEvents() {
  sessionHydrateElements();

  sessionListen(elements.apiPlatform, "change", () => {
    const nextDefault = ApiHandler.getDefaultEndpoint(elements.apiPlatform.value);
    const current = elements.endpoint.value.trim().replace(/\/+$/, "");
    const officialEndpoints = ["openai", "gemini", "deepseek", "glm"].flatMap((platform) => {
      const base = ApiHandler.getDefaultEndpoint(platform);
      return [base, base + "/v1", base + "/v1/chat/completions", base + "/chat/completions"];
    });
    if (nextDefault && (!current || officialEndpoints.includes(current))) elements.endpoint.value = nextDefault;
    populateModelsDropdown();
  });
  sessionListen(elements.endpoint, "change", populateModelsDropdown);
  sessionListen(elements.apiKey, "change", populateModelsDropdown);
  sessionListen(elements.corsProxyMode, "change", populateModelsDropdown);
  sessionListen(elements.proxyMode, "change", populateModelsDropdown);

  sessionListen(elements.chatForm, "submit", sessionHandleSubmit);
  sessionListen(elements.chatInput, "input", autosizeInput);
  sessionListen(elements.chatInput, "keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      elements.chatForm.requestSubmit();
    }
  });

  sessionListen(elements.globalArchiveButton, "click", sessionOpenArchiveDrawer);
  sessionListen(elements.chatArchiveButton, "click", sessionOpenArchiveDrawer);
  sessionListen(elements.conversationArchiveButton, "click", sessionOpenArchiveDrawer);
  sessionListen(elements.closeArchiveDrawer, "click", sessionCloseArchiveDrawer);
  sessionListen(elements.saveArchiveButton, "click", sessionSaveCurrentArchive);
  sessionListen(elements.startFreshArchiveButton, "click", () => sessionStartFreshSession(appState.activeCharacterId, true));
  sessionListen(elements.archiveSearch, "input", sessionRenderArchiveList);
  if (elements.archiveFilterButtons) {
    elements.archiveFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        elements.archiveFilterButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        sessionRenderArchiveList();
      });
    });
  }
  sessionListen(elements.archiveDrawer, "click", (event) => {
    if (event.target === elements.archiveDrawer) sessionCloseArchiveDrawer();
  });
  sessionListen(elements.backToChatsButton, "click", () => sessionShowChatList());
  sessionListen(elements.newConversationButton, "click", () => sessionStartFreshSession(appState.activeCharacterId, true));
  sessionListen(elements.chatSearch, "input", sessionRenderChatList);
  sessionListen(elements.characterSearch, "input", sessionRenderCharacterList);

  sessionListen(elements.userPersonaButton, "click", openUserPersonaDrawer);
  sessionListen(elements.closeUserPersonaDrawer, "click", closeUserPersonaDrawer);
  sessionListen(elements.userPersonaForm, "submit", saveUserPersonaFromForm);
  sessionListen(elements.resetUserPersonaButton, "click", resetUserPersonaForm);
  sessionListen(elements.userPersonaDrawer, "click", (event) => {
    if (event.target === elements.userPersonaDrawer) closeUserPersonaDrawer();
  });

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sessionSwitchTab(tab.dataset.tab);
      if (tab.dataset.tab === "chat") sessionShowChatList(false);
    });
  });

  sessionListen(elements.addCharacterButton, "click", () => openCharacterDrawer());
  sessionListen(elements.addWorldButton, "click", () => openWorldDrawer());
  sessionListen(elements.worldSearch, "input", renderWorldList);
  sessionListen(elements.settingsForm, "submit", (event) => {
    event.preventDefault();
    saveConfigFromForm();
    updateConnectionLabel("已保存");
    setTimeout(() => updateConnectionLabel(), 2000);
  });
  sessionListen(elements.testButton, "click", testConnection);
  sessionListen(elements.exportButton, "click", sessionExportSettings);
  sessionListen(elements.importButton, "click", () => elements.importFile.click());
  sessionListen(elements.importFile, "change", sessionImportSettings);
  sessionListen(elements.resetButton, "click", resetToDefaults);

  sessionListen(elements.closeCharacterDrawer, "click", closeCharacterDrawer);
  sessionListen(elements.closeWorldDrawer, "click", closeWorldDrawer);
  sessionListen(elements.characterDrawer, "click", (event) => {
    if (event.target === elements.characterDrawer) closeCharacterDrawer();
  });
  sessionListen(elements.worldDrawer, "click", (event) => {
    if (event.target === elements.worldDrawer) closeWorldDrawer();
  });
  sessionListen(elements.characterForm, "submit", sessionHandleCharacterSubmit);
  sessionListen(elements.duplicateCharacterButton, "click", () => {
    elements.characterId.value = "";
    elements.characterName.value += " 副本";
  });
  sessionListen(elements.worldForm, "submit", handleWorldSubmit);
  sessionListen(elements.duplicateWorldButton, "click", () => {
    elements.worldId.value = "";
    elements.worldTitle.value += " 副本";
  });
}

function sessionNormalizeState(parsed) {
  const characters = Array.isArray(parsed.characters) && parsed.characters.length
    ? parsed.characters.map(sessionNormalizeCharacter)
    : defaultCharacters.map(sessionNormalizeCharacter);
  const worldBook = Array.isArray(parsed.worldBook) ? parsed.worldBook : defaultWorldEntries;
  const moments = Array.isArray(parsed.moments) ? parsed.moments.map(normalizeMomentData).filter(Boolean) : makeDefaultMoments();
  const activeCharacterId = characters.some((char) => char.id === parsed.activeCharacterId) ? parsed.activeCharacterId : characters[0].id;
  const legacyMessages = parsed.messages && typeof parsed.messages === "object" ? parsed.messages : {};
  const rawSessions = parsed.sessions && typeof parsed.sessions === "object" ? parsed.sessions : {};
  const currentSessionIds = parsed.currentSessionIds && typeof parsed.currentSessionIds === "object" ? parsed.currentSessionIds : {};
  const sessions = {};
  const messages = {};

  characters.forEach((char) => {
    const list = Array.isArray(rawSessions[char.id]) ? rawSessions[char.id] : [];
    const picked = list.find((item) => item && item.id === currentSessionIds[char.id]) || list[0];
    const session = picked ? sessionNormalizeSession(picked, char) : sessionMakeFromMessages(char, legacyMessages[char.id], "当前聊天", "");
    sessions[char.id] = [session];
    currentSessionIds[char.id] = session.id;
    messages[char.id] = session.messages.map(sessionCloneMessage);
  });

  const archives = Array.isArray(parsed.archives)
    ? parsed.archives.map((archive) => sessionNormalizeArchive(archive, characters)).filter(Boolean)
    : [];

  return { activeCharacterId, characters, worldBook, moments, messages, sessions, currentSessionIds, archives };
}

function sessionNormalizeCharacter(char) {
  return normalizeCharacterData(char);
}

function sessionNormalizeSession(session, char) {
  const messages = sessionNormalizeMessages(session.messages, char);
  const now = Date.now();
  return {
    id: session.id || sessionCreateId("session"),
    characterId: char.id,
    title: session.title || "当前聊天",
    loadedArchiveId: session.loadedArchiveId || "",
    createdAt: Number(session.createdAt) || now,
    updatedAt: Number(session.updatedAt) || sessionNewestMessageTime(messages) || now,
    messages
  };
}

function sessionNormalizeArchive(archive, characters) {
  const char = characters.find((item) => item.id === archive?.characterId);
  if (!char) return null;
  const messages = sessionNormalizeMessages(archive.messages, char);
  return {
    id: archive.id || sessionCreateId("archive"),
    name: archive.name || archive.title || `${char.name} ${sessionArchiveNameTime(Date.now())}`,
    characterId: char.id,
    characterName: archive.characterName || char.name,
    avatar: archive.avatar || char.avatar,
    color: archive.color || char.color,
    createdAt: Number(archive.createdAt) || Date.now(),
    updatedAt: Number(archive.updatedAt) || sessionNewestMessageTime(messages) || Date.now(),
    messages
  };
}

function sessionNormalizeMessages(messages, char) {
  const list = Array.isArray(messages) ? messages.map(sessionCloneMessage).filter((message) => message.content || message.loading || message.type !== "text") : [];
  return list.length || !char.greeting ? list : [assistantMessage(char.greeting, "开场")];
}

function sessionCloneMessage(message) {
  return normalizeMessageData(message);
}

function sessionMakeFromMessages(char, messages, title, loadedArchiveId) {
  const normalized = sessionNormalizeMessages(messages, char);
  const now = Date.now();
  return {
    id: sessionCreateId("session"),
    characterId: char.id,
    title: title || "当前聊天",
    loadedArchiveId: loadedArchiveId || "",
    createdAt: now,
    updatedAt: sessionNewestMessageTime(normalized) || now,
    messages: normalized
  };
}

function sessionCreateBlank(char) {
  return sessionMakeFromMessages(char, char.greeting ? [assistantMessage(char.greeting, "开场")] : [], "新聊天", "");
}

function sessionCreateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sessionNewestMessageTime(messages) {
  return messages.reduce((latest, message) => Math.max(latest, Number(message.time) || 0), 0);
}

function sessionGetActiveCharacter() {
  return appState.characters.find((char) => char.id === appState.activeCharacterId) || appState.characters[0];
}

function sessionEnsureCurrentSession(charId) {
  const char = appState.characters.find((item) => item.id === charId) || appState.characters[0];
  if (!appState.sessions || typeof appState.sessions !== "object") appState.sessions = {};
  if (!appState.currentSessionIds || typeof appState.currentSessionIds !== "object") appState.currentSessionIds = {};
  const list = Array.isArray(appState.sessions[char.id]) ? appState.sessions[char.id] : [];
  let session = list.find((item) => item.id === appState.currentSessionIds[char.id]) || list[0];
  session = session ? sessionNormalizeSession(session, char) : sessionCreateBlank(char);
  appState.sessions[char.id] = [session];
  appState.currentSessionIds[char.id] = session.id;
  appState.messages[char.id] = session.messages.map(sessionCloneMessage);
  return session;
}

function sessionGetCurrentSession(charId = appState.activeCharacterId) {
  return sessionEnsureCurrentSession(charId);
}

function sessionSetCurrentSession(charId, session) {
  appState.sessions[charId] = [session];
  appState.currentSessionIds[charId] = session.id;
  appState.messages[charId] = session.messages.map(sessionCloneMessage);
}

function sessionSaveState() {
  appState.characters.forEach((char) => {
    appState.messages[char.id] = sessionGetCurrentSession(char.id).messages.map(sessionCloneMessage);
  });
  localStorage.setItem(storageKey, JSON.stringify({
    activeCharacterId: appState.activeCharacterId,
    characters: appState.characters,
    worldBook: appState.worldBook,
    moments: appState.moments || [],
    messages: appState.messages,
    sessions: appState.sessions,
    currentSessionIds: appState.currentSessionIds,
    archives: appState.archives
  }));
}

function sessionSetActiveCharacter(id) {
  sessionOpenConversation(id);
}

function sessionSwitchTab(tabName) {
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === tabName));
  elements.views.forEach((view) => view.classList.toggle("is-active", view.dataset.view === tabName));
}

function sessionShowChatList(shouldRender = true) {
  sessionHydrateElements();
  if (elements.chatListScreen) elements.chatListScreen.hidden = false;
  if (elements.conversationScreen) elements.conversationScreen.hidden = true;
  if (shouldRender) sessionRenderChatList();
}

function sessionOpenConversation(id) {
  sessionHydrateElements();
  const char = appState.characters.find((item) => item.id === id) || appState.characters[0];
  appState.activeCharacterId = char.id;
  sessionEnsureCurrentSession(char.id);
  if (elements.chatListScreen) elements.chatListScreen.hidden = true;
  if (elements.conversationScreen) elements.conversationScreen.hidden = false;
  sessionSaveState();
  sessionRenderChatList();
  sessionRenderConversationTitle();
  sessionRenderActivePersonaCard();
  sessionRenderMessages();
  setTimeout(() => elements.chatInput?.focus(), 60);
}

function sessionRenderChatList() {
  sessionHydrateElements();
  if (!elements.chatList) return;
  const query = (elements.chatSearch?.value || "").trim().toLowerCase();
  const visible = appState.characters.filter((char) => !query || [char.name, char.title, char.tags, char.intro].join(" ").toLowerCase().includes(query));
  if (elements.chatOverview) elements.chatOverview.textContent = `${appState.characters.length} 位联系人 · ${appState.archives.length} 个存档`;
  if (!visible.length) {
    elements.chatList.innerHTML = `<div class="empty-state">没有找到聊天对象。</div>`;
    return;
  }
  elements.chatList.innerHTML = visible.map(sessionRenderChatRow).join("");
  elements.chatList.querySelectorAll("[data-chat-id]").forEach((button) => {
    button.addEventListener("click", () => sessionOpenConversation(button.dataset.chatId));
  });
}

function sessionRenderChatRow(char) {
  const session = sessionGetCurrentSession(char.id);
  const last = sessionLastVisibleMessage(session.messages);
  const preview = last ? `${last.role === "user" ? "我：" : ""}${last.content}` : char.greeting;
  const archiveCount = appState.archives.filter((archive) => archive.characterId === char.id).length;
  return `
    <button class="chat-row" type="button" data-chat-id="${escapeHtml(char.id)}" style="--char-color:${escapeHtml(char.color)}">
      <span class="chat-row-avatar" style="background:${escapeHtml(char.color)}">${escapeHtml(char.avatar || char.name[0])}</span>
      <span class="chat-row-main">
        <span class="chat-row-title"><strong>${escapeHtml(char.name)}</strong><time>${escapeHtml(sessionFormatChatTime(last?.time || session.updatedAt))}</time></span>
        <span class="chat-preview">${escapeHtml(preview || "点进去开始聊天")}</span>
      </span>
      <span class="chat-row-side">${archiveCount ? `<span class="archive-count">${archiveCount}</span>` : ""}</span>
    </button>
  `;
}

function sessionLastVisibleMessage(messages) {
  return [...messages].reverse().find((message) => !message.loading && message.content);
}

function sessionRenderConversationTitle() {
  sessionHydrateElements();
  if (!elements.conversationTitle) return;
  const char = sessionGetActiveCharacter();
  const session = sessionGetCurrentSession(char.id);
  const subtitle = session.loadedArchiveId ? "载入：" + session.title : session.title || "新聊天";
  elements.conversationTitle.innerHTML = `<strong>${escapeHtml(char.name)}</strong><span>${escapeHtml(subtitle)}</span>`;
}

function sessionRenderActivePersonaCard() {
  if (!elements.activePersona) return;
  const char = sessionGetActiveCharacter();
  document.documentElement.style.setProperty("--active-color", char.color);
  document.documentElement.style.setProperty("--active-soft", char.soft || "rgba(255,127,141,0.18)");
  const tagsHtml = (char.tags || "").split(/[,，]/).map((tag) => tag.trim()).filter(Boolean).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const roleText = char.role || (char.tags || "").split(/[,，]/).map((tag) => tag.trim()).filter(Boolean)[0] || "自定义角色";
  elements.activePersona.innerHTML = `
    <button class="avatar-big" data-active-avatar-nudge="1" type="button" style="background:${escapeHtml(char.color)}" title="拍一拍" aria-label="拍一拍${escapeHtml(char.name)}"><span>${escapeHtml(char.avatar || char.name[0])}</span></button>
    <div class="persona-copy">
      <h1>${escapeHtml(char.name)}</h1>
      <p>${escapeHtml(roleText)} · ${escapeHtml(char.title || char.intro || "")}</p>
      <div class="tag-row">${tagsHtml}</div>
    </div>
    <button class="icon-button persona-edit" id="editActivePersonaButton" type="button" title="编辑设定" aria-label="编辑联系人">
      <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-9.5-3.5 9-9a2.12 2.12 0 1 1 3 3l-9 9h-3v-3z"/></svg>
    </button>
  `;
  document.querySelector("#editActivePersonaButton")?.addEventListener("click", () => openCharacterDrawer(char));
  elements.activePersona.querySelector("[data-active-avatar-nudge]")?.addEventListener("dblclick", () => sendNudge(char));
}

function sessionRenderMessages() {
  if (!elements.messages) return;
  const char = sessionGetActiveCharacter();
  const session = sessionGetCurrentSession(char.id);
  elements.messages.innerHTML = session.messages.map((message) => renderMessage(message, char)).join("");
  bindRenderedMessageActions(elements.messages, char, session.messages);
  elements.messages.scrollTop = elements.messages.scrollHeight;
  sessionRenderConversationTitle();
}

async function sessionHandleSubmit(event) {
  event.preventDefault();
  const content = elements.chatInput.value.trim();
  if (!content || isSending) return;
  const char = sessionGetActiveCharacter();
  const session = sessionGetCurrentSession(char.id);
  session.messages.push(userMessage(content, currentQuote));
  clearCurrentQuote();
  session.updatedAt = Date.now();
  elements.chatInput.value = "";
  autosizeInput();
  sessionSaveState();
  sessionRenderMessages();
  sessionRenderChatList();
  if (!apiConfig.manualReplyMode) await sessionReplyToUser(char, content);
  else {
    updateConnectionLabel("等待回复");
    elements.replyButton.onclick = async () => {
      elements.replyButton.disabled = true;
      try {
        await sessionReplyToUser(char, content);
      } finally {
        elements.replyButton.disabled = false;
      }
    };
  }
}

async function sessionReplyToUser(char, content) {
  isSending = true;
  elements.sendButton.disabled = true;
  updateConnectionLabel("思考中");
  const session = sessionGetCurrentSession(char.id);
  session.messages.push({ role: "assistant", content: "", loading: true, meta: "正在输入...", time: Date.now() });
  session.updatedAt = Date.now();
  sessionRenderMessages();
  const worldEntries = triggerWorldBook(content, char.id);
  assistantMessageInnerVoiceMode = normalizeCharacterMode(char.mode).innerVoice;
  try {
    const useApi = Boolean(apiConfig.apiKey);
    const reply = useApi ? await callChatApi(char, worldEntries) : sessionLocalReply(char);
    const chunks = useApi ? splitAssistantReply(reply) : [reply];
    if (!chunks.length) throw new Error("接口返回内容为空");
    sessionReplaceLoadingMessage(char.id, assistantMessage(chunks[0], useApi ? "API" : "本地陪伴"));
    sessionSaveState();
    sessionRenderMessages();
    for (const chunk of chunks.slice(1)) {
      await sleep(Math.min(1800, 320 + chunk.length * 45));
      sessionGetCurrentSession(char.id).messages.push(assistantMessage(chunk, useApi ? "API" : "本地陪伴"));
      sessionGetCurrentSession(char.id).updatedAt = Date.now();
      sessionSaveState();
      sessionRenderMessages();
    }
    updateConnectionLabel(useApi ? "回复完毕" : "本地回复");
  } catch (error) {
    sessionReplaceLoadingMessage(char.id, assistantMessage(apiFailureReply(error), "连接提示"));
    updateConnectionLabel("连接失败");
  } finally {
    assistantMessageInnerVoiceMode = false;
    isSending = false;
    elements.sendButton.disabled = false;
    sessionSaveState();
    sessionRenderMessages();
    sessionRenderChatList();
    setTimeout(() => {
      updateConnectionLabel();
      elements.worldHints.classList.remove("has-hits");
      elements.worldHints.innerHTML = "";
    }, 4000);
  }
}

function sessionEnsureMessageList(charId) {
  sessionEnsureCurrentSession(charId);
}

function sessionReplaceLoadingMessage(charId, replacement) {
  const session = sessionGetCurrentSession(charId);
  const index = session.messages.findIndex((message) => message.loading);
  if (index >= 0) session.messages.splice(index, 1, replacement);
  else session.messages.push(replacement);
  session.updatedAt = Date.now();
}

function sessionLocalReply(char) {
  const latest = sessionGetCurrentSession(char.id).messages.filter((message) => message.role === "user").slice(-1)[0]?.content || "";
  const next = latest.length > 20 ? latest.slice(0, 20) + "..." : latest;
  return "（在可爱手机里认真听完「" + (next || "悄悄话") + "」）\n\n当前还在本地陪伴模式。配置 API 后，只有这段当前聊天会进入记忆；保存后开启的新聊天不会带着前面的记录。";
}

function sessionBuildApiMessages(char, worldEntries, options = {}) {
  const systemPrompt = buildSystemPrompt(char, worldEntries, options);
  if (options.test) {
    return [{ role: "system", content: systemPrompt }, { role: "user", content: "测试一下接口是否能正常回复，请只说连接正常。" }];
  }
  const history = sessionGetCurrentSession(char.id).messages
    .filter((message) => !message.loading && message.content && message.type !== "system")
    .slice(-24)
    .map((message) => ({ role: message.role, content: message.quote ? `引用${message.quote.author}：${message.quote.text}\n${message.content}` : message.content }));
  return [{ role: "system", content: systemPrompt }, ...history];
}

function sessionOpenArchiveDrawer() {
  sessionHydrateElements();
  const char = sessionGetActiveCharacter();
  if (elements.archiveDrawerSubtitle) elements.archiveDrawerSubtitle.textContent = `${char.name} · ${appState.archives.filter((archive) => archive.characterId === char.id).length} 个存档`;
  if (elements.archiveNameInput) elements.archiveNameInput.value = sessionDefaultArchiveName(char);
  sessionRenderArchiveList();
  elements.archiveDrawer.classList.add("is-open");
  elements.archiveDrawer.setAttribute("aria-hidden", "false");
}

function sessionCloseArchiveDrawer() {
  elements.archiveDrawer.classList.remove("is-open");
  elements.archiveDrawer.setAttribute("aria-hidden", "true");
}

function sessionSaveCurrentArchive() {
  const char = sessionGetActiveCharacter();
  const session = sessionGetCurrentSession(char.id);
  const messages = session.messages.filter((message) => !message.loading).map(sessionCloneMessage);
  const name = (elements.archiveNameInput?.value || "").trim() || sessionDefaultArchiveName(char);
  const now = Date.now();
  appState.archives.unshift({ id: sessionCreateId("archive"), name, characterId: char.id, characterName: char.name, avatar: char.avatar, color: char.color, createdAt: now, updatedAt: sessionNewestMessageTime(messages) || now, messages });
  sessionSetCurrentSession(char.id, sessionCreateBlank(char));
  sessionSaveState();
  if (elements.archiveNameInput) elements.archiveNameInput.value = sessionDefaultArchiveName(char);
  sessionRenderArchiveList();
  sessionRenderChatList();
  sessionRenderMessages();
  updateConnectionLabel("已存档，新聊天已开启");
  setTimeout(() => updateConnectionLabel(), 2500);
}

function sessionStartFreshSession(charId, openAfter) {
  const char = appState.characters.find((item) => item.id === charId) || appState.characters[0];
  const current = sessionGetCurrentSession(char.id);
  const hasUserMessage = current.messages.some((message) => message.role === "user" && !message.loading);
  if (hasUserMessage && !confirm("当前聊天还没有存档，确定开启新聊天吗？")) return;
  appState.activeCharacterId = char.id;
  sessionSetCurrentSession(char.id, sessionCreateBlank(char));
  sessionSaveState();
  sessionRenderChatList();
  sessionRenderMessages();
  if (openAfter) sessionOpenConversation(char.id);
  updateConnectionLabel("新聊天已开启");
  setTimeout(() => updateConnectionLabel(), 1800);
}

function sessionLoadArchive(id) {
  const archive = appState.archives.find((item) => item.id === id);
  if (!archive) return;
  const char = appState.characters.find((item) => item.id === archive.characterId);
  if (!char) return;
  appState.activeCharacterId = char.id;
  sessionSetCurrentSession(char.id, sessionMakeFromMessages(char, archive.messages, archive.name, archive.id));
  sessionSaveState();
  sessionCloseArchiveDrawer();
  sessionOpenConversation(char.id);
  updateConnectionLabel("已载入存档");
  setTimeout(() => updateConnectionLabel(), 2000);
}

function sessionDeleteArchive(id) {
  const archive = appState.archives.find((item) => item.id === id);
  if (!archive || !confirm(`删除存档「${archive.name}」吗？`)) return;
  appState.archives = appState.archives.filter((item) => item.id !== id);
  sessionSaveState();
  sessionRenderArchiveList();
  sessionRenderChatList();
}

function sessionRenderArchiveList() {
  sessionHydrateElements();
  if (!elements.archiveList) return;
  const char = sessionGetActiveCharacter();
  const currentOnly = document.querySelector("[data-archive-filter].is-active")?.dataset.archiveFilter !== "all";
  const query = (elements.archiveSearch?.value || "").trim().toLowerCase();
  const archives = appState.archives.filter((archive) => (!currentOnly || archive.characterId === char.id) && (!query || [archive.name, archive.characterName].join(" ").toLowerCase().includes(query)));
  if (!archives.length) {
    elements.archiveList.innerHTML = `<div class="empty-state">暂无聊天存档。</div>`;
    return;
  }
  elements.archiveList.innerHTML = archives.map((archive) => {
    const active = sessionGetCurrentSession(archive.characterId).loadedArchiveId === archive.id;
    const preview = sessionLastVisibleMessage(archive.messages)?.content || "空聊天";
    return `
      <article class="archive-card ${active ? "is-current" : ""}">
        <div class="archive-card-header"><div><h3>${escapeHtml(archive.name)}</h3><p>${escapeHtml(archive.characterName)} · ${escapeHtml(sessionFormatArchiveTime(archive.updatedAt))}</p></div><span class="scope-tag">${archive.messages.length} 条</span></div>
        <p>${escapeHtml(preview)}</p>
        <div class="archive-actions"><button class="small-button" type="button" data-load-archive="${escapeHtml(archive.id)}">载入</button><button class="small-button is-danger" type="button" data-delete-archive="${escapeHtml(archive.id)}">删除</button></div>
      </article>
    `;
  }).join("");
  elements.archiveList.querySelectorAll("[data-load-archive]").forEach((button) => button.addEventListener("click", () => sessionLoadArchive(button.dataset.loadArchive)));
  elements.archiveList.querySelectorAll("[data-delete-archive]").forEach((button) => button.addEventListener("click", () => sessionDeleteArchive(button.dataset.deleteArchive)));
}

function sessionDefaultArchiveName(char) {
  return `${char.name} ${sessionArchiveNameTime(Date.now())}`;
}

function sessionArchiveNameTime(timestamp) {
  return new Date(timestamp || Date.now()).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(/\//g, "-");
}

function sessionFormatArchiveTime(timestamp) {
  return new Date(timestamp || Date.now()).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

function sessionFormatChatTime(timestamp) {
  const date = new Date(timestamp || Date.now());
  return date.toDateString() === new Date().toDateString()
    ? date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
    : date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}

function sessionRenderCharacterList() {
  const query = (elements.characterSearch?.value || "").trim().toLowerCase();
  const filtered = appState.characters.filter((char) => !query || [char.name, char.title, char.tags, char.intro].join(" ").toLowerCase().includes(query));
  elements.characterCount.textContent = `${filtered.length} / ${appState.characters.length} 个联系人`;
  if (elements.contactStats) {
    elements.contactStats.innerHTML = `<div class="stat-pill"><strong>${appState.characters.length}</strong><span>联系人</span></div><div class="stat-pill"><strong>${appState.archives.length}</strong><span>聊天存档</span></div><div class="stat-pill"><strong>${appState.worldBook.length}</strong><span>世界书</span></div>`;
  }
  if (!filtered.length) {
    elements.characterList.innerHTML = `<div class="empty-state">没有找到联系人。</div>`;
    return;
  }
  elements.characterList.innerHTML = filtered.map((char) => {
    const tags = (char.tags || "").split(/[,，]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const archiveCount = appState.archives.filter((archive) => archive.characterId === char.id).length;
    const preview = getPersonaPreview(char.intro || char.greeting || "", 72);
    return `
      <article class="item-card contact-card" style="--card-color:${escapeHtml(char.color)}">
        <div class="item-top"><div class="avatar" style="background:${escapeHtml(char.color)}">${escapeHtml(char.avatar || char.name[0])}</div><div class="item-title"><strong>${escapeHtml(char.name)}</strong><span>${escapeHtml(char.title || char.role || "聊天联系人")}</span></div><span class="scope-tag">${archiveCount} 存档</span></div>
        <p>${escapeHtml(preview)}</p><div class="tag-row">${tags}</div>
        <div class="item-actions"><button class="small-button chat-btn" type="button" data-id="${escapeHtml(char.id)}">聊天</button><button class="small-button edit-btn" type="button" data-id="${escapeHtml(char.id)}">编辑</button><button class="small-button is-danger delete-btn" type="button" data-id="${escapeHtml(char.id)}">删除</button></div>
      </article>
    `;
  }).join("");
  elements.characterList.querySelectorAll(".chat-btn").forEach((button) => button.addEventListener("click", () => { sessionSwitchTab("chat"); sessionOpenConversation(button.dataset.id); }));
  elements.characterList.querySelectorAll(".edit-btn").forEach((button) => button.addEventListener("click", () => { const char = appState.characters.find((item) => item.id === button.dataset.id); if (char) openCharacterDrawer(char); }));
  elements.characterList.querySelectorAll(".delete-btn").forEach((button) => button.addEventListener("click", () => sessionDeleteCharacter(button.dataset.id)));
}

function sessionDeleteCharacter(id) {
  if (appState.characters.length <= 1) return alert("至少要保留一个联系人。");
  const char = appState.characters.find((item) => item.id === id);
  if (!char || !confirm(`确定要删除联系人「${char.name}」吗？聊天存档也会一起删除。`)) return;
  appState.characters = appState.characters.filter((item) => item.id !== id);
  delete appState.sessions[id];
  delete appState.currentSessionIds[id];
  delete appState.messages[id];
  appState.archives = appState.archives.filter((archive) => archive.characterId !== id);
  if (appState.activeCharacterId === id) appState.activeCharacterId = appState.characters[0].id;
  sessionSaveState();
  populateScopeSelect();
  sessionRenderChatList();
  sessionRenderCharacterList();
  sessionShowChatList();
}

function sessionHandleCharacterSubmit(event) {
  event.preventDefault();
  const id = elements.characterId.value.trim() || "char-" + Date.now();
  const name = elements.characterName.value.trim() || "未命名联系人";
  const color = elements.characterColor.value;
  const tags = elements.characterTags.value.trim();
  const existingChar = appState.characters.find((char) => char.id === id);
  const checkedBoxes = document.querySelectorAll("input[name=\"boundWorldBooks\"]:checked");
  const nextChar = sessionNormalizeCharacter({
    id,
    name,
    color,
    avatar: elements.characterAvatar.value.trim() || name[0] || "TA",
    soft: convertHexToRgba(color, 0.3),
    role: tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean)[0] || existingChar?.role || "自定义联系人",
    title: existingChar?.title || "",
    tags,
    intro: elements.characterIntro.value.trim(),
    greeting: elements.characterGreeting.value.trim(),
    system: elements.characterSystem.value.trim(),
    mode: readCharacterModeForm(),
    boundWorldBookIds: Array.from(checkedBoxes).map((checkbox) => checkbox.value)
  });
  const existingIndex = appState.characters.findIndex((char) => char.id === id);
  if (existingIndex >= 0) appState.characters[existingIndex] = nextChar;
  else {
    appState.characters.push(nextChar);
    sessionSetCurrentSession(id, sessionCreateBlank(nextChar));
  }
  sessionSaveState();
  closeCharacterDrawer();
  populateScopeSelect();
  populateModelsDropdown();
  sessionRenderChatList();
  sessionRenderCharacterList();
  sessionRenderActivePersonaCard();
  sessionRenderMessages();
}

function sessionExportSettings() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "mianer-phone-settings-" + Date.now() + ".json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function sessionImportSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed.characters) && Array.isArray(parsed.worldBook)) {
        appState = sessionNormalizeState(parsed);
        sessionSaveState();
        alert("导入成功！正在刷新。");
        location.reload();
      } else alert("导入文件格式不正确，缺少联系人或世界书配置。");
    } catch {
      alert("解析 JSON 文件失败，请确认文件是否完整。");
    }
  };
  reader.readAsText(file);
}
