// ==============================================================================
// TEN ROBOTICS - BLOCK CODE ACADEMY LMS (MODULAR CURRICULUM REGISTRY)
// Designed for child self-navigation: bite-sized, interactive, lightweight.
// To add new modules in future, simply append a new module object to CURRICULUM_MODULES.
// ==============================================================================

export const CURRICULUM_MODULES = [
    {
        id: "01_intro_block_coding",
        number: 1,
        title: "Introduction to Block Code",
        subtitle: "How Blocks Work & How They Turn Into Real Python Code",
        badge: "Level 1 • Starter",
        tier: "Basic",
        color: "#6366F1",
        bg: "#EEF2FF",
        icon: "Sparkles",
        summary: "Learn what block code is, how computers read instructions top-to-bottom, and how snapping blocks teaches you real Python coding!",
        starterXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="robot_sketch" x="60" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Hello Robot World! 🚀</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">I just wrote my first block code!</field></shadow></value></block></next></block></next></block></next></block></xml>',
        steps: [
            {
                id: "meet_robo",
                stepNumber: 1,
                title: "Meet Robo-Ten!",
                badge: "Step 1 of 5",
                emoji: "🤖",
                headline: "What is Coding? Meet Your Robot Friend!",
                story: "Have you ever built a cool LEGO castle or followed a recipe to bake cookies? Coding is just like that! A computer or robot is super fast, but it cannot think for itself. It waits for YOU to give it friendly, step-by-step instructions.",
                tip: "A computer does exactly what you tell it to do, one step at a time! When you tell it what to do, you are the programmer!",
                illustrationType: "robot"
            },
            {
                id: "lego_blocks",
                stepNumber: 2,
                title: "The LEGO Blocks of Code",
                badge: "Step 2 of 5",
                emoji: "🧩",
                headline: "Snap Blocks Together Like Puzzle Pieces!",
                story: "In old-fashioned coding, if you misspell a word or forget a single comma, the whole program crashes with an error. But with Block Code, every command is a colorful block with interlocking notches and tabs! If two commands do not fit together, they won't snap. It is 100% puzzle-safe and impossible to break!",
                tip: "Notice how blocks have bumps and notches? They only snap together in ways that make sense!",
                illustrationType: "puzzle",
                interactiveType: "snap_demo"
            },
            {
                id: "reading_order",
                stepNumber: 3,
                title: "How Robots Read Blocks",
                badge: "Step 3 of 5",
                emoji: "⬇️",
                headline: "Top to Bottom, Like Reading a Comic Book!",
                story: "Robots read instructions in exact order from TOP to BOTTOM. First it executes Block 1, then Block 2, then Block 3! For example: 1) Turn light ON 💡 -> 2) Wait 1 second ⏳ -> 3) Turn light OFF 🌙. The robot never skips or forgets a step!",
                tip: "Computers never jump around randomly. They follow your steps in order from top to bottom!",
                illustrationType: "flow",
                interactiveType: "step_flow"
            },
            {
                id: "magic_bridge",
                stepNumber: 4,
                title: "The Magic Bridge to Python",
                badge: "Step 4 of 5",
                emoji: "✨",
                headline: "How Blocks Turn Into REAL Python Code!",
                story: "Here is the coolest secret: Block coding IS real coding! Behind every colorful block, our system instantly writes real, professional PYTHON code — the exact same language used by NASA rocket scientists and game creators! When you arrange blocks, you are training your brain to think in real computer logic.",
                tip: "Professional coders think in logic first, typing second. Blocks teach your brain the exact logic real programmers use!",
                illustrationType: "bridge",
                interactiveType: "transformer"
            },
            {
                id: "first_mission",
                stepNumber: 5,
                title: "Your First Mission!",
                badge: "Step 5 of 5",
                emoji: "🚀",
                headline: "Ready to Launch Your First Robot Sketch?",
                story: "Now you know the secret of block coding! With one click, you can load your very first starter sketch directly into the workspace. Click 'Load Sketch into Workspace', then press RUN to watch your robot spring to life!",
                tip: "Click the big green button below to load your blocks into the workspace and run them on your robot!",
                illustrationType: "robot",
                interactiveType: "launch"
            }
        ],
        pythonComparisons: [
            {
                blockName: "Serial Print 'Hello!'",
                blockColor: "#0284C7",
                category: "Communication",
                pythonCode: 'print("Hello!")',
                explanation: "Tells the robot to speak words onto the screen."
            },
            {
                blockName: "Wait 1 Second",
                blockColor: "#F59E0B",
                category: "Timing",
                pythonCode: "time.sleep(1.0)",
                explanation: "Tells the robot brain to pause and take a quick breath."
            },
            {
                blockName: "Turn LED Pin 4 ON",
                blockColor: "#10B981",
                category: "Hardware",
                pythonCode: "digital_write(4, 1)",
                explanation: "Sends electric power to make an LED shine bright!"
            }
        ],
        starQuestions: [
            {
                id: "q1",
                question: "Why do we use blocks when starting to learn code? 🧩",
                options: [
                    "Blocks snap like puzzle pieces so we never get typing or spelling errors!",
                    "Blocks only work when the computer is in the dark 🌙",
                    "Blocks are made of wood and need to be painted 🎨"
                ],
                correctIndex: 0,
                feedback: "Super! 🌟 Blocks fit together like puzzle pieces, making it impossible to make typing mistakes so you can focus on logic and creativity!"
            },
            {
                id: "q2",
                question: "Is block coding real programming? 🚀",
                options: [
                    "No, it is just cartoon play for toddlers 🖍️",
                    "YES! Behind every block, real professional Python code is generated! 🐍",
                    "Only on weekends when computers rest 😴"
                ],
                correctIndex: 1,
                feedback: "Spot on! 🚀 Behind every colorful block, our system instantly writes real Python code — the exact language used by NASA rocket scientists and AI creators!"
            },
            {
                id: "q3",
                question: "In what order does a computer or robot run your blocks? ⬇️",
                options: [
                    "From top to bottom, one step at a time in exact order!",
                    "It jumps around randomly like a hopping frog 🐸",
                    "Backwards from the bottom to the top ⬆️"
                ],
                correctIndex: 0,
                feedback: "Awesome! ⬇️ Just like following a cake recipe or reading a comic book, computers execute commands strictly from top to bottom!"
            },
            {
                id: "q4",
                question: "In our story, what did Robo-Ten discover about Python? 🐍💻",
                options: [
                    "Python is a dangerous snake living inside the computer 🐍",
                    "Python is a world-class coding language that powers AI and robots! 🤖",
                    "Python is a brand of bicycle tire 🚲"
                ],
                correctIndex: 1,
                feedback: "Hooray! 🎉 Python is not a reptile! It's one of the friendliest, most powerful coding languages in the world, powering ChatGPT and humanoid robots!"
            },
            {
                id: "q5",
                question: "How does the code actually turn ON the real LED on Pin 4? 💡⚡",
                options: [
                    "Magic dust sprinkles on the glass bulb ✨",
                    "The ESP32 brain converts code into 3.3V electricity that flows to Pin 4! ⚡",
                    "Someone has to yell at the computer loudly 🗣️"
                ],
                correctIndex: 1,
                feedback: "Brilliant! 💡 The ESP32 microchip turns your Python instruction into 3.3 Volts of electric current that travels to Pin 4 to light up the LED!"
            },
            {
                id: "q6",
                question: "What happens if two blocks don't make logical sense together? 🧩🚫",
                options: [
                    "They refuse to snap together, protecting you from broken code! 🛡️",
                    "The computer explodes into fireworks 🎆",
                    "The robot deletes all your video games 🎮"
                ],
                correctIndex: 0,
                feedback: "You nailed it! 🛡️ The puzzle tabs only allow valid connections, making block code 100% crash-proof while you learn!"
            }
        ],
        quiz: {
            question: "Why do we use blocks when starting to learn code?",
            options: [
                "Blocks snap like puzzle pieces so we never get spelling errors! 🧩",
                "Blocks only work when the sun is shining ☀️",
                "Blocks are made of wood and can be painted 🎨"
            ],
            correctIndex: 0,
            feedback: "That's right! 🌟 Blocks fit together like puzzle pieces, making it impossible to make syntax errors so you can focus on having fun and being creative!"
        }
    }
];

export default CURRICULUM_MODULES;
