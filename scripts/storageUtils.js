async function setStorageKey(key, value) {
    return chrome.storage.sync.set({ [key]: value });
}

async function checkStorageKey(key) {
    const result = await chrome.storage.sync.get(key);
    return result[key] !== false;
}

if (typeof window !== "undefined") {
    window.setStorageKey = setStorageKey;
    window.checkStorageKey = checkStorageKey;
}