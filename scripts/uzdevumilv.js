async function screenshotElement(element) {
    if (!element) throw new Error("Element is required");

    const rect = element.getBoundingClientRect();
    //const sx = rect.left + window.scrollX;
    //const sy = rect.top + window.scrollY;
    const sx = rect.left;
    const sy = rect.top;
    console.log("sx - " + sx + ", sy - " + sy);
    
    const sWidth = rect.width;
    const sHeight = rect.height;
    console.log("width,height: ", sWidth, sHeight);

    const fullScreenshot = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "captureTab" }, (response) => {
            resolve(response.screenshot);
        });
    });

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = sWidth;
            canvas.height = sHeight;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

            resolve(canvas.toDataURL());
        };
        img.src = fullScreenshot;
    });
}

function doitnow() {
    (async () => {
    //const element = document.querySelector(".block.sm-easy-header.no-bmarg");
    const element = document.getElementById("taskhtml");
    if (!element) {
        console.error("Element not found!");
        return;
    }

    const screenshot = await screenshotElement(element);

    const container = document.createElement("div");
    container.style.padding = "16px";
    container.style.background = "white";
    container.style.width = "100%";
    container.style.marginTop = "10px";
    container.style.lineHeight = "1.6";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "16px";
    container.style.border = "1px solid #ddd";
    container.style.borderRadius = "8px";

    const loading_gif = document.createElement("img");
    loading_gif.setAttribute("src", "https://media.tenor.com/eFde1mp-8fYAAAAM/carregando.gif");
    loading_gif.style.height = "50px";
    loading_gif.style.width = "auto";
    const loading_span = document.createElement("span");
    loading_span.style.marginLeft = "10px";
    loading_span.innerText = "VIKAZE AI LOADING!!!";

    container.appendChild(loading_gif);
    container.appendChild(loading_span);

    element.appendChild(container);

    chrome.runtime.sendMessage({
        type: "ANALYZE_IMAGE",
        prompt: "Izpildi uzdevumu, īsi, konkrēti",
        mimeType: "image/png", // Change based on your image type
        data: screenshot.split(",")[1]
    }, (response) => {
        console.log("Gemini Analysis:", response.text);

        loading_gif.remove();
        loading_span.remove();

        // ===== Convert simple markdown to HTML =====
        let tt = response.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
            .replace(/\n\n/g, "</p><p>") // paragraphs
            .replace(/\n/g, "<br>"); // line breaks

        container.innerHTML = "<p>" + tt + "</p>";


        // ===== Render LaTeX using KaTeX auto-render =====
        renderMathInElement(container, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
            ],
            throwOnError: false
        });


    });
    

})();
}


(async () => {
    if (await window.checkStorageKey("vikaze_uzdevumilv_option")) {
        const uzdevums_tab = document.querySelector(".header.clearfix.hidden-xs");
        if (uzdevums_tab) {
            let buttonChild = document.createElement("button");
            buttonChild.innerText = "VIKAZE AI";
            buttonChild.style.border = "none";
            buttonChild.style.borderRadius = "10px";
            buttonChild.style.backgroundColor = "#b11010";
            buttonChild.style.marginLeft = "10px";
            buttonChild.style.minWidth = "120px";

            uzdevums_tab.appendChild(buttonChild);
            buttonChild.addEventListener("click", doitnow);
        }
    }
})();
