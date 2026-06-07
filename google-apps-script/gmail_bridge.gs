/**
 * Alisa Assistant - Gmail Webhook Bridge Script
 * 
 * Instructions to set up:
 * 1. Go to https://script.google.com/
 * 2. Create a new project named "Alisa Gmail Bridge".
 * 3. Delete any code in the editor, paste this script below, and update the BACKEND_URL and BRIDGE_SECRET.
 * 4. Click "Deploy" (top right) -> "New Deployment" -> Select type: "Web App".
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Deploy and authorize permissions for Gmail.
 * 6. Set up a Trigger (clock icon on the left sidebar):
 *    - Add Trigger -> Choose function to run: "syncUnreadEmails"
 *    - Select event source: "Time-driven"
 *    - Select type of time based trigger: "Minutes timer" -> "Every minute" (or "Every 5 minutes")
 */

// Replace this with your actual Railway deployed backend URL (e.g., https://your-app.up.railway.app)
const BACKEND_URL = "https://automation-f864.onrender.com";

// Replace this with the GMAIL_BRIDGE_SECRET set in your Railway environment variables
const BRIDGE_SECRET = "verify_alisa";

function syncUnreadEmails() {
  Logger.log("Starting Gmail Sync...");
  
  // Search for the 10 most recent unread messages in the inbox
  const threads = GmailApp.search("label:inbox is:unread", 0, 10);
  const emailsToSend = [];
  
  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();
    const lastMessage = messages[messages.length - 1]; // Get the latest message in the thread
    
    // Format message date/time
    const date = lastMessage.getDate();
    const formattedTime = Utilities.formatDate(date, Session.getScriptTimeZone(), "hh:mm a");
    
    emailsToSend.push({
      id: lastMessage.getId(),
      sender: lastMessage.getFrom(),
      subject: lastMessage.getSubject(),
      body: lastMessage.getPlainBody(),
      time: formattedTime
    });
  }
  
  Logger.log("Unread emails scanned: " + emailsToSend.length);
  
  // If no unread emails, we can still post an empty array to sync clean state, or skip.
  // We post to keep the dashboard state synchronized.
  const payload = {
    emails: emailsToSend
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + BRIDGE_SECRET
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(BACKEND_URL + "/api/gmail/bridge", options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log("API response status code: " + responseCode);
    Logger.log("API response body: " + responseText);
    
    if (responseCode === 200) {
      Logger.log("Sync completed successfully!");
    } else {
      Logger.log("Failed to sync. Server returned error.");
    }
  } catch (e) {
    Logger.log("Error sending fetch request to backend: " + e.toString());
  }
}
