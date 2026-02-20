(async () => {
    if (await window.checkStorageKey("vikaze_jak_option")) {
        const observer = new MutationObserver(() => {
            const popup = document.querySelector(".cookies_gdpr_popup");

            if (popup) {
                console.log("Popups noņemts - VIKAZE");
                popup.remove();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();