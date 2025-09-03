// Background script to handle API calls
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateEmail") {
    console.log("Background: Received generateEmail request");

    // Make the API call from background script (has more permissions)
    fetch("http://localhost:8080/api/email/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      body: JSON.stringify({
        emailContent: request.emailContent,
        tone: request.tone || "professional",
      }),
    })
      .then((response) => {
        console.log("Background: API response status:", response.status);
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        return response.text();
      })
      .then((generatedReply) => {
        console.log("Background: Generated reply received");
        sendResponse({ success: true, reply: generatedReply });
      })
      .catch((error) => {
        console.error("Background: API call failed:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

console.log("Background script loaded");
