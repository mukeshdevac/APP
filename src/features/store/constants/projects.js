export const PROJECTS = [
    {
        id: 'intro-to-robotics',
        title: 'Introduction to Robotics',
        category: 'Basics',
        description: 'Discover what robotics is, how it works, and why it is the career of the future.',
        longDescription: 'This foundational module explores the exciting world of Robotics. We cover the core definition of a robot, trace the explosive growth of automation in recent years, explore the dizzying array of robot types (from drones to humanoids), and highlight the critical importance of self-learning in this rapidly expanding multi-disciplinary career field.',
        level: 'Beginner',
        time: '20 min',
        image: '/images/education/robotics_intro_future.png',
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "🤖 What is Robotics & How Does it Work?",
                    content: [
                        "Robotics is the intersection of computer science, mechanical engineering, and electronics. The fundamental definition of a robot relies on the Sense-Think-Act paradigm.",
                        "1. Sense: The robot uses sensors (like cameras, LiDAR, LDRs, or Ultrasonic sensors) to gather real-time data about its environment.",
                        "2. Think: The 'brain' (a microcontroller or computer) processes this data using code and algorithms to make a decision.",
                        "3. Act: The robot uses actuators (like motors or servos) to perform a physical action in the real world.",
                        "If a machine doesn't do all three, it's just a remote-controlled toy or a simple computer. True robots are autonomous!"
                    ],
                    image: "/images/education/robotics_intro_future.png"
                },
                {
                    title: "📈 The Future & Actual Growth",
                    content: [
                        "Robotics is no longer science fiction; it is driving the Fourth Industrial Revolution. The growth curve is exponential.",
                        "In the early 2000s, robots were mostly confined to car factory cages. Today, driven by advances in Artificial Intelligence and cheaper manufacturing, robots are entering our homes, skies, and hospitals.",
                        "Global robot deployments have more than tripled in the last decade. As AI gets smarter, robots are becoming less like 'programmed machines' and more like 'intelligent assistants', solving labor shortages and taking on dangerous tasks."
                    ],
                    image: "/images/education/robotics_growth.png"
                },
                {
                    title: "🦾 Different Types of Robots",
                    content: [
                        "The word 'Robot' covers a massive variety of machines depending on their shape and physical mechanics:",
                        "- Articulated Arms: The classic 6-axis factory robots used for welding, painting, and precision assembly.",
                        "- Mobile Robots (AMRs/AGVs): Wheeled robots that navigate warehouses, deliver food, or patrol areas (like Amazon's Kiva bots).",
                        "- Humanoids & Quadrupeds: Biologically inspired robots designed to navigate environments built for humans and animals (like Boston Dynamics' Atlas and Spot).",
                        "- UAVs & Drones: Flying robots used for aerial mapping, agriculture, and defense."
                    ],
                    image: "/images/education/robotics_types.png"
                },
                {
                    title: "🌍 Domains and Applications",
                    content: [
                        "Because of the different physical types, robots are highly specialized for specific industries:",
                        "- Medical & Healthcare: Surgical robots like the Da Vinci system perform extremely delicate, minimally invasive surgeries.",
                        "- Space Exploration: Rovers like Perseverance are autonomous planetary geologists surviving brutal Martian conditions.",
                        "- Agriculture: Automated tractors and precision drone sprayers are reshaping how we grow our food to feed a growing planet.",
                        "- Defense & Rescue: Bomb-disposal robots and search-and-rescue snake robots go where humans simply cannot survive."
                    ],
                    image: "/images/education/robotics_domains.png"
                },
                {
                    title: "🎓 Career & The Importance of Self-Learning",
                    content: [
                        "A career in robotics is incredibly rewarding because it requires a multi-disciplinary approach: you must learn code (Software), electronics (Hardware), and physics (Mechanics).",
                        "Because the field changes so incredibly fast—with new AI models and microchips releasing every few months—traditional degrees often become outdated quickly.",
                        "Self-learning is the most important skill you can have. Participating in open-source projects, experimenting with microcontrollers, and learning to read technical documentation are the real keys to becoming a world-class Robotics Engineer."
                    ],
                    image: "/images/education/robotics_career.png"
                }
            ],
            learningOutcomes: [
                "Understand the core 'Sense-Think-Act' paradigm that defines all true robots",
                "Recognize the different physical classifications of robots and their specific industry use-cases",
                "Appreciate the massive economic growth of the industry and the necessity of self-guided, multi-disciplinary learning"
            ],
            mcqs: [
                {
                    question: "What are the three required steps for a machine to be considered a true autonomous robot?",
                    options: ["Look, Listen, Speak", "Sense, Think, Act", "Battery, Motor, Wheels", "Code, Compile, Run"],
                    correctIndex: 1,
                    explanation: "A true robot must Sense its environment, Think about the data, and Act upon it physically!"
                },
                {
                    question: "Which type of robot is most commonly used for welding and painting in car factories?",
                    options: ["Humanoids", "UAV Drones", "Articulated Arms (6-Axis)", "Mobile Rovers"],
                    correctIndex: 2,
                    explanation: "Articulated robotic arms excel at repetitive, precise tasks in constrained manufacturing environments."
                },
                {
                    question: "Why is self-learning considered so critical in the robotics industry?",
                    options: ["Because colleges don't teach math anymore", "Because the technology (AI, Sensors) evolves faster than traditional curriculums can adapt", "Because robots can only learn from themselves", "Because books are too expensive"],
                    correctIndex: 1,
                    explanation: "The field of AI and robotics moves so fast that continuous, self-guided learning is required to stay up-to-date with state-of-the-art tech!"
                }
            ]
        }
    },
    {
        id: 'basics-of-electricity',
        title: 'Basics of Electricity',
        category: 'Basics',
        description: 'Discover the invisible force that powers the modern world: from ancient amber to modern circuits.',
        longDescription: 'Before you can build complex robots, you must understand the invisible fuel that brings them to life: Electricity. This foundational, theory-only module covers the history of electrical discovery, the atomic nature of electrons, and the core concepts of Current, Voltage, and Resistance.',
        level: 'Beginner',
        time: '15 min',
        image: '/images/education/elec_origins.png',
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "🏛️ The Origins: Amber & Lightning",
                    content: [
                        "Long before batteries and lightbulbs, ancient peoples interacted with electricity in raw forms like static shocks and lightning strikes.",
                        "Around 600 BC, the ancient Greeks discovered that rubbing fossilized tree resin (called Amber) with animal fur would allow the amber to attract light objects like feathers. The Greek word for amber is 'Elektron'.",
                        "For thousands of years, this was just considered a magical property of amber. It wasn't until scientists like Benjamin Franklin began studying lightning in the 1700s that humanity realized static cling and massive lightning bolts were the exact same physical phenomenon!"
                    ],
                    image: "/images/education/elec_origins.png"
                },
                {
                    title: "⚛️ What is Current? (Flowing Electrons)",
                    content: [
                        "Everything in the universe is made of tiny atoms. Inside atoms are even tinier particles called Electrons, which have a negative charge.",
                        "In metals like copper, the outer electrons are loosely held by the atom. If we push them, they can easily jump from one atom to the next. We call these 'Free Electrons'.",
                        "When millions of these free electrons start flowing through a wire in the same direction, like water flowing through a hose, we call it Electric Current.",
                        "Electricity isn't a magical energy; it is literally the physical movement of tiny particles through a material."
                    ],
                    image: "/images/education/elec_current.png"
                },
                {
                    title: "🌊 What is Voltage? (Potential Difference)",
                    content: [
                        "If a copper wire is full of free electrons, why aren't they always moving? Because they need a push!",
                        "Voltage is the electrical 'pressure' that forces electrons to move. Think of a water tank connected to a hose: a taller tank has more water pressure pushing the water out.",
                        "A battery works like an electrical water pump. It piles up negative electrons at one end (the negative terminal). Because negative charges repel each other, they 'want' to escape to the positive terminal. This desire to flow from High Potential to Low Potential is called Voltage."
                    ],
                    image: "/images/education/elec_voltage.png"
                },
                {
                    title: "🧱 What is Resistance?",
                    content: [
                        "As electrons flow through a wire, they bump into the atoms of the material. Every bump slows them down and generates a tiny bit of heat.",
                        "This physical opposition to the flow of electrons is called Resistance. Water flowing through a wide, smooth pipe has low resistance. Water squeezing through a narrow, clogged pipe has high resistance.",
                        "Materials with very low resistance (like Copper and Gold) are called Conductors. Materials with incredibly high resistance (like Rubber and Glass) completely block electron flow, and are called Insulators."
                    ],
                    image: "/images/education/elec_resistance.png"
                },
                {
                    title: "📏 Units of Measurement (Amps, Volts, Ohms, Coulombs)",
                    content: [
                        "To engineer circuits safely, we must measure electricity precisely using these standard units:",
                        "1. Coulomb (C): A massive 'bucket' of charge. 1 Coulomb equals roughly 6,242,000,000,000,000,000 electrons!",
                        "2. Ampere (A): The measurement of Current. 1 Ampere means exactly 1 Coulomb of electrons is flowing past a specific point every single second.",
                        "3. Volt (V): The measurement of electrical pressure (Voltage) pushing those Amps.",
                        "4. Ohm (Ω): The measurement of Resistance fighting back against the flow of those Amps."
                    ],
                    image: "/images/education/elec_units.png"
                }
            ],
            learningOutcomes: [
                "Understand the historical discovery and atomic nature of static and flowing electricity",
                "Explain the relationship between Voltage (Pressure), Current (Flow), and Resistance (Friction)",
                "Define the common physical units of measurement used in electronics engineering"
            ],
            mcqs: [
                {
                    question: "What ancient material gave electricity its name?",
                    options: ["Gold", "Silver", "Amber (Elektron)", "Iron"],
                    correctIndex: 2,
                    explanation: "The ancient Greeks rubbed amber (elektron) with fur to create static shocks, giving us the root word for electricity!"
                },
                {
                    question: "If Voltage is like water pressure pushing through a pipe, what represents the physical movement of the water passing a single point over time?",
                    options: ["Resistance", "Current", "Ohms", "The Battery"],
                    correctIndex: 1,
                    explanation: "Current (measured in Amps) represents the actual flow or volume of electrons passing through the circuit!"
                },
                {
                    question: "Which of the following describes an Insulator?",
                    options: ["A material with extremely high Resistance that blocks electron flow", "A material that allows thousands of free electrons to jump easily", "A glowing wire that produces heat", "The container holding a battery"],
                    correctIndex: 0,
                    explanation: "Insulators, like rubber or dry wood, hold onto their electrons very tightly, providing massive Resistance against electrical flow!"
                }
            ]
        }
    },
    {
        id: 'series-and-parallel-circuits',
        title: 'Series & Parallel Circuits',
        category: 'Basics',
        description: 'Understand the two fundamental ways to route electricity and power your robotic components.',
        longDescription: 'Every electronic device, from a simple flashlight to the complex motherboard of a supercomputer, relies on routing electricity through specific pathways. This foundational module explores how we connect components and power sources in Series and Parallel configurations to achieve different voltage, current, and behavioral results.',
        level: 'Beginner',
        time: '15 min',
        image: '/images/education/circuits_loop.png',
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "🔄 The Closed Loop",
                    content: [
                        "For electricity to do any useful work—like spinning a motor or lighting an LED—it must have a continuous, unbroken path to follow.",
                        "This path must always start at the high-pressure side of a power source (the positive terminal of a battery), travel through the components (the load), and return to the low-pressure side (the negative terminal or Ground).",
                        "If this loop is broken anywhere by a disconnected wire or an open switch, the electrons instantly stop flowing everywhere in the circuit. This is an Open Circuit. When the loop is complete, it is a Closed Circuit."
                    ],
                    image: "/images/education/circuits_loop.png"
                },
                {
                    title: "🛤️ Components in Series",
                    content: [
                        "A Series connection is like stringing components end-to-end on a single straight path. There are no branches or alternate routes.",
                        "Because there is only one path, the exact same Current (Amps) flows through every single component. However, the electrical pressure (Voltage) is divided among the components.",
                        "The biggest drawback to a series circuit is that if one component breaks—like a single bulb in an old string of Christmas lights—the entire circuit path is broken, and every other component turns off immediately."
                    ],
                    image: "/images/education/circuits_series.png"
                },
                {
                    title: "🔀 Components in Parallel",
                    content: [
                        "A Parallel connection provides multiple branching pathways for the electricity to flow, much like the plumbing pipes running to different sinks in a house.",
                        "In this setup, the Voltage (pressure) is identical across all branches, but the Current (flow) splits up depending on the resistance of each path.",
                        "This is how houses and modern electronics are wired. Because each component has its own independent loop back to the power source, if one bulb breaks or is turned off, the other branches remain completely unaffected and stay on."
                    ],
                    image: "/images/education/circuits_parallel.png"
                },
                {
                    title: "🔋 Batteries in Series",
                    content: [
                        "Just like components, power sources can be connected in different ways to change their behavior.",
                        "When you stack batteries end-to-end (connecting the positive terminal of one to the negative terminal of the next), they are in Series. This adds their Voltages together to create a stronger 'push'.",
                        "For example, placing four standard 1.5 Volt AA batteries end-to-end creates a total output of 6 Volts. This is perfect for driving power-hungry motors that require higher electrical pressure."
                    ],
                    image: "/images/education/batteries_series.png"
                },
                {
                    title: "🔋 Batteries in Parallel",
                    content: [
                        "When you connect batteries side-by-side (connecting all positive terminals together, and all negative terminals together), they are in Parallel.",
                        "In this configuration, the total Voltage remains exactly the same as a single battery. However, their Current Capacities (Amp-hours) add together.",
                        "If you have a 3.7 Volt lithium cell and wire 5 of them in parallel, the output is still 3.7 Volts, but the battery pack will last 5 times longer before needing a recharge. This is how electric car battery packs are built to survive long road trips."
                    ],
                    image: "/images/education/batteries_parallel.png"
                }
            ],
            learningOutcomes: [
                "Diagnose the difference between Open and Closed electrical circuits",
                "Explain how Voltage and Current behave differently across Series and Parallel component branches",
                "Design basic battery pack configurations to achieve a targeted Voltage or runtime Capacity"
            ],
            mcqs: [
                {
                    question: "If you have three LEDs wired in Series and the middle LED breaks, what happens to the other two?",
                    options: ["They get brighter", "They stay exactly the same", "They turn off completely", "They start flashing"],
                    correctIndex: 2,
                    explanation: "In a Series circuit, there is only one pathway. If any component breaks the path, the entire circuit becomes Open and everything stops working!"
                },
                {
                    question: "How are the electrical outlets in a house wired so that turning off the TV doesn't turn off the refrigerator?",
                    options: ["In Series", "In Parallel", "Using alternating current", "Using a single large battery"],
                    correctIndex: 1,
                    explanation: "Houses are wired in Parallel, providing independent branching pathways for every room and appliance!"
                },
                {
                    question: "If you need exactly 12 Volts for a robot, but you only have basic 1.5 Volt AA batteries, how should you connect them?",
                    options: ["8 batteries side-by-side in Parallel", "8 batteries end-to-end in Series", "4 batteries in Series", "12 batteries in Parallel"],
                    correctIndex: 1,
                    explanation: "Connecting 8 batteries in Series adds their voltages together: 1.5V x 8 = 12 Volts of electrical pressure!"
                }
            ]
        }
    },
    {
        id: 'ten-blocks-intro',
        title: 'TEN Blocks Introduction',
        category: 'Basics',
        description: 'Meet the special blocks that bring your robot to life!',
        longDescription: 'Welcome to the world of TEN Robotics! This introductory lesson will teach you how to use our custom coding blocks. You don\'t need to be a professional coder—just snap the blocks together like LEGO and watch your robot react in real-time.',
        level: 'Beginner',
        time: '10 min',
        image: '/images/education/blocks_hero.png',
        sourceDirectory: '/projects/ten-blocks-intro/',
        filesToUpload: ['app.py'],
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "👋 Welcome, Young Creators!",
                    content: [
                        "Coding is like giving a magic set of instructions to a friend. Instead of a human friend, your friend is the TEN Robot!",
                        "We use Blocks because they are easy to see and hard to break. If two blocks don't fit together, it's the robot saying 'Hey, that doesn't make sense!'",
                        "Every program starts with the yellow [ 🚀 CODE SKETCH ] block. Everything you snap underneath it is what the robot will do, from top to bottom."
                    ],
                    image: "/images/education/blocks_intro_kids.png"
                },
                {
                    title: "👀 Making Eye Contact",
                    content: [
                        "The robot's face is where it shows its feelings. Use the [ 👁️ Eyes [blink ▼] ] block to make it blink, look happy, or even look surprised!",
                        "The [ 🖼️ Show Emoji [heart ▼] ] block lets you display big pictures like hearts or skulls on the screen. It's a great way to give your robot a personality."
                    ],
                    image: "/images/education/eyes_blocks.png"
                },
                {
                    title: "🏎️ Moving and Grooving",
                    content: [
                        "To move your robot, use the [ ⚙️ Set Motor [1 ▼] [FWD ▼] ] block. You can choose which motor to turn, the direction (Forward or Backward), and the speed (0 to 100).",
                        "The [ 🧭 Set Servo [1 ▼] to Angle ( 90 ) ] block is for precise movements, like turning a robotic arm or moving the robot's head to look around."
                    ],
                    image: "/images/education/movement_blocks.png"
                },
                {
                    title: "👂 Sensing the World",
                    content: [
                        "Robots need to 'see' and 'hear' just like we do. The [ 📏 Read Ultrasonic [D23 ▼] [D32 ▼] ] block is like a bat's ears—it uses sound to measure how far away an object is.",
                        "The [ 📊 Sensor [1 ▼] (%) ] block tells you how much of something is happening (like light or touch), shown as a simple number from 0 to 100."
                    ],
                    image: "/images/education/sensor_blocks.png"
                },
                {
                    title: "⏳ Timing is Everything",
                    content: [
                        "Computers are very fast! Without a [ ⏳ Wait ( 1 ) Seconds ] block, your robot will try to do everything at once. Adding a 1-second wait gives the robot (and you) time to see what's happening."
                    ],
                    image: "/images/education/wait_block_demo.png"
                }
            ],
            learningOutcomes: [
                "Understand how to snap blocks together to build a sequence",
                "Learn the difference between movement blocks and sensing blocks",
                "Know how to give your robot a personality using the OLED display"
            ],
            mcqs: [
                {
                    question: "In what order does the robot read the blocks?",
                    options: ["Bottom to top", "Left to right", "Top to bottom", "Randomly"],
                    correctIndex: 2,
                    explanation: "Code blocks are executed in sequence from top to bottom!"
                },
                {
                    question: "Which block would you use to measure distance?",
                    options: ["Set Motor", "Ultrasonic", "OLED Print", "Eyes"],
                    correctIndex: 1,
                    explanation: "The Ultrasonic sensor block is used to detect how far away an object is!"
                }
            ]
        }
    },
    {
        id: 'blink-led',
        title: 'Blink LED',
        category: 'Getting Started',
        description: 'Blink the built-in LED on Pin 2.',
        longDescription: 'This is the classic "Hello World" of hardware programming. It toggles the onboard blue LED on Pin 2 and prints the status to the serial console and OLED display.',
        level: 'Beginner',
        time: '5 min',
        image: '/images/education/microcontroller_led.png',
        sourceDirectory: '/projects/blink-led/',
        filesToUpload: ['app.py', 'src/blink_main.py'],
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "What is an LED?",
                    content: "LED stands for Light Emitting Diode. It’s like a tiny, super-efficient light bulb that only works in one direction. They are everywhere—from your TV screen to the traffic lights on the street!",
                    image: "/images/education/led_bulb.png"
                },
                {
                    title: "Manual Control (Switches)",
                    content: [
                        "Before programming, we understand control through physical switches. When you flip a light switch, you physically close a circuit, allowing electricity from the power source to flow through the LED, turning it on.",
                        "If you turn it off, you break the circuit. It's a simple, manual action that requires a human to perform. But what if we want to turn it on and off 10 times a second? That's where microcontrollers come in."
                    ],
                    image: "/images/education/switch_circuit.png"
                },
                {
                    title: "Microcontroller Control",
                    content: [
                        "Instead of a physical flip switch, a microcontroller (like the ESP32) acts as an electronic, programmable switch.",
                        "By writing code like `led.value(1)`, we instruct the microcontroller to internally connect the circuit layout and send 3.3 Volts to the LED. This gives us the power to control physical hardware thousands of times a second with precise timing, using loops and delays."
                    ],
                    image: "/images/education/microcontroller_led.png"
                },
                {
                    title: "The Base for Everything",
                    content: [
                        "Blinking an LED is the software engineer's 'Hello World'. It's the simplest way to prove your code can control the physical world. If you can blink an LED, you can control a motor, open an electronic lock, or light up an entire city grid!",
                        "At the most fundamental level, computers only understand two states: ON (1) and OFF (0). The blinking LED proves you have mastered both."
                    ],
                    image: "/images/education/led_daily_life.png"
                }
            ],
            learningOutcomes: [
                "Understand the difference between manual and programmable switches",
                "Learn how to control an Output Pin to send electricity",
                "Understand how the simple ON/OFF state is the foundation of digital logic"
            ],
            mcqs: [
                {
                    question: "What does LED stand for?",
                    options: ["Light Electronic Device", "Light Emitting Diode", "Lower Energy Display", "Long Electric Drive"],
                    correctIndex: 1,
                    explanation: "LED stands for Light Emitting Diode!"
                },
                {
                    question: "Why do we use microcontrollers instead of just a manual switch?",
                    options: ["They save electricity", "They are cheaper", "They allow us to program automatic and precise timing", "They make the light brighter"],
                    correctIndex: 2,
                    explanation: "Microcontrollers let us write code to control circuits automatically, doing things humans can't do manually (like blinking 10 times a second)."
                },
                {
                    question: "Where might you see the concepts of a blinking light circuit used in real life?",
                    options: ["A car's turn signal indicator", "A book's printed page", "A wooden chair", "A glass window"],
                    correctIndex: 0,
                    explanation: "Car turn signals use blinker circuits exactly like this to flash LEDs on and off, indicating to other drivers which way you are turning!"
                }
            ]
        }
    },
    {
        id: 'ldr-sensor-masterclass',
        title: 'LDR: The Robot\'s Light-Sensor',
        category: 'Sensors',
        description: 'Teach your robot to stay awake in the light and "sleep" in the dark!',
        longDescription: 'The LDR (Light Dependent Resistor) is a simple but powerful component that lets robots detect brightness. In this lesson, you\'ll learn how it works, explore how smart street lights work, and build your own automatic light detector.',
        level: 'Intermediate',
        time: '15 min',
        image: '/images/education/ldr_sensor_detail.png',
        sourceDirectory: '/projects/ldr-sensor-masterclass/',
        filesToUpload: ['app.py'],
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "🌞 Meet the LDR",
                    content: [
                        "LDR stands for Light Dependent Resistor. It's a special type of component that changes how much electricity it lets through based on how much light is hitting it.",
                        "If you look closely, you\'ll see a tiny zigzag path on top. That\'s where the magic happens!"
                    ],
                    image: "/images/education/ldr_sensor_detail.png"
                },
                {
                    title: "⚡ Light vs Resistance",
                    content: [
                        "When light photons hit the LDR, they push electrons around and make it easier for electricity to flow. This means when it is BRIGHT, the resistance is LOW.",
                        "In the dark, it\'s much harder for electricity to pass through, so the resistance is HIGH. Your robot reads this as a percentage from 0 to 100!"
                    ],
                    image: "/images/education/ldr_day_night_demo.png"
                },
                {
                    title: "💡 Smart City Lights",
                    content: [
                        "Have you ever wondered how street lights know when to turn on? They use LDRs! When the sun sets and the light level drops below a certain point, the LDR tells the computer to flip the switch.",
                        "Your Ten Robot can do the same thing to become a smart night-light!"
                    ],
                    image: "/images/education/ldr_street_light.png"
                },
                {
                    title: "💻 LDR Block Coding",
                    content: [
                        "To read light levels, use the [ 📊 Sensor [1 ▼] (%) ] block. Snap it into an IF block to check if the light is low.",
                        "Try making your robot look sad or sleepy with the [ 👁️ Eyes [blink ▼] ] block when the room gets dark. It\'s like the robot is going to sleep!"
                    ],
                    image: "/images/education/ldr_sensor_detail.png",
                    blocklyXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><statement name="DO0"><block type="esp32_eyes_blink"></block></statement></block></next></block></xml>'
                }
            ],
            learningOutcomes: [
                "Understand the relationship between light and electrical resistance",
                "Learn how to interpret analog sensor data as percentages",
                "Build a project that reacts automatically to the environment"
            ],
            mcqs: [
                {
                    question: "What happens to LDR resistance when the environment gets BRIGHTER?",
                    options: ["Resistance goes UP", "Resistance goes DOWN", "Resistance stays the same", "The LDR explodes"],
                    correctIndex: 1,
                    explanation: "More light makes it easier for electricity to flow, so resistance goes DOWN!"
                },
                {
                    question: "Which real-world device commonly uses an LDR?",
                    options: ["A toaster", "An automatic street light", "A bicycle wheel", "A wooden door"],
                    correctIndex: 1,
                    explanation: "Street lights use LDRs to detect when it's dark enough to turn on!"
                }
            ]
        }
    },
    {
        id: 'ir-sensor-masterclass',
        title: 'IR Sensor Masterclass',
        category: 'Sensors',
        description: 'Learn how your robot "sees" invisible light!',
        longDescription: 'Infrared (IR) sensors are the secret eyes of many robots. In this module, you\'ll learn how infrared light bounces off objects to detect them, why black surfaces are invisible to these sensors, and how to use blocks to build a smart detection system.',
        level: 'Intermediate',
        time: '15 min',
        image: '/images/education/ir_sensor_guide.png',
        sourceDirectory: '/projects/ir-sensor-masterclass/',
        filesToUpload: ['app.py'],
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "🔦 The Invisible Flashlight",
                    content: [
                        "An IR sensor is like a tiny flashlight that humans can't see. It's made of two parts: an IR LED (the Emitter) and a Photodiode (the Receiver).",
                        "The Emitter shoots out a beam of invisible light. The Receiver waits to see if that light bounces back!"
                    ],
                    image: "/images/education/ir_components_detail.png"
                },
                {
                    title: "🏓 The Bouncing Beam",
                    content: [
                        "When your robot gets close to a white or light-colored object, the IR light bounces off it like a ball hitting a wall. The Receiver 'sees' the light, and your code reports a hit!",
                        "This is perfect for following lines or stopping before hitting a wall."
                    ],
                    image: "/images/education/ir_reflection_demo.png"
                },
                {
                    title: "🕳️ The Black Body Mystery",
                    content: [
                        "Why can't IR sensors see black objects? It's because black surfaces are like sponges—they soak up almost all the light instead of reflecting it.",
                        "In physics, we call this a Black Body. When the IR beam hits something jet black, the light never bounces back to the receiver. To the robot, it's like the object isn't even there!"
                    ],
                    image: "/images/education/ir_black_body_demo.png"
                },
                {
                    title: "💻 Practice with Blocks",
                    content: [
                        "To use your IR sensor, use the [ 📊 Sensor [1 ▼] (%) ] block. It gives you a number between 0 and 100 based on how much light is bouncing back.",
                        "Try connecting a [ 📝 OLED Print [Hello ▼] ] block to show the sensor value on your robot's screen. If it's near a white paper, the number will be HIGH. If it's near a black surface, it will be LOW!"
                    ],
                    image: "/images/education/ir_sensor_guide.png",
                    blocklyXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="robot_sketch" x="50" y="50"><next><block type="esp32_oled_clear"><next><block type="esp32_oled_print"><value name="TEXT"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></next></block></next></block></xml>'
                }
            ],
            learningOutcomes: [
                "Understand the Physics of Infrared light (Emitter vs Receiver)",
                "Learn why black surfaces absorb light (The Black Body Concept)",
                "Build a simple object detection script using Sensor and OLED blocks"
            ],
            mcqs: [
                {
                    question: "Why does an IR sensor NOT detect a jet black surface?",
                    options: ["The surface is too hard", "The surface absorbs the IR light", "The light passes through the surface", "Black is the robot's favorite color"],
                    correctIndex: 1,
                    explanation: "Black surfaces absorb almost all the light, so nothing bounces back for the sensor to detect!"
                },
                {
                    question: "What are the two main parts of an IR sensor?",
                    options: ["Speaker and Mic", "Battery and Motor", "Emitter and Receiver", "Eyes and Ears"],
                    correctIndex: 2,
                    explanation: "It needs an Emitter to send the light and a Receiver to pick it up!"
                }
            ]
        }
    },
    {
        id: 'bo-motor-masterclass',
        title: 'BO Motors: The Robot\'s Muscles',
        category: 'Robotics',
        description: 'Learn how to control speed, direction, and torque with BO gear motors.',
        longDescription: 'Every robot needs a way to move. BO (Battery Operated) Gear Motors are the industry standard for educational robotics. In this lesson, you\'ll dive into DC motor physics, explore why gearboxes are essential for torque, and master the blocks needed to drive your robot in any direction.',
        level: 'Intermediate',
        time: '20 min',
        image: '/images/education/bo_motor_detail.png',
        sourceDirectory: '/projects/bo-motor-masterclass/',
        filesToUpload: ['app.py'],
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "⚙️ What is a BO Motor?",
                    content: [
                        "A BO Motor is a combination of two things: a high-speed DC motor and a plastic gearbox. Together, they create the 'muscles' that turn your robot's wheels.",
                        "Because the motor is Battery Operated, it's safe and easy for beginners to use in their projects!"
                    ],
                    image: "/images/education/bo_motor_detail.png"
                },
                {
                    title: "⚡ The Power of Gears",
                    content: [
                        "Tiny DC motors spin extremely fast, but they aren't strong enough to move a heavy robot. That's where the GEARS come in!",
                        "The internal gearbox trades 'Speed' for 'Strength' (called Torque). It slows down the spin but makes it much stronger, allowing your robot to carry weight and climb obstacles."
                    ],
                    image: "/images/education/motor_gears.png"
                },
                {
                    title: "🏎️ Steering the Robot",
                    content: [
                        "By controlling two BO motors separately, you can steer your robot like a tank. To go forward, turn both the same way. To spin in place, turn one forward and one backward!",
                        "This is called Differential Drive, and it's how almost all mobile robots navigate."
                    ],
                    image: "/images/education/robot_drive_demo.png"
                },
                {
                    title: "💻 Motor Block Coding",
                    content: [
                        "To start moving, use the [ ⚙️ Set Motor [1 ▼] [FWD ▼] ] block. You can set the speed from 0 (Stop) to 100 (Turbo!).",
                        "Don't forget to add a [ ⏳ Wait ( 1 ) Seconds ] block after starting your motors, or else the robot will stop before it even starts moving!"
                    ],
                    image: "/images/education/bo_motor_detail.png"
                }
            ],
            learningOutcomes: [
                "Understand the difference between a simple DC motor and a Gear Motor",
                "Learn the concept of Torque and why gearboxes are used",
                "Master the code sequence to move, turn, and stop a 2-wheel robot"
            ],
            mcqs: [
                {
                    question: "What does the Gearbox inside a BO motor do?",
                    options: ["Makes the motor spin faster", "Trades speed for strength (Torque)", "Changes the motor's color", "Recharges the battery"],
                    correctIndex: 1,
                    explanation: "Gearboxes reduce speed to increase Torque, giving the robot the power to move its own weight!"
                },
                {
                    question: "If you want the robot to turn left, what should your motors do?",
                    options: ["Both spin forward", "Both spin backward", "One spins forward, one spins backward", "Both stop completely"],
                    correctIndex: 2,
                    explanation: "Spinning motors in opposite directions causes the robot to rotate in place!"
                }
            ]
        }
    },
    {
        id: 'advanced-drive-systems',
        title: 'Advanced Robotics: Drive Systems',
        category: 'Robotics',
        description: 'Explore the high-torque gear systems powering robot dogs and space rovers.',
        longDescription: 'In this professional-grade module, we dive into the physics and engineering of advanced mechanical transmissions. You will learn about Planetary, Harmonic, and Cycloidal drives, and understand why different robots—from agile quadruped dogs to rugged Mars rovers—choose specific drive architectures for power, precision, and compliance.',
        level: 'Advanced',
        time: '30 min',
        image: '/images/education/planetary_drive.png',
        reviews: [],
        comments: [],
        educationalContent: {
            sections: [
                {
                    title: "🪐 Planetary Gears: The Compact Powerhouse",
                    content: [
                        "Planetary gears (also called epicyclic gears) are the most common high-torque-density drives in robotics. They consist of a central Sun gear, multiple revolving Planet gears, and an outer Ring gear.",
                        "Pros: Extremely compact, high torque-to-weight ratio, and the input/output shafts are coaxial (aligned).",
                        "Cons: More complex than simple gears, can generate heat at high speeds due to friction between multiple teeth.",
                        "Application: You'll find these in the legs of high-end robot dogs (like Boston Dynamics' Spot) because they allow for 'back-drivability', which lets the robot absorb impacts like a real animal."
                    ],
                    image: "/images/education/planetary_drive.png"
                },
                {
                    title: "🌊 Harmonic Drives: The Zero-Backlash Miracle",
                    content: [
                        "Harmonic drives (Strain Wave Gearing) are an engineering marvel. They use a flexible metal cup (Flexspline) that is deformed by an elliptical 'Wave Generator' to mesh with an outer ring.",
                        "Pros: Absolute ZERO backlash (no wiggle between gears), massive gear reduction (up to 100:1) in a single stage, and extreme precision.",
                        "Cons: Very expensive to manufacture, and the flexible cup can eventually suffer from fatigue or 'ratcheting' under extreme loads.",
                        "Application: Used in precision robotic arms (like those on the International Space Station) and high-end factory robots where every millimeter of accuracy counts."
                    ],
                    image: "/images/education/harmonic_drive.png",
                },
                {
                    title: "🌀 Cycloidal Drives: The Heavy-Duty Tank",
                    content: [
                        "Cycloidal drives use a unique wavy-edged disc that 'rolls' around a ring of pins. Because multiple teeth are always in contact, they are incredibly tough.",
                        "Pros: High shock resistance, compact size, and high efficiency.",
                        "Cons: Can be difficult to balance at very high speeds, which can cause vibration.",
                        "Application: Industrial robotic joints that need to carry heavy loads and survive collisions without breaking."
                    ],
                    image: "/images/education/cycloidal_drive.png",
                },
                {
                    title: "🐶 Robot Dog Actuators (QDD)",
                    content: [
                        "Modern quadruped robots use a special type of drive called Quasi-Direct Drive (QDD). These use powerful motors with low-ratio planetary gears (usually 6:1 or 10:1).",
                        "Why not 100:1? Because lower ratios are Compliant. This means if the robot hits the ground hard, the force can travel backwards through the gears and be absorbed by the motor's magnets instead of snapping the metal teeth!",
                        "This 'mechanical transparency' is what makes robot dogs look so fluid and lifelike when they jump or run."
                    ],
                    image: "/images/education/robot_dog_actuator.png",
                },
                {
                    title: "🛰️ Mars Rover: The Planetary Hub",
                    content: [
                        "On Mars, every watt of power is precious. Rovers like Perseverance use specialized Hub Planetary Gearboxes inside their titanium wheels.",
                        "The wheels use a 'Rocker-Bogie' suspension system to climb rocks, but the actual turning power comes from high-reduction planetary sets that provide massive torque to move through deep Martian sand at slow, steady speeds.",
                        "Fun Fact: These gears must work in temperatures as low as -125°C, using special dry lubricants because normal oil would freeze solid!"
                    ],
                    image: "/images/education/mars_rover_wheel.png",
                }
            ],
            learningOutcomes: [
                "Understand the mechanics of Planetary, Harmonic, and Cycloidal gear systems",
                "Learn the trade-offs between Torque, Precision, and Compliance in robotics",
                "Explore real-world engineering solutions for space exploration and bio-inspired robotics"
            ],
            mcqs: [
                {
                    question: "Which drive system is famous for having 'Zero Backlash'?",
                    options: ["Planetary Drive", "Simple Gear", "Harmonic Drive", "Chain Drive"],
                    correctIndex: 2,
                    explanation: "Harmonic drives use a flexible spline to eliminate the gap between teeth, providing zero backlash!"
                },
                {
                    question: "Why do robot dogs use low-ratio planetary gears?",
                    options: ["To save money", "To make them easier to back-drive and absorb shock (Compliance)", "To make them go faster than a car", "To make the robot bark louder"],
                    correctIndex: 1,
                    explanation: "Low-ratio gears allow force to flow both ways, protecting the robot's hardware from impact damage!"
                },
                {
                    question: "What is the primary advantage of a Cycloidal drive?",
                    options: ["It is the cheapest", "It is made of plastic", "High shock resistance and strength", "It uses magnets instead of teeth"],
                    correctIndex: 2,
                    explanation: "Cycloidal drives distribute force over many teeth, making them extremely resistant to heavy shocks!"
                }
            ]
        }
    },
    {
        id: 'rover-command-center',
        title: 'Rover Command Center',
        category: 'Robotics',
        description: 'Advanced wireless dashboard with dual-joystick controls.',
        longDescription: 'A professional-grade command center for your Rover. Includes an offline-first dashboard (index.html) and a high-performance Python server (app.py) for real-time differential drive over WiFi.',
        level: 'Advanced',
        time: '30 min',
        image: 'https://images.unsplash.com/photo-1546776230-bb86256870ce?auto=format&fit=crop&q=80&w=600',
        sourceDirectory: '/projects/rover-command-center/',
        filesToUpload: ['app.py', 'index.html'],
        reviews: [],
        comments: []
    }
];
