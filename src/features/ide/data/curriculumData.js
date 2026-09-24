// ==============================================================================
// TEN ROBOTICS - INTERACTIVE CURRICULUM & GUIDED LEARNING COMPANION
// Comprehensive linear progression from Basic to Master level with real-world applications,
// step-by-step tutorials, interactive challenges, and original Blockly XML.
// ==============================================================================

export const CURRICULUM_MODULES = [
    {
        "id": "00_serial",
        "exampleId": "00",
        "title": "Serial Communication & Telemetry",
        "tier": "Beginner",
        "category": "Basics",
        "icon": "Terminal",
        "color": "#0284C7",
        "bg": "#E0F2FE",
        "summary": "Transmit structured ASCII data, stream live sensor telemetry, and inspect runtime variables via UART at 115,200 baud.",
        "overview": {
            "what": "Serial Communication (UART) is the digital conversation between your microcontroller and computer! Think of it like a phone call: the microcontroller talks over the TX (Transmit) wire, and the computer listens over the RX (Receive) wire. They talk by sending digital bits one after another in a 'serial' single-file line.",
            "howItWorks": "Every word or number is sliced into 8 binary bits (0s and 1s). The hardware circuit is called a UART (Universal Asynchronous Receiver-Transmitter). It sends these bits at a synchronized tempo called Baud Rate (115,200 bits per second). On your Ten Robotics board, an onboard USB chip translates these electrical pulses so they print right on your computer's Serial Monitor screen!",
            "realWorld": "NASA Mars rovers (Perseverance & Curiosity) stream their scientific telemetry back to Earth through serial radios! Formula 1 race cars broadcast real-time engine telemetry to pit crew laptops. Even medical heart-rate monitors stream patient heartbeats through serial ports."
        },
        "pinout": [
            {
                "label": "UART0 TX",
                "pin": "GP1",
                "desc": "Microcontroller Transmit pin (connected to onboard USB Serial bridge)"
            },
            {
                "label": "UART0 RX",
                "pin": "GP3",
                "desc": "Microcontroller Receive pin (receives commands from your computer)"
            },
            {
                "label": "UART2 AUX",
                "pin": "GP16/GP17",
                "desc": "Auxiliary hardware UART port for external GPS or Bluetooth modules"
            }
        ],
        "terminology": [
            {
                "term": "UART",
                "def": "Universal Asynchronous Receiver-Transmitter: the dedicated microchip hardware that translates computer letters and numbers into electrical bit streams."
            },
            {
                "term": "TX (Transmit - Talking)",
                "def": "The digital output pin that sends serial binary data out into the wire (like a speaker talking into a microphone)."
            },
            {
                "term": "RX (Receive - Listening)",
                "def": "The digital input pin that catches incoming serial data pulses from another device (like an ear listening)."
            },
            {
                "term": "Baud Rate (115200 bits/sec)",
                "def": "The agreed communication tempo. Both sender and receiver must match 115200; if they don't match, the letters scramble into unreadable gibberish characters (??##)."
            },
            {
                "term": "Telemetry",
                "def": "Automated transmission of live measurements (voltages, temperatures, speeds) from a robot or satellite to an engineer's display."
            }
        ],
        "steps": [
            "1. Start your sketch with the '🚀 CODE SKETCH' header block.",
            "2. Add the 'Serial Print' block with the text 'Hello World!'.",
            "3. Click RUN and look at the bottom Serial Monitor window — you will see 'Hello World!' print out!",
            "4. Rename 'Hello World!' to your own name (e.g. 'Hello, Rahul!') and run again.",
            "5. Add a 'Wait 2 Seconds' delay block to create rhythmic pauses between messages.",
            "6. Wrap inside a 'Repeat 5 Times' loop to automate repetitive printing without duplicating blocks.",
            "7. Change the loop count from 5 to 6 to see 6 pulses print out.",
            "8. Use a 'For [packet_id] from 1 to 5' loop with 'Serial Print Label: Value' to stream numbered telemetry."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Your First Block: Hello World!",
                "desc": "The absolute #1 first step in all of computer science! Send a single text block to the robot's brain and see it print on the Serial Monitor.",
                "challenge": "Click 'Load Level 1 Blocks into Workspace'. Hit RUN and look at the Serial Monitor at the bottom. You will see 'Hello World!' printed! Now, click on the text 'Hello World!' inside the block, delete it, and type your own name (e.g. 'Hello, Robo-Maker!'). Hit RUN again to see your name on the console!",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Hello World!</field></shadow></value></block></next></block></xml>",
                "whatYouLearn": "Your very first block: How to send text from the microcontroller to your computer screen without any complex syntax.",
                "newBlock": "Serial Print [text]",
                "blockXml": "<block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Hello World!</field></shadow></value></block>"
            },
            {
                "level": 2,
                "name": "Adding Time Delays (Rhythm & Pacing)",
                "desc": "Computers think in microseconds (millions of operations per second). Without a delay block, multiple messages would print faster than your eyes can see!",
                "challenge": "Load Level 2 and click RUN. Notice the 2-second pause between Message 1 and Message 2. Now change the number '2' in the Wait block to '3' seconds, hit RUN, and watch the longer rhythm!",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Step 1: System Booting...</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Step 2: System Online & Ready!</field></shadow></value></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Time delays and pacing: Understanding why microcontrollers need delay blocks so humans can read output.",
                "newBlock": "Wait [seconds]",
                "blockXml": "<block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block>"
            },
            {
                "level": 3,
                "name": "Automation Loops (Repeat 5 Times -> Change to 6)",
                "desc": "Why copy-paste the same block 5 times when a loop can automate it for you? A repeat loop runs the blocks inside it for an exact count.",
                "challenge": "Run this code and count the 5 pulse messages in your Serial Monitor. Then, click on the number '5' block, change it to '6', and run again to see 6 pulses!",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_repeat_ext\"><value name=\"TIMES\"><shadow type=\"math_number\"><field name=\"NUM\">5</field></shadow></value><statement name=\"DO\"><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Ten Robotics Pulse OK</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.5</field></shadow></value></block></next></block></statement><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">All 5 Pulses Completed!</field></shadow></value></block></next></block></next></block></xml>",
                "whatYouLearn": "Loop automation: Repeating actions for an exact count without copy-pasting blocks.",
                "newBlock": "Repeat [times] Times",
                "blockXml": "<block type=\"controls_repeat_ext\"><value name=\"TIMES\"><shadow type=\"math_number\"><field name=\"NUM\">5</field></shadow></value></block>"
            },
            {
                "level": 4,
                "name": "Telemetry Inspection with Variables",
                "desc": "Instead of just repeating text, let the computer count internally using a variable (packet_id from 1 to 5) and tag it with a label.",
                "challenge": "Watch the packet counter increment from 1 up to 5 on the monitor. Try changing the TO value from 5 to 10 to stream 10 packets!",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_for\"><field name=\"VAR\">packet_id</field><value name=\"FROM\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\"><field name=\"NUM\">5</field></shadow></value><value name=\"BY\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><statement name=\"DO\"><block type=\"esp32_serial_print_var\"><field name=\"LABEL\">Telemetry Packet #</field><value name=\"VAL\"><block type=\"variables_get\"><field name=\"VAR\">packet_id</field></block></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value></block></next></block></statement><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Telemetry Stream Finished.</field></shadow></value></block></next></block></next></block></xml>",
                "whatYouLearn": "Variables & Telemetry: Using variables to count in computer memory and streaming labelled telemetry.",
                "newBlock": "For [variable] ... & Serial Print Label: Value",
                "blockXml": "<block type=\"controls_for\"><field name=\"VAR\">packet_id</field><value name=\"FROM\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\"><field name=\"NUM\">5</field></shadow></value><value name=\"BY\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value></block>"
            },
            {
                "level": 5,
                "name": "Continuous 24/7 While Loop & Safety Guard",
                "desc": "Real robots, satellites, and Mars rovers run 24/7 in an infinite While loop, continuously evaluating safety conditions.",
                "challenge": "Run this code. Notice how it streams live battery status every 1 second continuously without ever stopping! Click the red STOP button in the IDE to halt execution.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_get_battery\"></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">20</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">>>> [CRITICAL] Battery Low! Motors Halted.</field></shadow></value></block></statement><statement name=\"ELSE\"><block type=\"esp32_serial_print_var\"><field name=\"LABEL\">System Health OK (Battery %)</field><value name=\"VAL\"><block type=\"esp32_get_battery\"></block></value></block></statement><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Continuous 24/7 While Loops & Safety Watchdogs: Keeping a robot alive forever and evaluating safety conditions.",
                "newBlock": "While [True] & If [Condition] Else",
                "blockXml": "<block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value></block>"
            }
        ]
    },
    {
        "id": "01_digital_output",
        "exampleId": "01",
        "title": "Digital Output & LED Control",
        "tier": "Beginner",
        "category": "Basics",
        "icon": "Lightbulb",
        "color": "#F59E0B",
        "bg": "#FEF3C7",
        "summary": "Master binary digital logic, GPIO voltage states (HIGH/LOW), and rhythmic pulse timing.",
        "overview": {
            "what": "Digital Output is the electronic power switch of robotics!\n\n💡 What is an LED?\nLED stands for Light Emitting Diode.\n\n⚡ What is a Diode?\nA diode is a specialized one-way semiconductor valve for electricity. Just like a bicycle tire valve only lets air flow in one direction, a diode only lets electric current flow in one direction (from positive Anode + to negative Cathode -). When electrons cross inside the diode crystal, energy is released as bright visible photons (light)!",
            "howItWorks": "Microcontrollers have tiny metal legs called GPIO (General Purpose Input / Output) pins.\n\nInside the chip, electronic switches (transistors) connect Pin 4 either to 3.3 Volts power (HIGH / 1) or to 0 Volts ground (LOW / 0).\n\nWhen set to HIGH, electric current rushes through the LED diode, lighting it up. When set to LOW, power is shut off.",
            "realWorld": "Automobile turn signals, traffic intersection lights, camera strobe flashlights, aerospace runway beacons, and heart pacemakers all rely on digital GPIO output pulses."
        },
        "pinout": [
            {
                "label": "OUT1",
                "pin": "GP4",
                "desc": "High-current driver output (ideal for external LEDs, pumps, solenoids)"
            },
            {
                "label": "OUT2",
                "pin": "GP5",
                "desc": "Secondary high-current digital output"
            },
            {
                "label": "SYS_LED",
                "pin": "GP2",
                "desc": "On-board blue system status LED (no external wiring required)"
            }
        ],
        "terminology": [
            {
                "term": "LED (Light Emitting Diode)",
                "def": "An electronic component that acts like a one-way valve for electricity and emits bright light when electric current flows through it."
            },
            {
                "term": "Diode",
                "def": "A semiconductor device with two terminals (Anode + and Cathode -) that strictly allows electric current to flow in only one direction."
            },
            {
                "term": "GPIO Pin",
                "def": "General Purpose Input/Output: metal legs on the chip that can be programmed to pump electricity out (Output) or sense voltage coming in (Input)."
            },
            {
                "term": "Logic HIGH (1 = 3.3V)",
                "def": "Output voltage is turned ON to full 3.3 Volts, powering connected circuits."
            },
            {
                "term": "Logic LOW (0 = 0V)",
                "def": "Output voltage is turned OFF to Ground (0 Volts), cutting electrical power."
            }
        ],
        "steps": [
            "1. Start your sketch with the '🚀 CODE SKETCH' header block.",
            "2. Add the 'Digital Write Pin 4 HIGH (1)' block to turn the LED ON.",
            "3. Hit RUN and see Pin 4 light up! Then change HIGH (1) to LOW (0) to turn it off.",
            "4. Add a 'Wait 1 Seconds' delay block followed by a LOW (0) block to create your first timed flash.",
            "5. Wrap inside a 'Repeat 5 Times' loop to create an automated blinking rhythm.",
            "6. Change the repeat count from 5 to 6 or 7 to see more blinks.",
            "7. Alternate between Pin 4 and the onboard System LED (Pin 2) to build a police strobe!"
        ],
        "levels": [
            {
                "level": 1,
                "name": "The 1-Block Power Switch: Turn LED ON",
                "desc": "Turn on electrical power to Digital Pin 4. Learn how a GPIO pin commands voltage.",
                "challenge": "Load this 1 block into workspace. Click RUN! Look at Pin 4 on your board — the LED lights up! Now challenge: change the dropdown from HIGH (1) to LOW (0) and click RUN again to turn the LED OFF.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field></block></next></block></xml>",
                "whatYouLearn": "The 1-Block Power Switch: How a GPIO pin sends 3.3V power to illuminate an LED (Light Emitting Diode).",
                "newBlock": "Digital Write Pin [4] HIGH (1)",
                "blockXml": "<block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field></block>"
            },
            {
                "level": 2,
                "name": "Two-Step Timed Flash with Delay",
                "desc": "Turn LED ON, hold it for 1 second, then shut it OFF.",
                "challenge": "Click RUN! The LED turns on, stays lit for 1 second, then turns off. Now change 1 second to 2.5 seconds to make the light shine longer.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">0</field></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Timed Flashes: Turning an output ON, pausing with a delay, and shutting it OFF.",
                "newBlock": "Wait [seconds] Delay",
                "blockXml": "<block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value></block>"
            },
            {
                "level": 3,
                "name": "Automated Blink Loop (Repeat 5 -> Change to 6)",
                "desc": "Automate rhythmic blinking using a Repeat loop so you don't have to duplicate blocks.",
                "challenge": "Click RUN and count 5 blinks! Then click on the number '5' block, change it to '6', and run again to see 6 distinct blinks.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_repeat_ext\"><value name=\"TIMES\"><shadow type=\"math_number\"><field name=\"NUM\">5</field></shadow></value><statement name=\"DO\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.5</field></shadow></value><next><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">0</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.5</field></shadow></value></block></next></block></next></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Automated Blinking Rhythms: Using a loop to create regular strobe intervals.",
                "newBlock": "Repeat [5] Times Loop",
                "blockXml": "<block type=\"controls_repeat_ext\"><value name=\"TIMES\"><shadow type=\"math_number\"><field name=\"NUM\">5</field></shadow></value></block>"
            },
            {
                "level": 4,
                "name": "Dual Light Strobe (Pin 4 vs Blue System LED)",
                "desc": "Alternate between external LED Pin 4 and onboard blue Status LED Pin 2 like an emergency vehicle.",
                "challenge": "Try changing the wait delays from 0.3s to 0.1s to create a high-speed emergency beacon strobe!",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_repeat_ext\"><value name=\"TIMES\"><shadow type=\"math_number\"><field name=\"NUM\">6</field></shadow></value><statement name=\"DO\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">0</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.3</field></shadow></value><next><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">0</field><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">1</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.3</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">0</field></block></next></block></next></block></xml>",
                "whatYouLearn": "Dual Light Coordination: Alternating between external LED and onboard blue Status LED.",
                "newBlock": "Built-in System LED Pin 2",
                "blockXml": "<block type=\"esp32_led_builtin\"><field name=\"STATE\">1</field></block>"
            },
            {
                "level": 5,
                "name": "Continuous 24/7 Heartbeat Beacon",
                "desc": "Run an infinite While loop pulsing the LED like a lighthouse beacon forever until STOP is pressed.",
                "challenge": "Load Level 5 and click RUN. Observe how the beacon blinks continuously! Click STOP in the top IDE header to safely halt.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.2</field></shadow></value><next><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">0</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.8</field></shadow></value></block></next></block></next></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Continuous Heartbeat Beacon: Running an infinite loop like a lighthouse signal forever.",
                "newBlock": "While [True] Loop",
                "blockXml": "<block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value></block>"
            }
        ]
    },
    {
        "id": "02_pwm_dimmer",
        "exampleId": "02",
        "title": "PWM Breathing & Dimming",
        "tier": "Beginner",
        "category": "Basics",
        "icon": "Activity",
        "color": "#06B6D4",
        "bg": "#CFFAFE",
        "summary": "Control simulated analog power using high-speed Pulse Width Modulation (0–1023 duty cycle).",
        "overview": {
            "what": "Digital microcontrollers can normally only output full 3.3V or 0V. To create intermediate brightness levels (like a lamp dimmer) or adjust motor speeds smoothly, we use Pulse Width Modulation (PWM).",
            "howItWorks": "PWM rapidly turns the output ON and OFF thousands of times per second (e.g. 1000 Hz). The proportion of time the signal is ON during each cycle is called the Duty Cycle (0 = 0% brightness, 512 = 50% brightness, 1023 = 100% full brightness). Human eyes perceive the average light output as a smooth glow.",
            "realWorld": "Used in electric vehicle throttle pedals, screen backlighting on smartphones, variable speed CPU cooling fans, and studio LED lighting panels."
        },
        "pinout": [
            {
                "label": "S1",
                "pin": "GP18",
                "desc": "PWM-capable output (shared with Servo 1 header)"
            },
            {
                "label": "S2",
                "pin": "GP19",
                "desc": "PWM-capable output (shared with Servo 2 header)"
            },
            {
                "label": "BUZZER",
                "pin": "GP33",
                "desc": "PWM audio transducer for melodic pitch synthesis"
            }
        ],
        "terminology": [
            {
                "term": "PWM",
                "def": "Pulse Width Modulation: Rapidly pulsing digital power to simulate analog voltage levels."
            },
            {
                "term": "Duty Cycle (0-1023)",
                "def": "10-bit resolution representing the active ON fraction of the wave (0=OFF, 1023=Full Power)."
            },
            {
                "term": "Frequency (Hz)",
                "def": "The number of complete ON/OFF cycles executed per second (typically 1000 Hz for lighting)."
            }
        ],
        "steps": [
            "1. Enter an infinite 'While [True]' loop to keep the breathing animation cycling smoothly.",
            "2. Use a 'For [duty] from 0 to 1020 by 60' loop to ramp up brightness gradually in small increments.",
            "3. Inside the loop, apply 'PWM Write Pin 18 Duty' with the current loop variable.",
            "4. Pause for 25 milliseconds after each step to allow the eye to perceive the fading transition.",
            "5. Follow immediately with a descending 'For [duty] from 1020 down to 0 by -60' loop to fade out gently.",
            "6. Pause for 200 milliseconds at the bottom of the breath before the next cycle starts."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Breathing LED Glow",
                "desc": "Smoothly cycle brightness from darkness (0) to maximum (1020) and back.",
                "challenge": "Increase the step delay from 25ms to 50ms to create a relaxed, slow meditation breath.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Starting PWM Breathing...</field></shadow></value><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_for\"><field name=\"VAR\">duty</field><value name=\"FROM\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\"><field name=\"NUM\">1020</field></shadow></value><value name=\"BY\"><shadow type=\"math_number\"><field name=\"NUM\">60</field></shadow></value><statement name=\"DO\"><block type=\"esp32_pwm_write\"><field name=\"PIN\">18</field><value name=\"DUTY\"><block type=\"variables_get\"><field name=\"VAR\">duty</field></block></value><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">25</field></shadow></value></block></next></block></statement><next><block type=\"controls_for\"><field name=\"VAR\">duty</field><value name=\"FROM\"><shadow type=\"math_number\"><field name=\"NUM\">1020</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"BY\"><shadow type=\"math_number\"><field name=\"NUM\">-60</field></shadow></value><statement name=\"DO\"><block type=\"esp32_pwm_write\"><field name=\"PIN\">18</field><value name=\"DUTY\"><block type=\"variables_get\"><field name=\"VAR\">duty</field></block></value><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">25</field></shadow></value></block></next></block></statement><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">200</field></shadow></value></block></next></block></next></block></statement></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Breathing LED Glow: Understanding hardware execution and parameter changes.",
                "newBlock": "Basics Block"
            }
        ]
    },
    {
        "id": "03_button_toggle",
        "exampleId": "03",
        "title": "Digital Input & Button Debounce",
        "tier": "Beginner",
        "category": "Basics",
        "icon": "Target",
        "color": "#10B981",
        "bg": "#D1FAE5",
        "summary": "Read contact closure inputs, suppress mechanical bounce spikes, and toggle latching outputs.",
        "overview": {
            "what": "Digital Input allows the microcontroller to sense the physical world — whether a button was pressed, a limit switch clicked, or an emergency stop plunger tripped.",
            "howItWorks": "Push buttons contain mechanical metal springs. When pressed, the metal contacts literally bounce against each other dozens of times over 5-20 milliseconds. Without 'debouncing' (ignoring rapid transitions with a brief delay), a single button tap would register as 20 distinct button clicks!",
            "realWorld": "Used in elevator floor request buttons, keyboard keypress scanning, car door latch sensors, and industrial machine emergency stops."
        },
        "pinout": [
            {
                "label": "BTN / IN1",
                "pin": "GP16",
                "desc": "Digital input pin with internal pull-up resistor"
            },
            {
                "label": "OUT1",
                "pin": "GP4",
                "desc": "Digital output switched by the button"
            }
        ],
        "terminology": [
            {
                "term": "Debouncing",
                "def": "Software filtering technique to ignore false rapid contact bounces when a mechanical switch closes."
            },
            {
                "term": "Active-LOW",
                "def": "Circuit configuration where pressing the button pulls the signal down to 0V (GND)."
            },
            {
                "term": "Latching",
                "def": "Toggling a state (like a light switch) that stays ON even after releasing your finger."
            }
        ],
        "steps": [
            "1. Enter a continuous 'While [True]' scanning loop.",
            "2. Read Pin 16 with 'Digital Read Pin 16'.",
            "3. If reading is 0 (LOW, button pressed): execute toggle action.",
            "4. Flip the state of Pin 4 using 'Toggle Pin 4'.",
            "5. Turn on the builtin LED to acknowledge the physical contact.",
            "6. Add a 300ms debounce wait to avoid re-triggering while your finger is pressing the button.",
            "7. Loop continues checking every 50 milliseconds."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Debounced Push-to-Toggle",
                "desc": "Press the button once to turn the light ON; press again to turn it OFF.",
                "challenge": "Add a buzzer beep on Pin 33 for 50ms every time the button is pressed for acoustic feedback.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Button Toggle Ready</field></shadow></value><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"esp32_digital_read\"><field name=\"PIN\">16</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_digital_toggle\"><field name=\"PIN\">4</field><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">1</field><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Button Pressed: Pin 4 Toggled!</field></shadow></value><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">300</field></shadow></value></block></next></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"esp32_led_builtin\"><field name=\"STATE\">0</field></block></statement><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">50</field></shadow></value></block></next></block></statement></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Debounced Push-to-Toggle: Understanding hardware execution and parameter changes.",
                "newBlock": "Basics Block"
            }
        ]
    },
    {
        "id": "04_motor_ramping",
        "exampleId": "04",
        "title": "Motor Dynamics & Speed Ramping",
        "tier": "Intermediate",
        "category": "Motors",
        "icon": "Zap",
        "color": "#0284C7",
        "bg": "#E0F2FE",
        "summary": "Accelerate DC motors progressively through H-bridge power drivers to prevent gear wear and current surges.",
        "overview": {
            "what": "DC motors convert electrical energy into rotational kinetic force. Suddenly commanding 100% full speed from a dead stop causes severe current spikes (inrush current) and mechanical shock that can strip plastic gears.",
            "howItWorks": "By using a software 'For loop' to step motor power from 20% to 100% in 20% increments every 300ms, acceleration is gentle and controlled. The Ten Robotics H-Bridge MOSFET driver precisely handles the high motor currents.",
            "realWorld": "Used in electric vehicle traction control (Tesla/Rivian launch mode), automated warehouse conveyor belts, high-speed train acceleration profiles, and elevator car winches."
        },
        "pinout": [
            {
                "label": "M1A / M1B",
                "pin": "Motor 1 Port",
                "desc": "H-Bridge bidirectional motor channel 1 (up to 1.5A)"
            },
            {
                "label": "M2A / M2B",
                "pin": "Motor 2 Port",
                "desc": "H-Bridge bidirectional motor channel 2"
            }
        ],
        "terminology": [
            {
                "term": "Inrush Current",
                "def": "The massive initial electrical surge drawn by a stationary motor when voltage is first applied."
            },
            {
                "term": "H-Bridge",
                "def": "A 4-transistor circuit topology allowing current to flow forward or backward through a motor coil."
            },
            {
                "term": "Ramping",
                "def": "Smooth mathematical acceleration curve that protects gears and motor windings."
            }
        ],
        "steps": [
            "1. Announce acceleration profile on the Serial Monitor.",
            "2. Set up a 'For [speed] from 20 to 100 by 20' ramping loop.",
            "3. Command Motor 1 FORWARD at the calculated speed percentage.",
            "4. Log the real-time speed value to the Serial Monitor.",
            "5. Pause 300ms at each speed plateau for smooth mechanical transfer.",
            "6. Cruise at maximum speed for 1 second.",
            "7. Trigger 'Stop All Motors' to engage electrical braking and cut power safely."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Progressive Motor Acceleration",
                "desc": "Ramp motor speed from 20% up to 100% and execute safe braking.",
                "challenge": "Add a deceleration ramp right after full speed that ramps speed back down from 100% to 20% before stopping.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Accelerating Motor...</field></shadow></value><next><block type=\"controls_for\"><field name=\"VAR\">speed</field><value name=\"FROM\"><shadow type=\"math_number\"><field name=\"NUM\">20</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\"><field name=\"NUM\">100</field></shadow></value><value name=\"BY\"><shadow type=\"math_number\"><field name=\"NUM\">20</field></shadow></value><statement name=\"DO\"><block type=\"esp32_motor\"><field name=\"MOTOR\">1</field><field name=\"DIR\">FWD</field><value name=\"SPEED\"><block type=\"variables_get\"><field name=\"VAR\">speed</field></block></value><next><block type=\"esp32_serial_print_var\"><field name=\"LABEL\">Speed</field><value name=\"VAL\"><block type=\"variables_get\"><field name=\"VAR\">speed</field></block></value><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">300</field></shadow></value></block></next></block></next></block></statement><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_stop_all_motors\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Motor Safely Stopped</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Progressive Motor Acceleration: Understanding hardware execution and parameter changes.",
                "newBlock": "Motors Block"
            }
        ]
    },
    {
        "id": "05_servos",
        "exampleId": "05",
        "title": "Positional Servos & Articulation",
        "tier": "Intermediate",
        "category": "Motors",
        "icon": "RotateCw",
        "color": "#0EA5E9",
        "bg": "#E0F2FE",
        "summary": "Command precise 0–180° angular joint positions with calibration and smooth trajectory sweeps.",
        "overview": {
            "what": "Positional RC Servos are closed-loop rotary actuators. Unlike continuous spinning motors, servos rotate to a specific commanded angle (0° to 180°) and hold that position rigidly against external load.",
            "howItWorks": "An internal potentiometer measures the output shaft's angle, and an internal PID control chip compares it to incoming 50Hz PWM pulses (1ms = 0°, 1.5ms = 90° center, 2ms = 180°). The motor runs until the target angle matches the shaft position.",
            "realWorld": "Used in airplane wing ailerons/rudders, robotic surgery arms, humanoid robot fingers, animatronics in theme parks, and pan-tilt security cameras."
        },
        "pinout": [
            {
                "label": "SERVO 1",
                "pin": "GP18",
                "desc": "Primary 3-pin standard servo header (GND, 5V, SIG)"
            },
            {
                "label": "SERVO 2",
                "pin": "GP19",
                "desc": "Secondary 3-pin standard servo header"
            }
        ],
        "terminology": [
            {
                "term": "Closed-Loop Control",
                "def": "A system that constantly measures its own output (via potentiometer) to correct errors."
            },
            {
                "term": "Holding Torque",
                "def": "The rotational force the servo exerts to maintain its commanded position when pushed."
            },
            {
                "term": "Sweep Rate",
                "def": "Controlling the speed between angles by stepping in small angular increments."
            }
        ],
        "steps": [
            "1. Center both Servo 1 and Servo 2 to 90 degrees for baseline neutral alignment.",
            "2. Announce calibration complete via the Serial Monitor.",
            "3. Wait 1 second for mechanical settling.",
            "4. Execute an automated sweep on Servo 1 from 0° to 180° in 5° steps with 20ms delay.",
            "5. Pause 500ms at the end of range.",
            "6. Sweep back smoothly from 180° to 90° to rest at center."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Dual Servo Neutral Sweep",
                "desc": "Calibrate both servos to neutral 90° and sweep through full angular range.",
                "challenge": "Synchronize Servo 2 to mirror Servo 1 in the opposite direction (180 to 0) simultaneously.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_servo_center\"><field name=\"PIN\">1</field><next><block type=\"esp32_servo_center\"><field name=\"PIN\">2</field><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Servos Calibrated to 90 deg</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_servo_sweep\"><field name=\"PIN\">1</field><field name=\"STEP\">5</field><field name=\"DELAY\">20</field><value name=\"START\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"END\"><shadow type=\"math_number\"><field name=\"NUM\">180</field></shadow></value><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">500</field></shadow></value><next><block type=\"esp32_servo_sweep\"><field name=\"PIN\">1</field><field name=\"STEP\">5</field><field name=\"DELAY\">20</field><value name=\"START\"><shadow type=\"math_number\"><field name=\"NUM\">180</field></shadow></value><value name=\"END\"><shadow type=\"math_number\"><field name=\"NUM\">90</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Dual Servo Neutral Sweep: Understanding hardware execution and parameter changes.",
                "newBlock": "Motors Block"
            }
        ]
    },
    {
        "id": "06_servo_360",
        "exampleId": "06",
        "title": "360° Continuous Rotation Servos",
        "tier": "Intermediate",
        "category": "Motors",
        "icon": "Compass",
        "color": "#0D9488",
        "bg": "#CCFBF1",
        "summary": "Operate continuous rotation servos for mobile rover drive-trains, bidirectional speed, and stops.",
        "overview": {
            "what": "Continuous rotation servos modify standard servos by disconnecting the internal mechanical stops and feedback potentiometer. Instead of holding an angle, they rotate continuously in either direction at adjustable speeds.",
            "howItWorks": "The 1.5ms neutral PWM pulse halts the servo. Pulses longer than 1.5ms cause clockwise rotation (CW); pulses shorter than 1.5ms cause counter-clockwise rotation (CCW). The distance from 1.5ms determines velocity.",
            "realWorld": "Used in educational wheeled rovers, automated robotic drawbridges, rolling shutter blinds, and camera motorized cable cams."
        },
        "pinout": [
            {
                "label": "SERVO 1",
                "pin": "GP18",
                "desc": "360 continuous rotation servo signal header"
            },
            {
                "label": "SERVO 2",
                "pin": "GP19",
                "desc": "Optional second continuous servo for 2-wheel drive"
            }
        ],
        "terminology": [
            {
                "term": "360° Continuous",
                "def": "A modified servo mechanism providing bidirectional variable rotational velocity without limits."
            },
            {
                "term": "Deadband",
                "def": "The narrow pulse-width window around 1.5ms where the continuous servo remains completely stopped."
            },
            {
                "term": "CW / CCW",
                "def": "Clockwise (CW) and Counter-Clockwise (CCW) rotational directions."
            }
        ],
        "steps": [
            "1. Print demonstration start message to the Serial Monitor.",
            "2. Drive Servo 1 Clockwise (CW) at 80% speed for 2 seconds.",
            "3. Stop the continuous servo cleanly for 1 second.",
            "4. Reverse direction to Counter-Clockwise (CCW) at 80% speed for 2 seconds.",
            "5. Stop again and print completion confirmation."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Bidirectional Continuous Drive",
                "desc": "Drive continuous servo in CW, stop, CCW reverse, and idle states.",
                "challenge": "Program a crawl speed test: test how low the speed can go (e.g. 20%) before stalling.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Continuous Servo Demo</field></shadow></value><next><block type=\"esp32_servo_360\"><field name=\"PIN\">1</field><field name=\"STATE\">CW</field><value name=\"SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">80</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"esp32_servo_360\"><field name=\"PIN\">1</field><field name=\"STATE\">STOP</field><value name=\"SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_servo_360\"><field name=\"PIN\">1</field><field name=\"STATE\">CCW</field><value name=\"SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">80</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"esp32_servo_360\"><field name=\"PIN\">1</field><field name=\"STATE\">STOP</field><value name=\"SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Servo Cycle Finished</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Bidirectional Continuous Drive: Understanding hardware execution and parameter changes.",
                "newBlock": "Motors Block"
            }
        ]
    },
    {
        "id": "07_stepper",
        "exampleId": "07",
        "title": "Stepper Precision Indexing",
        "tier": "Intermediate",
        "category": "Motors",
        "icon": "RotateCcw",
        "color": "#9333EA",
        "bg": "#F3E8FF",
        "summary": "Step discrete electromagnetic coils to achieve exact fractional degree positioning without accumulated error.",
        "overview": {
            "what": "Stepper motors divide a full 360° rotation into a multitude of identical discrete steps (e.g. 2048 steps per revolution on a 28BYJ-48 motor). They move exactly one step per coil pulse without slipping.",
            "howItWorks": "Four internal stator coils are energized in a specific sequential pattern (Wave, Full-step, or Half-step). As each coil turns ON, it pulls the permanent magnet rotor into alignment. Releasing coils when stationary saves significant battery power.",
            "realWorld": "Used in 3D printers (X/Y/Z gantries), CNC milling machines, flatbed document scanners, telescope tracking mounts, and ATM cash dispensers."
        },
        "pinout": [
            {
                "label": "STEPPER IN1-IN4",
                "pin": "GP12, GP13, GP14, GP27",
                "desc": "4-phase stepper motor coil driver pins (ULN2003 / MOSFETs)"
            }
        ],
        "terminology": [
            {
                "term": "Steps per Revolution",
                "def": "The exact number of step pulses needed to complete one full 360 degree rotation."
            },
            {
                "term": "Holding Current",
                "def": "Power consumed by energized coils when standing still to resist external forces."
            },
            {
                "term": "Coil Release",
                "def": "De-energizing all 4 phases when motion stops to eliminate heat generation and battery drain."
            }
        ],
        "steps": [
            "1. Announce indexing cycle to Serial Monitor.",
            "2. Command 360° clockwise rotation with 10ms step delay.",
            "3. Wait 1 second at the target index mark.",
            "4. Reverse rotation by 180° counter-clockwise back to the halfway point.",
            "5. Release all coils with 'Stepper Stop' to cool down motor coils and preserve battery."
        ],
        "levels": [
            {
                "level": 1,
                "name": "360° Precision Indexing",
                "desc": "Rotate exactly 360° CW, pause, return 180° CCW, and de-energize coils.",
                "challenge": "Modify the degrees block to index in exact 90-degree quadrant increments with a pause at each quadrant.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Stepper Indexing 360 Deg CW</field></shadow></value><next><block type=\"esp32_stepper_degrees\"><field name=\"DIR\">CW</field><field name=\"DELAY\">10</field><value name=\"DEGREES\"><shadow type=\"math_number\"><field name=\"NUM\">360</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Stepper Returning 180 Deg CCW</field></shadow></value><next><block type=\"esp32_stepper_degrees\"><field name=\"DIR\">CCW</field><field name=\"DELAY\">10</field><value name=\"DEGREES\"><shadow type=\"math_number\"><field name=\"NUM\">180</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_stepper_stop\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Stepper Coils Released (Power Saved)</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering 360° Precision Indexing: Understanding hardware execution and parameter changes.",
                "newBlock": "Motors Block"
            }
        ]
    },
    {
        "id": "08_sensor_mapper",
        "exampleId": "08",
        "title": "Sensor Range Mapping & Math",
        "tier": "Intermediate",
        "category": "Sensors",
        "icon": "Sliders",
        "color": "#D946EF",
        "bg": "#FDF4FF",
        "summary": "Linearly scale analog inputs (0–100%) to target actuator ranges (0–180° servo angles) with live OLED telemetry.",
        "overview": {
            "what": "Raw sensor signals rarely match the exact range needed by actuators. The mathematical Map function transforms values from one scale (e.g. 0% to 100% dial rotation) proportionally into another scale (e.g. 0° to 180° servo deflection).",
            "howItWorks": "The algorithm uses linear interpolation: Target = ((Value - FromLow) * (ToHigh - ToLow)) / (FromHigh - FromLow) + ToLow. The microcontroller recalculates this continuously in real time as the input varies.",
            "realWorld": "Used in fly-by-wire aircraft pilot joysticks, electric bicycle pedal-assist torque sensors, medical infusion pump dials, and robotic teleoperation."
        },
        "pinout": [
            {
                "label": "SN1 (PORT 1)",
                "pin": "GP34",
                "desc": "Analog sensor input (potentiometer, light sensor, or flex sensor)"
            },
            {
                "label": "SERVO 1",
                "pin": "GP18",
                "desc": "Proportional servo output driven by mapped sensor values"
            },
            {
                "label": "OLED",
                "pin": "GP21/GP22",
                "desc": "I2C display showing real-time input and output metrics"
            }
        ],
        "terminology": [
            {
                "term": "Linear Interpolation (Map)",
                "def": "Proportionally converting a number from one numeric range into another target range."
            },
            {
                "term": "ADC (Analog to Digital)",
                "def": "Measuring continuous analog voltage levels into digital numbers."
            },
            {
                "term": "Closed Calibration",
                "def": "Defining minimum and maximum operational limits for physical sensors."
            }
        ],
        "steps": [
            "1. Center Servo 1 to 90 degrees on startup and wait 500ms.",
            "2. Enter continuous 'While [True]' feedback loop.",
            "3. Read Sensor Port 1 (0-100%) and map it into 0-180 degrees.",
            "4. Command Servo 1 directly to the mapped angle.",
            "5. Print the raw sensor percentage on OLED Row 0.",
            "6. Print the calculated servo angle on OLED Row 2.",
            "7. Loop runs at 10 Hz (100ms refresh rate) for responsive tracking."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Real-Time Sensor-to-Servo Map",
                "desc": "Turn an analog sensor dial to proportionally rotate a physical servo arm from 0° to 180°.",
                "challenge": "Invert the mapping: when the sensor is at 0%, make the servo go to 180°; when at 100%, make the servo go to 0°.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_servo_center\"><field name=\"PIN\">1</field><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">500</field></shadow></value><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"esp32_servo\"><field name=\"PIN\">1</field><value name=\"ANGLE\"><block type=\"esp32_map\"><value name=\"VAL\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value><value name=\"FROM_LOW\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"FROM_HIGH\"><shadow type=\"math_number\"><field name=\"NUM\">100</field></shadow></value><value name=\"TO_LOW\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"TO_HIGH\"><shadow type=\"math_number\"><field name=\"NUM\">180</field></shadow></value></block></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Sensor %: </field></shadow></value><value name=\"ADD1\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Servo Deg: </field></shadow></value><value name=\"ADD1\"><block type=\"esp32_map\"><value name=\"VAL\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value><value name=\"FROM_LOW\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"FROM_HIGH\"><shadow type=\"math_number\"><field name=\"NUM\">100</field></shadow></value><value name=\"TO_LOW\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"TO_HIGH\"><shadow type=\"math_number\"><field name=\"NUM\">180</field></shadow></value></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">100</field></shadow></value></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Real-Time Sensor-to-Servo Map: Understanding hardware execution and parameter changes.",
                "newBlock": "Sensors Block"
            }
        ]
    },
    {
        "id": "09_thermostat",
        "exampleId": "09",
        "title": "Smart Thermostat & Closed-Loop Fan",
        "tier": "Intermediate",
        "category": "Control",
        "icon": "Fan",
        "color": "#0284C7",
        "bg": "#E0F2FE",
        "summary": "Implement closed-loop bang-bang feedback control to automatically regulate temperature using an active cooling fan.",
        "overview": {
            "what": "Closed-loop feedback is the foundation of automated control engineering. The system measures an environmental condition (temperature), compares it against a target threshold, and automatically engages an actuator (cooling fan) until equilibrium is restored.",
            "howItWorks": "The sensor on Port 1 is sampled continuously. If the reading exceeds 50%, the microcontroller turns on Motor 1 (fan) at full speed, illuminates the system LED, and writes 'FAN: ACTIVE (HIGH)' on the OLED. When temperature drops below 50%, the fan halts immediately.",
            "realWorld": "Used in home HVAC climate control thermostats (Nest/Honeywell), datacenter server rack thermal cooling, electric car battery thermal management, and 3D printer hotend heatbreaks."
        },
        "pinout": [
            {
                "label": "SN1 (PORT 1)",
                "pin": "GP34",
                "desc": "Temperature / thermistor analog input sensor"
            },
            {
                "label": "MOTOR 1",
                "pin": "Motor Port 1",
                "desc": "Cooling fan motor driven by onboard H-bridge"
            },
            {
                "label": "SYS_LED",
                "pin": "GP2",
                "desc": "Cooling active indicator light"
            }
        ],
        "terminology": [
            {
                "term": "Closed-Loop Control",
                "def": "A control system that uses feedback from sensors to adjust its control actions automatically."
            },
            {
                "term": "Threshold (Setpoint)",
                "def": "The target numerical value at which an automated system switches states."
            },
            {
                "term": "Bang-Bang Control",
                "def": "A simple feedback mechanism that switches abruptly between two states (fully ON or fully OFF)."
            }
        ],
        "steps": [
            "1. Enter infinite monitoring loop.",
            "2. Read temperature sensor from Port 1.",
            "3. If sensor reading is Greater Than 50: turn Motor 1 FORWARD at 100% speed.",
            "4. Turn on the builtin LED and display 'FAN: ACTIVE (HIGH)' on row 2 of the OLED.",
            "5. If temperature is 50 or below: STOP Motor 1, extinguish the LED, and display 'FAN: STANDBY (OFF)'.",
            "6. Wait 0.2 seconds before repeating the closed-loop evaluation."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Closed-Loop Thermal Switch",
                "desc": "Automatically spin cooling fan whenever sensor threshold is exceeded.",
                "challenge": "Change the threshold from 50 to 65 and add an alarm beep if the sensor reaches 80 (emergency overheat).",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">50</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_motor\"><field name=\"MOTOR\">1</field><field name=\"DIR\">FWD</field><value name=\"SPEED\"><shadow type=\"ten_number_100\"><field name=\"NUM\">100</field></shadow></value><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">1</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">FAN: ACTIVE (HIGH)</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"esp32_motor\"><field name=\"MOTOR\">1</field><field name=\"DIR\">STOP</field><value name=\"SPEED\"><shadow type=\"ten_number_100\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">0</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">FAN: STANDBY (OFF)</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></next></block></statement><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.2</field></shadow></value></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Closed-Loop Thermal Switch: Understanding hardware execution and parameter changes.",
                "newBlock": "Control Block"
            }
        ]
    },
    {
        "id": "10_ultrasonic",
        "exampleId": "10",
        "title": "Ultrasonic Radar & Proximity Alert",
        "tier": "Intermediate",
        "category": "Sensors",
        "icon": "AlertTriangle",
        "color": "#EF4444",
        "bg": "#FEE2E2",
        "summary": "Emit 40kHz acoustic pulses to calculate obstacle distance by flight time, triggering multi-stage safety alarms.",
        "overview": {
            "what": "Ultrasonic sensors (like the HC-SR04) measure distance using high-frequency sonar echo location, the same principle used by bats and naval submarines.",
            "howItWorks": "The sensor transmits a 10-microsecond 40kHz ultrasonic chirp from its transmitter horn. The pulse travels through air at the speed of sound (343 m/s), bounces off obstacles, and returns to the receiver horn. Distance = (Travel Time * 0.0343) / 2 cm.",
            "realWorld": "Used in automotive parking assist sensors, autonomous factory AGVs, water tank level gauges, drone ground proximity altimeters, and automatic sliding doors."
        },
        "pinout": [
            {
                "label": "TRIG",
                "pin": "GP23",
                "desc": "Ultrasonic trigger pulse output pin"
            },
            {
                "label": "ECHO",
                "pin": "GP32",
                "desc": "Ultrasonic echo flight-time return input pin"
            },
            {
                "label": "ALARM LED",
                "pin": "GP4",
                "desc": "Visual warning beacon"
            }
        ],
        "terminology": [
            {
                "term": "Time of Flight (ToF)",
                "def": "Measuring the round-trip elapsed time for an emitted wave to return to calculate distance."
            },
            {
                "term": "Sonar",
                "def": "Sound Navigation and Ranging: using acoustic sound waves for navigation and obstacle detection."
            },
            {
                "term": "Blind Zone",
                "def": "The minimum physical distance (typically 2-3 cm) where echo waves return too quickly to measure."
            }
        ],
        "steps": [
            "1. Enter continuous distance monitoring loop.",
            "2. Trigger and read distance in cm with 'Ultrasonic Distance Trig 23 Echo 32'.",
            "3. If distance is Less Than 20 cm: emergency proximity threshold triggered.",
            "4. Turn ON Alarm LED on Pin 4 and write '! DANGER: STOP !' on OLED row 2.",
            "5. If distance is 20 cm or more: extinguish Alarm LED and display 'CLEAR TO PROCEED'.",
            "6. Sample every 100ms for fast anti-collision response."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Sonar Collision Warning",
                "desc": "Sense objects within 20cm and trigger red warning lights and OLED alarms.",
                "challenge": "Create a 3-tier warning system: Green if > 40cm, Yellow/OLED if 20-40cm, Red/Buzzer if < 20cm.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_ultrasonic_read\"><field name=\"TRIG\">23</field><field name=\"ECHO\">32</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">20</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">! DANGER: STOP !</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></statement><statement name=\"ELSE\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">0</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">CLEAR TO PROCEED</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></statement><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">100</field></shadow></value></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Sonar Collision Warning: Understanding hardware execution and parameter changes.",
                "newBlock": "Sensors Block"
            }
        ]
    },
    {
        "id": "11_battery",
        "exampleId": "11",
        "title": "Battery Power Supervisor & Low-Volt Cutoff",
        "tier": "Intermediate",
        "category": "System",
        "icon": "Battery",
        "color": "#F97316",
        "bg": "#FFEDD5",
        "summary": "Sample high-impedance voltage divider, calculate charge percentage, and trigger emergency motor cutoffs to protect LiPo cells.",
        "overview": {
            "what": "Lithium Polymer (LiPo) and Lithium-Ion batteries will suffer permanent chemical damage or fire if discharged below 3.0V per cell. A software battery supervisor monitors voltage and halts heavy loads before dangerous discharge occurs.",
            "howItWorks": "The onboard battery input passes through a calibrated resistive voltage divider into an internal ADC channel. The 'Get Battery %' block calculates remaining state of charge. If battery drops below 20%, all motors are forcibly cut off and an emergency warning is shown.",
            "realWorld": "Used in smartphones (auto-shutdown at 2% battery), electric cars (limp home mode), aerial quadcopter drones (auto Return-To-Home on low battery), and uninterruptible power supplies (UPS)."
        },
        "pinout": [
            {
                "label": "BATT ADC",
                "pin": "Internal",
                "desc": "Calibrated precision voltage divider channel"
            },
            {
                "label": "OLED",
                "pin": "GP21/GP22",
                "desc": "Display showing live percentage and power safety warnings"
            }
        ],
        "terminology": [
            {
                "term": "State of Charge (SoC)",
                "def": "The available battery capacity expressed as a percentage of its rated full charge."
            },
            {
                "term": "Low-Voltage Cutoff (LVC)",
                "def": "Automatic safety disconnect feature that stops motors to prevent battery destruction."
            },
            {
                "term": "Voltage Sag",
                "def": "Temporary drop in battery voltage caused by the heavy current draw of accelerating motors."
            }
        ],
        "steps": [
            "1. Enter continuous supervisor loop.",
            "2. Read battery percentage with 'Get Battery %'.",
            "3. If percentage is Less Than 20%: trigger safety cutoff.",
            "4. Stop all motors instantly with 'Stop All Motors'.",
            "5. Light system LED and write 'CRITICAL: LOW BATT' & 'MOTORS HALTED' on the OLED screen.",
            "6. If battery is above 20%: display 'Battery: [pct]%' and 'POWER SYSTEM: OK'.",
            "7. Evaluate every 1 second."
        ],
        "levels": [
            {
                "level": 1,
                "name": "LiPo Under-Voltage Guard",
                "desc": "Monitor battery percentage and execute emergency motor shutdown when below 20%.",
                "challenge": "Add a loud emergency buzzer alert tone that pulses every second when low battery is detected.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_get_battery\"></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">20</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_stop_all_motors\"><next><block type=\"esp32_led_builtin\"><field name=\"STATE\">1</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">CRITICAL: LOW BATT</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">MOTORS HALTED</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">3</field></shadow></value></block></next></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Battery: </field></shadow></value><value name=\"ADD1\"><block type=\"esp32_get_battery\"></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">POWER SYSTEM: OK</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">3</field></shadow></value></block></next></block></statement><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering LiPo Under-Voltage Guard: Understanding hardware execution and parameter changes.",
                "newBlock": "System Block"
            }
        ]
    },
    {
        "id": "12_oled_dashboard",
        "exampleId": "12",
        "title": "OLED Multi-Line Telemetry Dashboard",
        "tier": "Advanced",
        "category": "Display",
        "icon": "Tv",
        "color": "#8B5CF6",
        "bg": "#EDE9FE",
        "summary": "Render multi-line graphical telemetry on SSD1306 128x64 display using fast I2C framebuffers.",
        "overview": {
            "what": "The onboard 0.96 inch SSD1306 OLED display features 128x64 individual light-emitting organic pixels. It provides a full graphical user interface without requiring a computer monitor.",
            "howItWorks": "MicroPython maintains a 1024-byte RAM framebuffer (1 bit per pixel). Drawing blocks write into this RAM array, and the display block pushes all 8192 pixels across the I2C bus at 400kHz. Clearing the buffer between frames prevents ghosting.",
            "realWorld": "Used in smart home thermostat faces, portable medical pulse oximeters, handheld gaming devices, 3D printer status panels, and crypto hardware wallets."
        },
        "pinout": [
            {
                "label": "SDA",
                "pin": "GP21",
                "desc": "I2C Serial Data line"
            },
            {
                "label": "SCL",
                "pin": "GP22",
                "desc": "I2C Serial Clock line (400 kHz fast mode)"
            }
        ],
        "terminology": [
            {
                "term": "Framebuffer",
                "def": "A dedicated block of memory holding the complete bitmap image to be sent to the display."
            },
            {
                "term": "I2C Bus",
                "def": "A synchronous two-wire serial communication bus connecting the processor to peripheral chips."
            },
            {
                "term": "Ghosting",
                "def": "Visual artifacts caused by drawing new text over old text without clearing the display buffer first."
            }
        ],
        "steps": [
            "1. Enter infinite dashboard refresh loop.",
            "2. Clear the screen buffer with 'OLED Clear' to erase previous frame remnants.",
            "3. Print system title 'TEN ROBOTICS OS' on Row 0.",
            "4. Combine 'Sensor: ' with live reading from Port 1 and print on Row 2.",
            "5. Combine 'Battery: ' with live battery percentage and print on Row 4.",
            "6. Wait 0.5 seconds before rendering the next refreshed frame."
        ],
        "levels": [
            {
                "level": 1,
                "name": "3-Line Telemetry HUD",
                "desc": "Render system OS header, live sensor reading, and battery gauge cleanly across OLED lines.",
                "challenge": "Add a 4th line displaying elapsed system uptime or a rotating activity spinner.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"esp32_oled_clear\"><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">TEN ROBOTICS OS</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Sensor: </field></shadow></value><value name=\"ADD1\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Battery: </field></shadow></value><value name=\"ADD1\"><block type=\"esp32_get_battery\"></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">4</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.5</field></shadow></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering 3-Line Telemetry HUD: Understanding hardware execution and parameter changes.",
                "newBlock": "Display Block"
            }
        ]
    },
    {
        "id": "13_robot_eyes",
        "exampleId": "13",
        "title": "Robot Emotion Expressions & Gaze Animation",
        "tier": "Advanced",
        "category": "Display",
        "icon": "Bot",
        "color": "#6366F1",
        "bg": "#EEF2FF",
        "summary": "Design organic robotic facial expressions, dynamic eye blinks, and gaze shifts for human-robot interaction.",
        "overview": {
            "what": "Human-Robot Interaction (HRI) relies heavily on non-verbal expressive cues. Rendering animated eyes gives mechanical robots recognizable personality, emotional presence, and intuitive intent.",
            "howItWorks": "Specialized graphics routines render rounded rectangular eye pupils with configurable size, position, and gaze orientation (CENTER, LEFT, RIGHT, UP, DOWN). Procedural blinking shrinks eye height to 1 pixel and re-expands it organically.",
            "realWorld": "Used in Pixar animatronics (Wall-E), Boston Dynamics robots, hospital delivery robots (Relay), social companion robots (Moxie/Vector), and Disney robotic characters."
        },
        "pinout": [
            {
                "label": "OLED DISPLAY",
                "pin": "GP21/GP22",
                "desc": "128x64 high-contrast OLED screen"
            }
        ],
        "terminology": [
            {
                "term": "HRI",
                "def": "Human-Robot Interaction: study of interfaces and communication cues between people and autonomous systems."
            },
            {
                "term": "Gaze Shift",
                "def": "Moving robot pupils toward an obstacle or person before moving in that direction."
            },
            {
                "term": "Procedural Animation",
                "def": "Generating motion algorithmically in code rather than playing back pre-recorded video frames."
            }
        ],
        "steps": [
            "1. Enter continuous emotional animation loop.",
            "2. Render forward-facing robot eyes (CENTER) and hold for 1 second.",
            "3. Shift gaze to the LEFT (16x7 eye size) for 0.8 seconds.",
            "4. Shift gaze to the RIGHT for 0.8 seconds to inspect the environment.",
            "5. Execute an organic BLINK animation sequence at speed 35.",
            "6. Display a HAPPY expression with centered gaze for 1.5 seconds."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Animated Robot Face",
                "desc": "Animate eye gaze movements, organic blinks, and happy emotional reactions.",
                "challenge": "Trigger an inquisitive eyebrow tilt when an obstacle is detected in front of the robot.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"esp32_spidermaf_eyes\"><field name=\"DIR\">CENTER</field><field name=\"SIZE\">16,7</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value><next><block type=\"esp32_spidermaf_eyes\"><field name=\"DIR\">LEFT</field><field name=\"SIZE\">16,7</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.8</field></shadow></value><next><block type=\"esp32_spidermaf_eyes\"><field name=\"DIR\">RIGHT</field><field name=\"SIZE\">16,7</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.8</field></shadow></value><next><block type=\"esp32_eyes_animate\"><field name=\"ANIM\">BLINK</field><field name=\"SPEED\">35</field><next><block type=\"esp32_eyes_expression\"><field name=\"MOOD\">HAPPY</field><field name=\"LOOK\">CENTER</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1.5</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Animated Robot Face: Understanding hardware execution and parameter changes.",
                "newBlock": "Display Block"
            }
        ]
    },
    {
        "id": "14_emojis",
        "exampleId": "14",
        "title": "Monochrome Emoji & Icon Display",
        "tier": "Advanced",
        "category": "Display",
        "icon": "Sparkles",
        "color": "#EC4899",
        "bg": "#FCE7F3",
        "summary": "Draw 16x16 and 32x32 bitmap emotion glyphs using monochrome bitmasking on the OLED display.",
        "overview": {
            "what": "Bitmap icons compress complex pictorial information into simple pixel grids. Drawing expressive icons (Smile, Cool, Robot, Surprised) allows a robot to visually report its operational status in an intuitive way.",
            "howItWorks": "Each icon is stored in flash memory as a compact byte array (1 bit = 1 pixel). The blit (bit block transfer) routine rapidly copies these packed bytes directly onto the display coordinates (X=48, Y=16).",
            "realWorld": "Used in smart watches (fitness badges), digital camera mode indicators, printer status icons (low ink, paper jam), and electric scooter battery screens."
        },
        "pinout": [
            {
                "label": "OLED DISPLAY",
                "pin": "GP21/GP22",
                "desc": "128x64 pixel display interface"
            }
        ],
        "terminology": [
            {
                "term": "Bitmap",
                "def": "A digital image where each pixel corresponds directly to one or more bits in memory."
            },
            {
                "term": "Blit (BitBLT)",
                "def": "Bit Block Transfer: rapidly copying a 2D memory array of pixels to another memory region."
            },
            {
                "term": "Pixel Coordinates (X,Y)",
                "def": "Top-left is (0,0); X increases rightward to 127; Y increases downward to 63."
            }
        ],
        "steps": [
            "1. Enter continuous emoji cycling loop.",
            "2. Render 'smile' emoji at centered coordinates (48, 16) for 1.5 seconds.",
            "3. Switch to 'cool' emoji for 1.5 seconds.",
            "4. Switch to 'robot' mascot icon for 1.5 seconds.",
            "5. Switch to 'surprised' icon for 1.5 seconds.",
            "6. Loop repeats seamlessly."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Icon Carousel",
                "desc": "Render sequence of bitmap glyphs (smile, cool, robot, surprised) at screen center.",
                "challenge": "Display the 'surprised' emoji only when an obstacle is within 15cm, otherwise show 'smile'.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"esp32_oled_emoji\"><field name=\"NAME\">smile</field><field name=\"POS\">48,16</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1.5</field></shadow></value><next><block type=\"esp32_oled_emoji\"><field name=\"NAME\">cool</field><field name=\"POS\">48,16</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1.5</field></shadow></value><next><block type=\"esp32_oled_emoji\"><field name=\"NAME\">robot</field><field name=\"POS\">48,16</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1.5</field></shadow></value><next><block type=\"esp32_oled_emoji\"><field name=\"NAME\">surprised</field><field name=\"POS\">48,16</field><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1.5</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Icon Carousel: Understanding hardware execution and parameter changes.",
                "newBlock": "Display Block"
            }
        ]
    },
    {
        "id": "15_obstacle_rover",
        "exampleId": "15",
        "title": "Autonomous Obstacle Rover Intelligence",
        "tier": "Advanced",
        "category": "Robotics",
        "icon": "Bot",
        "color": "#A855F7",
        "bg": "#F3E8FF",
        "summary": "Build state-machine navigation: forward cruising, obstacle detection, emergency stopping, reverse and spin escape.",
        "overview": {
            "what": "Autonomous mobile robots navigate unknown environments without human drivers. This requires sensory perception, real-time decision making, and coordinated dual-motor differential drive maneuvering.",
            "howItWorks": "The ultrasonic sensor pings continuously. If clearance is greater than 30 cm, both wheels drive forward at 80% speed while smiling. If an obstacle blocks the path (< 30 cm), the rover halts, displays a surprised emoji, reverses both wheels (-70%) for 0.6s, then pivots (Left +70%, Right -70%) for 0.4s to choose a clear escape heading.",
            "realWorld": "Used in robotic vacuum cleaners (Roomba/Roborock), warehouse autonomous mobile robots (Amazon Kiva), agricultural harvesting robots, and extraterrestrial planetary rovers."
        },
        "pinout": [
            {
                "label": "M1 (LEFT)",
                "pin": "Motor Port 1",
                "desc": "Left traction wheel motor"
            },
            {
                "label": "M2 (RIGHT)",
                "pin": "Motor Port 2",
                "desc": "Right traction wheel motor"
            },
            {
                "label": "TRIG/ECHO",
                "pin": "GP23/GP32",
                "desc": "Forward-facing ultrasonic eye"
            }
        ],
        "terminology": [
            {
                "term": "Differential Steering",
                "def": "Steering by driving left and right wheels at different speeds or opposite directions."
            },
            {
                "term": "Escape Vector",
                "def": "The reverse and spin sequence executed to extricate a trapped robot from a dead-end."
            },
            {
                "term": "Zero-Radius Turn",
                "def": "Spinning on the spot by rotating one wheel forward and the opposite wheel backward."
            }
        ],
        "steps": [
            "1. Enter autonomous navigation loop.",
            "2. Read forward ultrasonic distance in cm.",
            "3. If distance is Less Than 30cm: OBSTACLE DETECTED!",
            "4. Halt both motors immediately and show 'surprised' emoji.",
            "5. Reverse both motors at -70% power for 0.6 seconds to back away.",
            "6. Spin in place (Left +70%, Right -70%) for 0.4 seconds to rotate away.",
            "7. If path is clear: show 'smile' emoji and cruise forward at 80% speed.",
            "8. Re-evaluate every 50ms for high-speed obstacle avoidance."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Autonomous Evasive Maneuver",
                "desc": "Drive forward, detect obstacles within 30cm, brake, back up, and pivot.",
                "challenge": "Add a random turn selector: randomly choose between spinning Left or spinning Right to avoid getting stuck in corners.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_ultrasonic_read\"><field name=\"TRIG\">23</field><field name=\"ECHO\">32</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_stop_all_motors\"><next><block type=\"esp32_oled_emoji\"><field name=\"NAME\">surprised</field><field name=\"POS\">48,16</field><next><block type=\"esp32_dual_motor\"><value name=\"LEFT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">-70</field></shadow></value><value name=\"RIGHT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">-70</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.6</field></shadow></value><next><block type=\"esp32_dual_motor\"><value name=\"LEFT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">70</field></shadow></value><value name=\"RIGHT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">-70</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"esp32_oled_emoji\"><field name=\"NAME\">smile</field><field name=\"POS\">48,16</field><next><block type=\"esp32_dual_motor\"><value name=\"LEFT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">80</field></shadow></value><value name=\"RIGHT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">80</field></shadow></value></block></next></block></statement><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">50</field></shadow></value></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Autonomous Evasive Maneuver: Understanding hardware execution and parameter changes.",
                "newBlock": "Robotics Block"
            }
        ]
    },
    {
        "id": "16_line_follower",
        "exampleId": "16",
        "title": "Line Tracking & Differential Steering",
        "tier": "Advanced",
        "category": "Robotics",
        "icon": "Compass",
        "color": "#10B981",
        "bg": "#D1FAE5",
        "summary": "Track high-contrast floor trajectories using dual optical reflectance sensors with closed-loop steering correction.",
        "overview": {
            "what": "Line tracking is the most reliable navigation method for industrial automated transport. Downward-pointing infrared reflectance sensors distinguish between light reflective floors and dark non-reflective tape lines.",
            "howItWorks": "When both sensors see the dark line (< 30%), the robot drives straight at 75%. If the left sensor strays off the line, the robot reduces left wheel speed to 30% and speeds up the right wheel to 80%, steering itself back onto the centerline in milliseconds.",
            "realWorld": "Used in factory AGVs transporting automotive chassis, hospital medication delivery carts, semiconductor cleanroom wafer transports, and automated mail sorting bots."
        },
        "pinout": [
            {
                "label": "SN1 (LEFT SENSOR)",
                "pin": "GP34",
                "desc": "Left optical infrared ground tracker"
            },
            {
                "label": "SN2 (RIGHT SENSOR)",
                "pin": "GP35",
                "desc": "Right optical infrared ground tracker"
            },
            {
                "label": "M1 / M2",
                "pin": "Motor Ports",
                "desc": "Differential traction motors"
            }
        ],
        "terminology": [
            {
                "term": "IR Reflectance",
                "def": "Measuring the quantity of emitted infrared light bounced back from a surface."
            },
            {
                "term": "Proportional Correction",
                "def": "Adjusting motor speeds in direct proportion to how far off-center the robot has drifted."
            },
            {
                "term": "Line Acquisition",
                "def": "The algorithm for searching and locking back onto the trajectory if both sensors lose the line."
            }
        ],
        "steps": [
            "1. Enter 50Hz control loop (20ms loop time).",
            "2. Read Left Sensor (Port 1) and Right Sensor (Port 2).",
            "3. If BOTH sensors < 30%: robot is centered — drive straight forward at 75% speed.",
            "4. If ONLY Left < 30%: robot drifted right — slow Left to 30%, boost Right to 80% to steer left.",
            "5. If ONLY Right < 30%: robot drifted left — boost Left to 80%, slow Right to 30% to steer right.",
            "6. If NEITHER sees the line: halt motors safely to prevent wandering off course."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Dual-Sensor Trajectory Follower",
                "desc": "Follow black electrical tape on white floors with automatic differential steering correction.",
                "challenge": "Implement a line-loss recovery spin: if both sensors lose the line, spin in the direction of the last known sensor reading.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_operation\"><field name=\"OP\">AND</field><value name=\"A\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value></block></value><value name=\"B\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">2</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value></block></value></block></value><statement name=\"DO0\"><block type=\"esp32_dual_motor\"><value name=\"LEFT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">75</field></shadow></value><value name=\"RIGHT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">75</field></shadow></value></block></statement><statement name=\"ELSE\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_dual_motor\"><value name=\"LEFT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value><value name=\"RIGHT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">80</field></shadow></value></block></statement><statement name=\"ELSE\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">2</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_dual_motor\"><value name=\"LEFT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">80</field></shadow></value><value name=\"RIGHT_SPEED\"><shadow type=\"math_number\"><field name=\"NUM\">30</field></shadow></value></block></statement><statement name=\"ELSE\"><block type=\"esp32_stop_all_motors\"></block></statement></block></statement></block></statement><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">20</field></shadow></value></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Dual-Sensor Trajectory Follower: Understanding hardware execution and parameter changes.",
                "newBlock": "Robotics Block"
            }
        ]
    },
    {
        "id": "17_esp_now",
        "exampleId": "17",
        "title": "ESP-NOW High-Speed Wireless",
        "tier": "Advanced",
        "category": "Wireless",
        "icon": "Radio",
        "color": "#059669",
        "bg": "#D1FAE5",
        "summary": "Broadcast ultra-low latency 2.4GHz radio packets directly between microcontrollers without needing a Wi-Fi router.",
        "overview": {
            "what": "ESP-NOW is a connectionless wireless communication protocol developed by Espressif. It allows ESP32 chips to transmit fast packet payloads directly peer-to-peer with sub-millisecond latency.",
            "howItWorks": "Instead of going through the slow TCP/IP handshake and Wi-Fi router routing, ESP-NOW sends raw 802.11 action vendor frames directly between MAC addresses. Packet transmission takes less than 1 millisecond.",
            "realWorld": "Used in drone remote controls, swarm robotics synchronization, wireless smart home wall switches, solar panel farm sensor arrays, and sports scoreboards."
        },
        "pinout": [
            {
                "label": "2.4GHz ANTENNA",
                "pin": "Onboard PCB",
                "desc": "Integrated RF ceramic/trace antenna"
            },
            {
                "label": "SN2 (PORT 2)",
                "pin": "GP35",
                "desc": "Wireless telemetry input sensor"
            }
        ],
        "terminology": [
            {
                "term": "Connectionless",
                "def": "Transmitting packets immediately without waiting for network discovery, handshakes, or passwords."
            },
            {
                "term": "MAC Address",
                "def": "The unique 6-byte hardware identification code permanently burnt into each network radio chip."
            },
            {
                "term": "Broadcast Address",
                "def": "Transmitting to FF:FF:FF:FF:FF:FF so every listening device in radio range receives the packet."
            }
        ],
        "steps": [
            "1. Enter continuous broadcast loop.",
            "2. Read live sensor value from Port 2.",
            "3. Broadcast sensor reading wirelessly with 'ESP-NOW Broadcast Value'.",
            "4. Log 'Packet Broadcasted via ESP-NOW' to Serial Monitor.",
            "5. If sensor reading exceeds 60: turn on warning LED (Pin 4).",
            "6. Wait 1 second before transmitting next wireless beacon."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Peer-to-Peer Telemetry Broadcast",
                "desc": "Broadcast live sensor readings wirelessly over 2.4GHz ESP-NOW and trigger local indicator flags.",
                "challenge": "Send a structured 2-variable packet: combine sensor reading and battery percentage into a single broadcast.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"esp32_broadcast\"><value name=\"VAL\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">2</field></block></value><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Packet Broadcasted via ESP-NOW</field></shadow></value><next><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">2</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">60</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">1</field></block></statement><statement name=\"ELSE\"><block type=\"esp32_digital_write\"><field name=\"PIN\">4</field><field name=\"STATE\">0</field></block></statement><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">1</field></shadow></value></block></next></block></next></block></next></block></statement></block></next></block></xml>",
                "whatYouLearn": "Mastering Peer-to-Peer Telemetry Broadcast: Understanding hardware execution and parameter changes.",
                "newBlock": "Wireless Block"
            }
        ]
    },
    {
        "id": "18_i2c_diagnostics",
        "exampleId": "18",
        "title": "I2C Bus Diagnostics & TMP102",
        "tier": "Master",
        "category": "System",
        "icon": "Search",
        "color": "#475569",
        "bg": "#F1F5F9",
        "summary": "Perform comprehensive bus scan of 7-bit peripheral addresses and read digital temperature registers.",
        "overview": {
            "what": "The Inter-Integrated Circuit (I2C) protocol allows up to 127 individual smart sensors, displays, and coprocessors to share the exact same two wires (SDA and SCL).",
            "howItWorks": "Every I2C device has a unique 7-bit hardware address (e.g. 0x3C / 60 for the OLED, 0x48 / 72 for TMP102 temperature, 0x68 / 104 for MPU6050). The bus scanner queries every address from 1 to 127 and reports which devices respond with an ACK (Acknowledge) pulse.",
            "realWorld": "Used in smartphones (linking compass, gyro, light sensor, battery fuel gauge), automotive electronic control units, PC motherboards (SMBus), and medical monitors."
        },
        "pinout": [
            {
                "label": "SDA (DATA)",
                "pin": "GP21",
                "desc": "Bidirectional open-drain serial data with pull-up resistor"
            },
            {
                "label": "SCL (CLOCK)",
                "pin": "GP22",
                "desc": "Master-driven synchronous serial clock line"
            }
        ],
        "terminology": [
            {
                "term": "I2C Address",
                "def": "A 7-bit hexadecimal identifier (0x08 to 0x77) that tells the bus which chip is being spoken to."
            },
            {
                "term": "ACK / NACK",
                "def": "Acknowledge (ACK): peripheral pulls SDA low to say 'I am here'; NACK means no device responded."
            },
            {
                "term": "Open-Drain / Pull-Up",
                "def": "Circuit configuration requiring pull-up resistors to keep bus lines high when idle."
            }
        ],
        "steps": [
            "1. Print bus diagnostic banner to Serial Monitor.",
            "2. Execute 'I2C Scan Bus' — this probes addresses 1-127 and prints discovered devices.",
            "3. Clear OLED screen buffer.",
            "4. Display 'I2C SCAN COMPLETE' on Row 0.",
            "5. Read the digital temperature from the TMP102 sensor at address 72 (0x48 in decimal) using 'Temp °C (TMP102)' and display it on Row 2."
        ],
        "levels": [
            {
                "level": 1,
                "name": "I2C Hardware Discovery",
                "desc": "Scan the 2-wire bus, identify peripheral addresses, and read live TMP102 temperature.",
                "challenge": "Convert the Celsius reading to Fahrenheit by multiplying by 1.8 and adding 32 using the Math blocks.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">--- Scanning I2C Bus ---</field></shadow></value><next><block type=\"esp32_i2c_scan\"><next><block type=\"esp32_oled_clear\"><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">I2C SCAN COMPLETE</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Temp C: </field></shadow></value><value name=\"ADD1\"><block type=\"esp32_i2c_temp\"><field name=\"ADDR\">72</field></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering I2C Hardware Discovery: Understanding hardware execution and parameter changes.",
                "newBlock": "System Block"
            }
        ]
    },
    {
        "id": "19_mpu6050",
        "exampleId": "19",
        "title": "MPU6050 Motion & Tilt Alarm",
        "tier": "Master",
        "category": "Sensors",
        "icon": "Cpu",
        "color": "#E11D48",
        "bg": "#FFE4E6",
        "summary": "Wake up 6-DOF MEMS IMU registers, poll gravitational acceleration, and sound buzzer tilt alarms.",
        "overview": {
            "what": "The MPU6050 is a 6-Degrees-of-Freedom (6-DOF) Inertial Measurement Unit (IMU) combining a 3-axis accelerometer and a 3-axis gyroscope on a micro-silicon MEMS die.",
            "howItWorks": "Upon power-up, the MPU6050 starts in SLEEP mode to conserve energy. We must first wake it up by writing 0 to Power Management Register 107 (0x6B). Reading Register 0x3B then returns the 16-bit signed gravitational acceleration along the X-axis.",
            "realWorld": "Used in quadcopter flight controllers to stay level against wind, smartphone screen auto-rotation, Nintendo Wii remotes, and earthquake early detection alarms."
        },
        "pinout": [
            {
                "label": "MPU6050 ADDR",
                "pin": "0x68 (104)",
                "desc": "Primary I2C address"
            },
            {
                "label": "BUZZER",
                "pin": "GP33",
                "desc": "Acoustic tilt alarm trigger"
            }
        ],
        "terminology": [
            {
                "term": "MEMS",
                "def": "Micro-Electro-Mechanical Systems: microscopic vibrating silicon beams that detect microscopic inertial forces."
            },
            {
                "term": "Accelerometer",
                "def": "Measures proper acceleration in g's (including the static 1g acceleration of Earth's gravity)."
            },
            {
                "term": "6-DOF",
                "def": "6 Degrees of Freedom: 3 translational axes (X, Y, Z) and 3 rotational axes (Pitch, Roll, Yaw)."
            }
        ],
        "steps": [
            "1. Print initialization message to Serial Monitor.",
            "2. Send wake-up command: I2C Write to Addr 104, Register 107 with Value 0.",
            "3. Enter loop and read MPU6050 Accel X-axis (Register 0x3B).",
            "4. If X-axis acceleration exceeds 8000 (indicating tilt > 30 degrees): trigger Buzzer on Pin 33 and print '! TILT WARNING !' on OLED.",
            "5. If robot is level: turn off buzzer and display 'ROBOT LEVEL: OK'.",
            "6. Sample every 150ms for responsive anti-rollover monitoring."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Anti-Rollover Tilt Monitor",
                "desc": "Wake MPU6050, continuously poll gravitational tilt, and trigger acoustic buzzer alarms.",
                "challenge": "Change the monitored axis from X axis (0x3B) to Y axis (0x3D) to detect forward/backward pitch inclination.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Initializing MPU6050 Accel...</field></shadow></value><next><block type=\"esp32_i2c_write\"><field name=\"ADDR\">104</field><field name=\"REG\">107</field><value name=\"VALUE\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"controls_whileUntil\"><field name=\"MODE\">WHILE</field><value name=\"BOOL\"><block type=\"logic_boolean\"><field name=\"BOOL\">TRUE</field></block></value><statement name=\"DO\"><block type=\"controls_ifelse\"><value name=\"IF0\"><block type=\"logic_compare\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"esp32_i2c_mpu6050\"><field name=\"AXIS\">0x3B</field></block></value><value name=\"B\"><shadow type=\"math_number\"><field name=\"NUM\">8000</field></shadow></value></block></value><statement name=\"DO0\"><block type=\"esp32_digital_write\"><field name=\"PIN\">33</field><field name=\"STATE\">1</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">! TILT WARNING !</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></statement><statement name=\"ELSE\"><block type=\"esp32_digital_write\"><field name=\"PIN\">33</field><field name=\"STATE\">0</field><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">ROBOT LEVEL: OK</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></statement><next><block type=\"wait_ms\"><value name=\"MS\"><shadow type=\"math_number\"><field name=\"NUM\">150</field></shadow></value></block></next></block></statement></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Anti-Rollover Tilt Monitor: Understanding hardware execution and parameter changes.",
                "newBlock": "Sensors Block"
            }
        ]
    },
    {
        "id": "20_arrays_data",
        "exampleId": "20",
        "title": "Array Data Logging & Statistical Mean",
        "tier": "Master",
        "category": "Data",
        "icon": "Database",
        "color": "#2563EB",
        "bg": "#DBEAFE",
        "summary": "Collect multi-sensor data into indexed lists, compute arithmetic average values, and display telemetry.",
        "overview": {
            "what": "Sensors are subject to electrical noise and mechanical vibrations. Real engineering systems collect multiple samples into an array (list) and compute statistical averages to filter out outliers before making safety-critical decisions.",
            "howItWorks": "The 'Create List With' block builds a Python list containing readings from Sensor 1, Sensor 2, and Sensor 3. The 'Average of List' math block computes the arithmetic mean: Mean = (S1 + S2 + S3) / 3, producing a stabilized filtered sensor output.",
            "realWorld": "Used in flight computer air data sensors (Boeing/Airbus pitot tubes), stock market moving average algorithms, medical pulse oximeters, and seismograph earthquake filtering."
        },
        "pinout": [
            {
                "label": "SN1, SN2, SN3",
                "pin": "GP34, GP35, GP32",
                "desc": "Multi-channel analog sensor inputs"
            }
        ],
        "terminology": [
            {
                "term": "Array / List",
                "def": "An ordered collection of data elements that can be processed, searched, and mathematically aggregated."
            },
            {
                "term": "Arithmetic Mean",
                "def": "The sum of all values divided by the total count of values (the average)."
            },
            {
                "term": "Noise Filtering",
                "def": "Using statistics to cancel out random electrical spikes and mechanical jitter."
            }
        ],
        "steps": [
            "1. Initialize data collection with a Serial status announcement.",
            "2. Use 'Set [readings] to List [Sensor 1, Sensor 2, Sensor 3]' to take simultaneous snapshots of 3 distinct sensor ports.",
            "3. Clear the OLED screen to display fresh telemetry.",
            "4. Calculate and display the filtered average with 'Average of List [readings]' on row 2 of the OLED.",
            "5. Log the calculated average to the Serial Monitor with 'Serial Print Label: Average'.",
            "6. Wait 2 seconds before taking the next data sample."
        ],
        "levels": [
            {
                "level": 1,
                "name": "Multi-Sensor Averaging",
                "desc": "Snapshot 3 sensors into a list, compute their mathematical mean, and log results.",
                "challenge": "Change the math operation from 'Average' to 'Maximum' to build a peak detector that reports the highest reading.",
                "xml": "<xml><block type=\"robot_sketch\" x=\"50\" y=\"50\"><next><block type=\"esp32_serial_print\"><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">Sampling Sensor Array...</field></shadow></value><next><block type=\"variables_set\"><field name=\"VAR\">readings</field><value name=\"VALUE\"><block type=\"lists_create_with\"><mutation items=\"3\"></mutation><value name=\"ADD0\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">1</field></block></value><value name=\"ADD1\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">2</field></block></value><value name=\"ADD2\"><block type=\"esp32_sensor_read\"><field name=\"PORT\">3</field></block></value></block></value><next><block type=\"esp32_oled_clear\"><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><shadow type=\"text\"><field name=\"TEXT\">SENSOR DATA LOG</field></shadow></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"esp32_oled_print\"><field name=\"SIZE\">1</field><value name=\"TEXT\"><block type=\"text_join\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><shadow type=\"text\"><field name=\"TEXT\">Avg Value: </field></shadow></value><value name=\"ADD1\"><block type=\"math_on_list\"><field name=\"OP\">AVERAGE</field><value name=\"LIST\"><block type=\"variables_get\"><field name=\"VAR\">readings</field></block></value></block></value></block></value><value name=\"LINE\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value><next><block type=\"esp32_serial_print_var\"><field name=\"LABEL\">Average</field><value name=\"VAL\"><block type=\"math_on_list\"><field name=\"OP\">AVERAGE</field><value name=\"LIST\"><block type=\"variables_get\"><field name=\"VAR\">readings</field></block></value></block></value><next><block type=\"wait_seconds\"><value name=\"SECONDS\"><shadow type=\"math_number\"><field name=\"NUM\">2</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>",
                "whatYouLearn": "Mastering Multi-Sensor Averaging: Understanding hardware execution and parameter changes.",
                "newBlock": "Data Block"
            }
        ]
    }
];
