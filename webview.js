async function checkStorageKey(key) {
    const result = await chrome.storage.sync.get(key);
    return result[key] !== false;
}
async function setStorageKey(key, value) {
    return chrome.storage.sync.set({ [key]: value });
}






const jak_checkbox = document.getElementById("jak_checkbox");
(async () => {
    let val = await checkStorageKey("vikaze_jak_option");
    jak_checkbox.checked = val;
})();
jak_checkbox.addEventListener('change', (event) => {
    (async () => {
        setStorageKey("vikaze_jak_option", event.currentTarget.checked);
    })();
})




const gnomio_checkbox = document.getElementById("gnomio_checkbox");
(async () => {
    let val = await checkStorageKey("vikaze_gnomio_option");
    gnomio_checkbox.checked = val;
})();
gnomio_checkbox.addEventListener('change', (event) => {
    (async () => {
        setStorageKey("vikaze_gnomio_option", event.currentTarget.checked);
    })();
})