chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureTab") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataURL) => {
            sendResponse({ screenshot: dataURL });
        });
        return true;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ANALYZE_IMAGE") {
    const API_KEY = "NONE";
    //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${API_KEY}`;
    //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{
        parts: [
          { text: request.prompt },
          {
            inlineData: {
              mimeType: request.mimeType,
              data: request.data
            }
          }
        ]
      }]
    };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      const resultText = data.candidates[0].content.parts[0].text;
      sendResponse({ text: resultText });
    })
    .catch(err => sendResponse({ error: err.message }));

    return true;
  }
});