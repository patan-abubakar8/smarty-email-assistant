# Smarty - AI Email Assistant

Smarty is an AI-powered Chrome extension that helps you manage your emails with ease. It automatically generates professional email responses directly within Gmail, saving you time and ensuring consistent communication.

## 🚀 Features

- **AI-Powered Email Generation**: Automatically generates contextual email replies based on the original email content
- **Gmail Integration**: Seamlessly integrates with Gmail's compose interface
- **Professional Tone**: Generates responses with a professional tone suitable for business communication
- **One-Click Generation**: Simple "AI Reply" button in Gmail's toolbar for instant response generation
- **Real-time Processing**: Fast response generation with visual feedback
- **Cross-Origin Security**: Secure communication between extension and backend API

## 🏗️ Architecture

The project consists of two main components:

### Chrome Extension (Frontend)
- **Content Script**: Injects AI Reply button into Gmail interface
- **Background Service Worker**: Handles API communication with backend
- **Manifest V3**: Uses latest Chrome extension standards

### Spring Boot Backend (API)
- **REST API**: Processes email content and generates responses
- **CORS Configuration**: Properly configured for Chrome extension communication
- **Professional Email Generation**: AI service for creating contextual replies

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Java 17+** installed
- **Maven 3.6+** for building the backend
- **Google Chrome** browser
- **Git** for version control

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/patan-abubakar8/smarty-email-assistant.git
cd smarty-email-assistant
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Build and run the Spring Boot application
```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or if you have Maven installed globally
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

#### Verify backend is running
```bash
curl -X POST http://localhost:8080/api/email/generate \
  -H "Content-Type: application/json" \
  -d '{"emailContent":"Test email","tone":"professional"}'
```

### 3. Chrome Extension Setup

#### Load the extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `EmailAssistant-ext` folder from the project directory
6. The extension should now appear in your extensions list

#### Verify extension installation
- Look for "Smarty - Email Assistant" in your Chrome extensions
- The extension icon should appear in your Chrome toolbar

## 🎯 Usage

### Using the AI Reply Feature

1. **Open Gmail** in your Chrome browser
2. **Open or reply to an email** to access the compose window
3. **Look for the "AI Reply" button** in the Gmail toolbar (black button with white text)
4. **Click "AI Reply"** to generate a response
5. **Wait for generation** (button will show "Generating...")
6. **Review the generated response** that appears in the compose box
7. **Edit if needed** and send your email

### Supported Email Scenarios

- Reply to business inquiries
- Acknowledge receipt of information
- Professional follow-ups
- Status update requests
- General business correspondence

## 🔧 Configuration

### Backend Configuration

The backend can be configured through `application.properties`:

```properties
# Server port (default: 8080)
server.port=8080

# CORS configuration is handled programmatically
# See AssistanceApplication.java for CORS settings
```

### Extension Configuration

The extension configuration is in `manifest.json`:

```json
{
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["http://localhost:8080/*", "*://mail.google.com/*"]
}
```

## 🐛 Troubleshooting

### Common Issues

#### "Failed to generate AI response" Error
- **Check if backend is running**: Ensure the Spring Boot server is running on port 8080
- **Verify CORS configuration**: The backend should allow requests from Gmail
- **Check browser console**: Press F12 in Gmail and look for detailed error messages

#### Extension not appearing in Gmail
- **Reload the extension**: Go to `chrome://extensions/` and click reload
- **Check permissions**: Ensure the extension has access to Gmail
- **Verify manifest**: Make sure `manifest.json` is properly configured

#### API Connection Issues
- **Port conflicts**: Ensure port 8080 is not used by other applications
- **Firewall settings**: Check if localhost connections are blocked
- **Network restrictions**: Some corporate networks may block localhost requests

### Debug Mode

Enable detailed logging by:

1. **Backend**: Check console output for API request logs
2. **Extension**: Open browser DevTools (F12) in Gmail to see console logs

## 🚀 Development

### Project Structure

```
smarty-email-assistant/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/               # Java source code
│   │   └── com/sonu/email/assistance/
│   │       ├── AssistanceApplication.java
│   │       ├── EmailGeneratorController.java
│   │       ├── EmailGeneratorService.java
│   │       └── EmailRequest.java
│   ├── src/main/resources/          # Application resources
│   └── pom.xml                      # Maven configuration
├── EmailAssistant-ext/              # Chrome extension
│   ├── manifest.json                # Extension manifest
│   ├── content.js                   # Content script for Gmail
│   ├── background.js                # Background service worker
│   ├── content.css                  # Styling for extension UI
│   └── icons/                       # Extension icons
└── README.md                        # This file
```

### Adding New Features

1. **Backend changes**: Modify the Spring Boot application in the `backend/` directory
2. **Extension changes**: Update files in `EmailAssistant-ext/` directory
3. **Testing**: Always test both components together after changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Spring Boot for robust backend API
- Uses Chrome Extension Manifest V3 for modern browser integration
- Designed for seamless Gmail integration

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Review browser console logs for detailed error information

---

**Made with ❤️ for better email productivity**