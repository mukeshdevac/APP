# 🤖 AI Assistant - Intelligent Code Generation & Maintenance

The AI Assistant is a central pillar of the TEN ROBOTICS platform, bridging the gap between hardware configuration and functional code. It leverages intelligent context-awareness to generate deployment-ready MicroPython scripts based on your specific kit setup.

## 🚀 Key Workflows

### 1. Intelligent Generation
The AI Assistant automatically analyzes your current **Hardware Configuration** (e.g., active sensors, OLED displays, NeoPixels) and suggests matching code. It understands component pin-mapping and common control patterns.

### 2. Quick Access
- **Main Header**: Access the AI Developer hub directly from the top navigation.
- **IDE Toolbar**: A dedicated "AI Assistant" button is available within the coding environment for seamless assistance.

### 3. Managed Safety Mode (Edit Mode)
To protect your code and ensure successful deployment, the assistant features a strict **Edit Mode**:
- **Protected State (OFF)**: Code is read-only and non-clickable. This prevents accidental deletions or syntax errors während browsing the output.
- **Interactive State (ON)**: Click `<> Edit Code` to unlock the editor. High-performance `textarea` allows manual fine-tuning.

### 4. Real-time Verification
When Edit Mode is ON, the assistant performs **Heuristic Python Syntax Validation**:
- Detects missing colons, mismatched brackets, and basic indentation errors.
- Displays friendly warning messages if logic issues are found.
- **Circuit Breaker**: The "Upload to ESP32" button is disabled if syntax errors are present, preventing bricking or crash-loops on your hardware.

### 5. Seamless Deployment
Once your code is verified, a single click on **Upload to ESP32** flashes your code directly to the hardware via Web Serial or Bluetooth.

---

## 🔑 Intelligent Model Configuration (Gemini AI)

To unlock the full potential of the AI Assistant, you should configure the **Google Gemini API Key**:

1.  **Get a Free Key**: Visit the [Google AI Studio](https://aistudio.google.com/app/apikey) and click "Create API key".
2.  **Configure the App**:
    - Open `src/features/ai-agent/services/aiService.js`.
    - Find the `GEMINI_API_KEY` constant at the top of the file.
    - Paste your key: `const GEMINI_API_KEY = 'your_key_here';`

> [!IMPORTANT]
> **Gemini-Exclusive Mode**
> The assistant now strictly uses the **Google Gemini API**. Local template fallbacks have been removed to ensure the highest quality of code generation. A valid API key is required.

---

## 🛠️ Technical Implementation
- **Feature Location**: `src/features/ai-agent/`
- **Primary Component**: `AIAgent.jsx`
- **Logic Service**: `aiService.js` (Asynchronous Fetch)
- **State Management**: Local `isDevMode` for strict interactivity control.
- **Feedback Loop**: Integrated `syntaxError` state linked to the `handleUpload` lockout.

---
*Powered by Antigravity AI*
