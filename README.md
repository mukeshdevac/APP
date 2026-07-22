# 🚀 STEM Kit - Advanced Web IDE & Store

An immersive, high-performance web platform for programming STEM Kits (ESP32) using MicroPython and Blockly.

## ✨ Features

- **Premium 3D UI**: Immersive view transitions with depth-aware perspective transforms.
- **Glassmorphism 2.0**: Specialized design system with refined blur, inner glows, and dynamic tilt effects.
- **Advanced IDE**:
  - **OLED Displays**: Dedicated blocks for SSD1306 screens.
  - **Sensors**: Ultrasonic distance and Analog sensor support.
  - **Actuators**: RGB LED (NeoPixel) color selection and Motor controls.
- **Cross-Platform Connectivity**: Support for Web Bluetooth (BLE UART), Web Serial (USB), and WiFi (WebREPL).
- **Intelligent AI Assistant**: 
  - Automated MicroPython code generation based on hardware state.
  - Integrated "Edit Mode" with strict read-only safety.
  - Heuristic syntax validation for hardware-safe deployment.
  - *Read more: [AI Assistant Documentation](src/features/ai-agent/README.md)*

---

## 🛠️ Bluetooth Technical Resolution (Post-Mortem)

### The Issue
A persistent `GATT Server is disconnected` error was encountered during the service discovery phase on Windows/Chrome. The GATT link would establish successfully but drop immediately upon calling `getPrimaryService`.

### Root Cause Analysis (`The Why`)
Windows Bluetooth drivers and the Chrome Bluetooth stack often exhibit timing-sensitive behavior. If the GATT database isn't fully cached by the OS before the web application attempts to query specific services, the stack resets the connection to prevent a hung state. Stale GATT sessions held by the OS also prevent new connections from authorizing service discovery.

### Rectification Strategy (`The How`)
We implemented a **"Bulletproof GATT Sequence"** in `ConnectionManager.js`:

1.  **Pre-connect Cooldown**: A 500ms delay before `device.gatt.connect()` to allow the OS Bluetooth stack to settle after device selection.
2.  **Stability Probe (Cache Warm-up)**: Instead of querying the specific UART service immediately, we call `getPrimaryServices()` (plural). This forces the OS to enumerate the entire GATT database, "warming up" the link and caching the structure.
3.  **Encapsulated Retry Loop**: The entire connection and discovery sequence is wrapped in an atomic retry loop (3 attempts).
4.  **Stack Reset**: On failure, the GATT stack is explicitly reset via `disconnect()` before the next retry, ensuring no stale handles interfere with the fresh attempt.
5.  **Conservative Link Intervals**: Increased stabilization delays to 2500ms to accommodate slower Bluetooth controllers.

### Future Considerations
- **Automated Pairing Recovery**: Detect patterns of "immediate disconnect" and prompt the user to unpair the device in Windows settings.
- **Web Serial Preference**: Recommending Web Serial (USB) as the primary stable link for high-throughput code uploads.
- **GATT Heartbeat**: Implement a background ping to keep the link active and detect "floating" disconnections early.

---

## 🚀 Getting Started

1.  Install dependencies: `npm install`
2.  Start development server: `npm run dev`
3.  Open the app and choose **Bluetooth** or **Serial** in the header.
4.  If using Bluetooth on Windows, ensure you unpair **TENROBOTICS** in system settings if you encounter connection issues.

---

## 🏗️ Tech Stack
- **Frontend**: React (Functional + Hooks), Framer Motion (3D & Animations).
- **IDE**: Blockly, Custom Python Generator.
- **Icons**: Lucide React.
- **Styles**: Vanilla CSS (Modern Design System).

---
*Developed by Antigravity AI*
