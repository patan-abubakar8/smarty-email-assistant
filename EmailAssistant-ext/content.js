// Modern text insertion function to replace deprecated execCommand
function insertTextModern(element, text) {
  try {
    // Clear existing content first
    element.innerHTML = "";

    // For Gmail's rich text editor, we need to handle it as HTML
    const formattedText = text.replace(/\n/g, "<br>");

    // Method 1: Direct innerHTML insertion
    element.innerHTML = formattedText;

    // Method 2: If that doesn't work, try textContent
    if (!element.innerHTML || element.innerHTML.trim() === "") {
      element.textContent = text;
    }

    // Trigger all the events Gmail might be listening for
    const events = ["input", "change", "keyup", "paste"];
    events.forEach((eventType) => {
      element.dispatchEvent(
        new Event(eventType, {
          bubbles: true,
          cancelable: true,
        })
      );
    });

    // Also try triggering a more specific input event
    element.dispatchEvent(
      new InputEvent("input", {
        inputType: "insertText",
        data: text,
        bubbles: true,
        cancelable: true,
      })
    );

    console.log("Text inserted successfully");
  } catch (e) {
    console.error("Text insertion failed:", e);
    // Last resort - try the old execCommand if available
    try {
      element.focus();
      document.execCommand("insertText", false, text);
    } catch (execError) {
      console.error("All text insertion methods failed:", execError);
    }
  }
}

// Find the Gmail compose toolbar
function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content && content.innerText.trim()) {
      console.log("Email content found:", content.innerText);
      return content.innerText.trim();
    }
  }

  console.log("No email content found");
  return "";
}

// Create the AI Reply button
function createAIButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 mt-send";
  button.style.marginRight = "8px";
  button.style.backgroundColor = "#000";
  button.style.color = "#fff";
  button.style.borderRadius = "24px";
  button.style.fontWeight = "500";
  button.style.fontSize = "13px";
  button.style.padding = "0 16px";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Response");
  return button;
}

function injectButton() {
  const existingButton = document.querySelector(".email-assistant-button");
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Compose toolbar not found.");
    return;
  }

  console.log("Compose toolbar found!");
  const button = createAIButton();
  button.classList.add("email-assistant-button");
  button.addEventListener("click", async () => {
    try {
      console.log("AI Reply button clicked");
      button.innerHTML = "Generating...";
      button.disabled = true;
      
      const emailcontent = getEmailContent();
      console.log("Email content to send:", emailcontent);
      
      console.log("Sending message to background script");
      
      // Use Chrome messaging instead of direct fetch
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: 'generateEmail',
          emailContent: emailcontent,
          tone: 'professional'
        }, resolve);
      });
      
      console.log("Background response:", response);
      
      if (!response.success) {
        throw new Error(response.error || 'Unknown error from background script');
      }

      const generatedReply = response.reply;
      console.log("Generated reply received:", generatedReply);

      // Try multiple selectors for the compose box
      const composeSelectors = [
        '[role="textbox"][g_editable="true"]',
        '.editable[role="textbox"]',
        ".Am.Al.editable",
        '[contenteditable="true"][role="textbox"]',
        ".gmail_default",
      ];

      let composeBox = null;
      for (const selector of composeSelectors) {
        composeBox = document.querySelector(selector);
        if (composeBox) break;
      }

      if (composeBox) {
        composeBox.focus();

        // Direct text insertion - much more reliable
        insertTextModern(composeBox, generatedReply);

        console.log("Generated reply inserted:", generatedReply);
      } else {
        console.error("Compose box not found");
        alert(
          "Could not find the compose box. Please try clicking in the email body first."
        );
      }

      // Reset button state
      button.innerHTML = "AI Reply";
      button.disabled = false;
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      button.innerHTML = "AI Reply";
      button.disabled = false;
      
      // More specific error message
      let errorMsg = "Failed to generate AI response. ";
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMsg += "Network error - check if server is running on localhost:8080";
      } else if (error.message.includes("CORS")) {
        errorMsg += "CORS error - server configuration issue";
      } else {
        errorMsg += `Error: ${error.message}`;
      }
      
      alert(errorMsg);
    }
  });
  toolbar.insertBefore(button, toolbar.firstChild);
}

// Observe DOM changes to detect new compose windows
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );
    if (hasComposeElements) {
      console.log("Compose elements found!");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
