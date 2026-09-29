// ==============================================================================
// TEN ROBOTICS - MULTILINGUAL CONVERSATIONAL CURRICULUM TRANSLATIONS
// Comprehensive Indian Language Support:
// English, Hindi (हिन्दी), Hinglish, Tamil (தமிழ்), Telugu (తెలుగు), 
// Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી)
// ==============================================================================

export const SUPPORTED_LANGUAGES = [
    { id: 'en', label: 'English', native: 'English', code: 'EN', tag: 'Global' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी', code: 'HI', tag: 'उत्तर भारत' },
    { id: 'hinglish', label: 'Hinglish', native: 'Hindi + Eng', code: 'HING', tag: 'Colloquial' },
    { id: 'ta', label: 'Tamil', native: 'தமிழ்', code: 'TA', tag: 'தமிழ்நாடு' },
    { id: 'te', label: 'Telugu', native: 'తెలుగు', code: 'TE', tag: 'ఆంధ్ర & తెలంగాణ' },
    { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', code: 'KN', tag: 'ಕರ್ನಾಟಕ' },
    { id: 'ml', label: 'Malayalam', native: 'മലയാളം', code: 'ML', tag: 'കേരളം' },
    { id: 'bn', label: 'Bengali', native: 'বাংলা', code: 'BN', tag: 'পশ্চিমবঙ্গ' },
    { id: 'mr', label: 'Marathi', native: 'मराठी', code: 'MR', tag: 'महाराष्ट्र' },
    { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી', code: 'GU', tag: 'ગુજરાત' }
];

export const UI_TRANSLATIONS = {
    en: {
        title: "Block Code Academy",
        module: "Module",
        stepOf: (cur, tot) => `Step ${cur} of ${tot}`,
        back: "Back",
        next: "Next Step",
        finish: "Finish Module 1 🎉",
        pickBlockPrompt: "👇 Interactive: Pick a block to see its real Python code!",
        whatYouSee: "🧩 Visual Block (What you see)",
        realPython: "🐍 Real Python Code (NASA & AI Language)",
        quizTitle: "Quick Star Question! ⭐",
        loadSketch: "🚀 Load Sketch Into Workspace",
        readyToCode: "Ready to Code?",
        loadDesc: "Click below to put these exact blocks right onto your workspace!"
    },
    hi: {
        title: "ब्लॉक कोड अकादमी",
        module: "मॉड्यूल",
        stepOf: (cur, tot) => `कदम ${cur} / ${tot}`,
        back: "पीछे",
        next: "अगला कदम",
        finish: "मॉड्यूल 1 पूरा करें 🎉",
        pickBlockPrompt: "👇 इंटरैक्टिव: किसी भी ब्लॉक पर क्लिक करके उसका असली Python कोड देखें!",
        whatYouSee: "🧩 विजुअल ब्लॉक (जो आप जोड़ते हैं)",
        realPython: "🐍 असली Python कोड (NASA और AI की भाषा)",
        quizTitle: "क्विक स्टार सवाल! ⭐",
        loadSketch: "🚀 इस स्केच को वर्कस्पेस में लोड करें",
        readyToCode: "क्या आप तैयार हैं?",
        loadDesc: "नीचे क्लिक करें और इन ब्लॉक्स को सीधे अपने रोबोट के वर्कस्पेस में ले जाएं!"
    },
    hinglish: {
        title: "Block Code Academy",
        module: "Module",
        stepOf: (cur, tot) => `Step ${cur} / ${tot}`,
        back: "Back",
        next: "Next Step",
        finish: "Finish Module 1 🎉",
        pickBlockPrompt: "👇 Interactive: Block pe click karo aur uska real Python code dekho!",
        whatYouSee: "🧩 Visual Block (Jo aap dekh rahe ho)",
        realPython: "🐍 Real Python Code (NASA aur AI ki language)",
        quizTitle: "Quick Star Question! ⭐",
        loadSketch: "🚀 Load Sketch Into Workspace",
        readyToCode: "Robot ko command dene ke liye ready?",
        loadDesc: "Neeche click karke in blocks ko direct workspace me load karo!"
    },
    ta: {
        title: "பிளாக் கோட் அகாடமி",
        module: "தொகுதி",
        stepOf: (cur, tot) => `படி ${cur} / ${tot}`,
        back: "பின்னால்",
        next: "அடுத்த படி",
        finish: "தொகுதி 1 நிறைவு 🎉",
        pickBlockPrompt: "👇 ஊடாடும் பகுதி: ஒரு பிளாக்கை தேர்ந்தெடுத்து அதன் நிஜ Python கோடை பாருங்கள்!",
        whatYouSee: "🧩 காட்சி பிளாக் (நீங்கள் பார்ப்பது)",
        realPython: "🐍 நிஜ Python கோட் (NASA மற்றும் AI மொழி)",
        quizTitle: "விரைவு வினாடி வினா! ⭐",
        loadSketch: "🚀 Workspace-ல் பிளாக்குகளை ஏற்றுங்கள்",
        readyToCode: "கோடிங் செய்ய தயாரா?",
        loadDesc: "கீழே உள்ள பட்டனை கிளிக் செய்து உங்கள் ரோபோவின் Workspace-ல் இந்த பிளாக்குகளை ஏற்றுங்கள்!"
    },
    te: {
        title: "బ్లాక్ కోడ్ అకాడమీ",
        module: "మాడ్యూల్",
        stepOf: (cur, tot) => `అడుగు ${cur} / ${tot}`,
        back: "వెనుకకు",
        next: "తదుపరి అడుగు",
        finish: "మాడ్యూల్ 1 పూర్తయింది 🎉",
        pickBlockPrompt: "👇 ఇంటరాక్టివ్: నిజమైన Python కోడ్ చూడటానికి బ్లాక్‌ని ఎంచుకోండి!",
        whatYouSee: "🧩 విజువల్ బ్లాక్ (మీరు చూసేది)",
        realPython: "🐍 నిజమైన Python కోడ్ (NASA & AI భాష)",
        quizTitle: "క్విక్ స్టార్ ప్రశ్న! ⭐",
        loadSketch: "🚀 వర్క్‌స్పేస్‌లో బ్లాక్‌లను లోడ్ చేయండి",
        readyToCode: "కోడింగ్ ప్రారంభించడానికై సిద్ధమా?",
        loadDesc: "ఈ బ్లాక్‌లను నేరుగా మీ రోబోట్ వర్క్‌స్పేస్‌లోకి లోడ్ చేయడానికి క్లిక్ చేయండి!"
    },
    kn: {
        title: "ಬ್ಲಾಕ್ ಕೋಡ್ ಅಕಾಡೆಮಿ",
        module: "ಮಾಡ್ಯೂಲ್",
        stepOf: (cur, tot) => `ಹಂತ ${cur} / ${tot}`,
        back: "ಹಿಂದಕ್ಕೆ",
        next: "ಮುಂದಿನ ಹಂತ",
        finish: "ಮಾಡ್ಯೂಲ್ 1 ಮುಕ್ತಾಯ 🎉",
        pickBlockPrompt: "👇 ನೈಜ Python ಕೋಡ್ ನೋಡಲು ಬ್ಲಾಕ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ!",
        whatYouSee: "🧩 ದೃಶ್ಯ ಬ್ಲಾಕ್ (ನೀವು ನೋಡುವುದು)",
        realPython: "🐍 ನೈಜ Python ಕೋಡ್ (NASA ಮತ್ತು AI ಭಾಷೆ)",
        quizTitle: "ತ್ವರಿತ ನಕ್ಷತ್ರ ಪ್ರಶ್ನೆ! ⭐",
        loadSketch: "🚀 ವರ್ಕ್‌ಸ್ಪೇಸ್‌ಗೆ ಲೋಡ್ ಮಾಡಿ",
        readyToCode: "ಕೋಡಿಂಗ್ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
        loadDesc: "ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ನೇರವಾಗಿ ವರ್ಕ್‌ಸ್ಪೇಸ್‌ಗೆ ಈ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಹಾಕಿ!"
    },
    ml: {
        title: "ബ്ലോക്ക് കോഡ് അക്കാദമി",
        module: "മൊഡ്യൂൾ",
        stepOf: (cur, tot) => `ഘട്ടം ${cur} / ${tot}`,
        back: "പിന്നോട്ട്",
        next: "അടുത്ത ഘട്ടം",
        finish: "മൊഡ്യൂൾ 1 പൂർത്തിയായി 🎉",
        pickBlockPrompt: "👇 യഥാർത്ഥ Python കോഡ് കാണാൻ ഒരു ബ്ലോക്ക് തിരഞ്ഞെടുക്കുക!",
        whatYouSee: "🧩 വിഷ്വൽ ബ്ലോക്ക് (നിങ്ങൾ കാണുന്നത്)",
        realPython: "🐍 യഥാർത്ഥ Python കോഡ് (NASA & AI ഭാഷ)",
        quizTitle: "ദ്രുത ചോദ്യം! ⭐",
        loadSketch: "🚀 വർക്ക്സ്പെയ്സിലേക്ക് ലോഡ് ചെയ്യുക",
        readyToCode: "കോഡിംഗിന് തയ്യാറാണോ?",
        loadDesc: "ഈ ബ്ലോക്കുകൾ നേരിട്ട് നിങ്ങളുടെ വർക്ക്‌സ്‌പെയ്‌സിലേക്ക് മാറ്റാൻ ക്ലിക്ക് ചെയ്യുക!"
    },
    bn: {
        title: "ব্লক কোড একাডেমি",
        module: "মডিউল",
        stepOf: (cur, tot) => `ধাপ ${cur} / ${tot}`,
        back: "পেছনে",
        next: "পরবর্তী ধাপ",
        finish: "মডিউল ১ সম্পন্ন 🎉",
        pickBlockPrompt: "👇 আসল Python কোড দেখতে একটি ব্লকে ক্লিক করুন!",
        whatYouSee: "🧩 ভিজ্যুয়াল ব্লক (যা আপনি দেখছেন)",
        realPython: "🐍 আসল Python কোড (NASA ও AI এর ভাষা)",
        quizTitle: "কুইক স্টার প্রশ্ন! ⭐",
        loadSketch: "🚀 ওয়ার্কস্পেসে লোড করুন",
        readyToCode: "কোডিং শুরু করতে প্রস্তুত?",
        loadDesc: "নিচের বাটনে ক্লিক করে এই ব্লকগুলো সরাসরি ওয়ার্কস্পেসে নিয়ে যান!"
    },
    mr: {
        title: "ब्लॉक कोड अकादमी",
        module: "मॉड्यूल",
        stepOf: (cur, tot) => `पायरी ${cur} / ${tot}`,
        back: "मागे",
        next: "पुढची पायरी",
        finish: "मॉड्यूल १ पूर्ण 🎉",
        pickBlockPrompt: "👇 खरा Python कोड पाहण्यासाठी ब्लॉक निवडा!",
        whatYouSee: "🧩 व्हिज्युअल ब्लॉक (तुम्ही जे पाहता)",
        realPython: "🐍 खरा Python कोड (NASA आणि AI ची भाषा)",
        quizTitle: "क्विक स्टार प्रश्न! ⭐",
        loadSketch: "🚀 वर्कस्पेसमध्ये ब्लॉक लोड करा",
        readyToCode: "कोडिंग सुरू करण्यास तयार आहात?",
        loadDesc: "खाली क्लिक करून हे ब्लॉक थेट तुमच्या रोबोट वर्कस्पेसमध्ये आणा!"
    },
    gu: {
        title: "બ્લોક કોડ એકેડેમી",
        module: "મોડ્યુલ",
        stepOf: (cur, tot) => `પગલું ${cur} / ${tot}`,
        back: "પાછળ",
        next: "આગળનું પગલું",
        finish: "મોડ્યુલ ૧ પૂરું થયું 🎉",
        pickBlockPrompt: "👇 વાસ્તવિક Python કોડ જોવા માટે બ્લોક પસંદ કરો!",
        whatYouSee: "🧩 વિઝ્યુઅલ બ્લોક (તમે જે જુઓ છો)",
        realPython: "🐍 સાચો Python કોડ (NASA અને AI ની ભાષા)",
        quizTitle: "ક્વિક સ્ટાર સવાલ! ⭐",
        loadSketch: "🚀 વર્કસ્પેસમાં લોડ કરો",
        readyToCode: "કોડિંગ કરવા તૈયાર છો?",
        loadDesc: "નીચે ક્લિક કરીને આ બ્લોક્સ સીધા તમારા રોબોટ વર્કસ્પેસમાં મૂકો!"
    }
};

// Module 1 Rich Localized Content
export const MODULE_1_LOCALIZED = {
    en: {
        title: "Introduction to Block Code",
        subtitle: "How Blocks Work & How They Turn Into Real Python Code",
        steps: [
            {
                headline: "What is Coding? Meet Your Robot Friend!",
                story: "Have you ever built a cool LEGO castle or trained a friendly puppy? Coding is just like that! A computer or robot is super fast, but it cannot think on its own. It waits for YOU to give it friendly, step-by-step instructions. You are the robot's commander!",
                tip: "Real-World Analogy: Just like teaching a pet to 'Sit' or 'Fetch', code gives friendly clear instructions to your robot!"
            },
            {
                headline: "Snap Blocks Together Like Puzzle Pieces!",
                story: "In old typing code, if you misspell a single letter or forget a comma, the whole program crashes! But with Block Code, commands are colorful blocks with puzzle tabs. If two blocks don't belong together, they literally won't snap! It is 100% mistake-proof and fun!",
                tip: "Real-World Analogy: Like LEGO bricks, only matching shapes click together. No typing errors ever!"
            },
            {
                headline: "Top to Bottom, Like Reading a Comic Book!",
                story: "Robots read their instructions in exact order from TOP to BOTTOM. First it executes Block 1, then Block 2, then Block 3! For example: 1) Turn light ON 💡 -> 2) Wait 1 second ⏳ -> 3) Turn light OFF 🌙. The robot never skips or forgets a step!",
                tip: "Real-World Analogy: Like following a baking recipe step-by-step. You mix the batter before baking in the oven!"
            },
            {
                headline: "How Blocks Turn Into Real Python & AI Code! ✨",
                story: "Here is the coolest secret: Block coding IS real coding! Behind every colorful block, our system instantly writes real, professional PYTHON code — the exact same language used by NASA rocket scientists, Tesla self-driving cars, and ChatGPT AI! When you arrange blocks, you are training your brain to think in real computer logic.",
                tip: "Current AI Trend: Modern AI like ChatGPT and autonomous robots are built on Python logic. Blocks teach your brain that exact logic!"
            },
            {
                headline: "Ready to Launch Your First Robot Sketch? 🚀",
                story: "Now you know the magic of block coding! With one single click, you can load your very first block code sketch directly into the workspace. Then click RUN and watch the robot greet you with real telemetry!",
                tip: "Click below to put these exact blocks right onto your workspace and run them on your robot!"
            }
        ],
        quiz: {
            question: "Why do we use blocks when starting to learn code?",
            options: [
                "Blocks snap like puzzle pieces so we never get spelling errors! 🧩",
                "Blocks only work when the sun is shining ☀️",
                "Blocks are made of wood and need to be painted 🎨"
            ],
            feedback: "That's right! 🌟 Blocks fit together like puzzle pieces, making it impossible to make syntax errors so you can focus on having fun and being creative!"
        },
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
        ]
    },
    hi: {
        title: "ब्लॉक कोडिंग का परिचय",
        subtitle: "ब्लॉक कैसे काम करते हैं और वे असली Python कोड कैसे बनते हैं",
        steps: [
            {
                headline: "कोडिंग क्या है? अपने रोबोट दोस्त से मिलिए! 🤖",
                story: "क्या आपने कभी LEGO से कोई किला बनाया है या किसी प्यारे पिल्ले को ट्रेन किया है? कोडिंग बिल्कुल वैसी ही है! कंप्यूटर और रोबोट बहुत तेज होते हैं, लेकिन वे खुद नहीं सोच सकते। वे आपके आसान और साफ निर्देशों का इंतजार करते हैं। आप ही रोबोट के कैप्टन हैं!",
                tip: "असली दुनिया का उदाहरण: जैसे आप किसी पालतू जानवर को 'बैठो' या 'दौड़ो' सिखाते हैं, वैसे ही कोड रोबोट को स्टेप-बाय-स्टेप काम करना सिखाता है!"
            },
            {
                headline: "पज़ल की तरह ब्लॉक्स को आपस में जोड़ें! 🧩",
                story: "पुरानी कोडिंग में अगर आप एक स्पेलिंग गलत कर दें या कॉमा भूल जाएं तो पूरा प्रोग्राम बंद हो जाता है। लेकिन ब्लॉक कोडिंग में हर कमांड एक रंग-बिरंगा ब्लॉक है जिसमें पज़ल जैसे नॉच होते हैं। जो ब्लॉक आपस में मैच नहीं करते, वे जुड़ते ही नहीं! इसलिए इसमें कोई गलती नहीं हो सकती।",
                tip: "असली दुनिया का उदाहरण: जैसे लेगो ईंटें सिर्फ सही खांचों में फिट होती हैं, वैसे ही ब्लॉक बिना किसी स्पेलिंग गलती के जुड़ते हैं!"
            },
            {
                headline: "ऊपर से नीचे, जैसे कॉमिक्स पढ़ना! 📖",
                story: "रोबोट हमेशा निर्देशों को ऊपर से नीचे (Top to Bottom) लाइन से पढ़ता है। पहले ब्लॉक 1, फिर ब्लॉक 2, फिर ब्लॉक 3! जैसे: 1) लाइट चालू करो 💡 -> 2) 1 सेकंड रुको ⏳ -> 3) लाइट बंद करो 🌙। रोबोट कभी कोई कदम नहीं भूलता!",
                tip: "असली दुनिया का उदाहरण: जैसे केक बनाने की रेसिपी में पहले आटा मिलाते हैं और फिर ओवन में पकाते हैं, वैसे ही कोड क्रम से चलता है!"
            },
            {
                headline: "ब्लॉक से बनता है असली Python और AI कोड! ✨",
                story: "सबसे बड़ा सीक्रेट यह है कि ब्लॉक कोडिंग ही असली कोडिंग है! हर रंगीन ब्लॉक के पीछे हमारा सिस्टम असली PYTHON कोड लिखता है — वही भाषा जो NASA, Tesla की सेल्फ-ड्राइविंग कारें और ChatGPT AI इस्तेमाल करते हैं! ब्लॉक जोड़कर आप सीधा AI इंजीनियर की तरह सोचना सीखते हैं।",
                tip: "आधुनिक AI ट्रेंड: ChatGPT और आधुनिक रोबोटिक्स Python पर चलते हैं। ब्लॉक कोडिंग आपको वही लॉजिक सिखाती है!"
            },
            {
                headline: "अपना पहला रोबोट स्केच शुरू करने के लिए तैयार? 🚀",
                story: "अब आप ब्लॉक कोडिंग का जादू समझ चुके हैं! सिर्फ एक क्लिक से आप अपना पहला स्टार्टर कोड सीधे वर्कस्पेस में लोड कर सकते हैं। फिर RUN दबाएं और अपने रोबोट को जीवित होते देखें!",
                tip: "नीचे दिए गए हरे बटन पर क्लिक करें और सीधे अपने वर्कस्पेस में इन ब्लॉक्स को चलाएं!"
            }
        ],
        quiz: {
            question: "कोडिंग सीखने के लिए हम ब्लॉक कोड का इस्तेमाल क्यों करते हैं?",
            options: [
                "ब्लॉक पज़ल की तरह जुड़ते हैं, इसलिए कोई स्पेलिंग गलती नहीं होती! 🧩",
                "ब्लॉक सिर्फ दिन में धूप होने पर काम करते हैं ☀️",
                "ब्लॉक लकड़ी के बने होते हैं 🪵"
            ],
            feedback: "बिल्कुल सही! 🌟 ब्लॉक पज़ल जैसे होते हैं, जिससे टाइपिंग की कोई गलती नहीं होती और आप रचनात्मकता पर ध्यान दे सकते हैं!"
        },
        starQuestions: [
            {
                id: "q1",
                question: "कोडिंग सीखने के लिए हम ब्लॉक कोड का इस्तेमाल क्यों करते हैं? 🧩",
                options: [
                    "ब्लॉक पज़ल की तरह जुड़ते हैं, इसलिए टाइपिंग या स्पेलिंग की गलती नहीं होती!",
                    "ब्लॉक सिर्फ अंधेरे कमरे में काम करते हैं 🌙",
                    "ब्लॉक लकड़ी के बने होते हैं जिन्हें पेंट करना पड़ता है 🎨"
                ],
                correctIndex: 0,
                feedback: "बिल्कुल सही! 🌟 ब्लॉक पज़ल जैसे होते हैं, जिससे टाइपिंग की कोई गलती नहीं होती और आप रचनात्मकता पर ध्यान दे सकते हैं!"
            },
            {
                id: "q2",
                question: "क्या ब्लॉक कोडिंग असली प्रोग्रामिंग है? 🚀",
                options: [
                    "नहीं, यह सिर्फ बच्चों का कार्टून खेल है 🖍️",
                    "हाँ! हर ब्लॉक के पीछे असली प्रोफेशनल Python कोड बनता है! 🐍",
                    "सिर्फ रविवार के दिन जब कंप्यूटर आराम करते हैं 😴"
                ],
                correctIndex: 1,
                feedback: "शानदार! 🚀 हर रंगीन ब्लॉक के पीछे हमारा सिस्टम असली PYTHON कोड लिखता है — वही भाषा जो NASA और AI में इस्तेमाल होती है!"
            },
            {
                id: "q3",
                question: "रोबोट या कंप्यूटर आपके ब्लॉक्स को किस क्रम में चलाता है? ⬇️",
                options: [
                    "ऊपर से नीचे, एक-एक कदम क्रम से! ⬇️",
                    "मेंढक की तरह बिना किसी क्रम के इधर-उधर कूदता है 🐸",
                    "उल्टा, नीचे से ऊपर की ओर ⬆️"
                ],
                correctIndex: 0,
                feedback: "बहुत बढ़िया! ⬇️ जैसे केक बनाने की रेसिपी में कदम दर कदम काम करते हैं, वैसे ही कंप्यूटर निर्देशों को ऊपर से नीचे पढ़ता है!"
            },
            {
                id: "q4",
                question: "हमारी कहानी में रोबो-टेन को Python के बारे में क्या पता चला? 🐍💻",
                options: [
                    "Python एक जहरीला सांप है जो कीबोर्ड में रहता है 🐍",
                    "Python दुनिया की सबसे बेहतरीन कोडिंग भाषा है जो रोबोट और AI चलाती है! 🤖",
                    "Python साइकिल के टायर का नाम है 🚲"
                ],
                correctIndex: 1,
                feedback: "शाबाश! 🎉 Python कोई सांप नहीं है! यह दुनिया की सबसे लोकप्रिय और शक्तिशाली प्रोग्रामिंग भाषा है जो ChatGPT और रोबोट चलाती है!"
            },
            {
                id: "q5",
                question: "कोड पिन 4 (Pin 4) की असली LED लाइट को कैसे चालू करता है? 💡⚡",
                options: [
                    "कांच के बल्ब पर जादुई धूल छिड़क कर ✨",
                    "ESP32 दिमाग कोड को 3.3V बिजली में बदलकर पिन 4 में भेजता है! ⚡",
                    "कंप्यूटर पर ज़ोर से चिल्लाना पड़ता है 🗣️"
                ],
                correctIndex: 1,
                feedback: "कमाल! 💡 ESP32 माइक्रोचिप आपके कोड को 3.3 वोल्ट बिजली के करंट में बदलकर पिन 4 तक पहुँचाती है, जिससे LED जगमगा उठती है!"
            },
            {
                id: "q6",
                question: "अगर दो ब्लॉक एक दूसरे के साथ फिट नहीं बैठते तो क्या होगा? 🧩🚫",
                options: [
                    "वे आपस में नहीं जुड़ेंगे, जिससे कोड कभी खराब नहीं होगा! 🛡️",
                    "कंप्यूटर में पटाखे फूटने लगेंगे 🎆",
                    "रोबोट आपके सारे वीडियो गेम डिलीट कर देगा 🎮"
                ],
                correctIndex: 0,
                feedback: "एकदम सही! 🛡️ पज़ल खांचे केवल सही कमांड्स को जुड़ने देते हैं, इसलिए कोड कभी क्रैश नहीं होता!"
            }
        ]
    },
    ta: {
        title: "பிளாக் கோடிங் அறிமுகம்",
        subtitle: "பிளாக்குகள் எப்படி இயங்குகின்றன & நிஜ Python கோடாக மாறுகின்றன",
        steps: [
            {
                headline: "கோடிங் என்றால் என்ன? உங்கள் ரோபோ நண்பரை சந்தியுங்கள்! 🤖",
                story: "நீங்கள் எப்போதாவது லெகோ பொம்மைகள் வைத்து விளையாடியிருக்கிறீர்களா? கோடிங் என்பதும் அதே போன்றது தான்! கம்ப்யூட்டரும் ரோபோவும் மிக வேகமானவை, ஆனால் அவற்றால் தானாக யோசிக்க முடியாது. நீங்கள் சொல்லும் கட்டளைகளுக்காக அவை காத்திருக்கின்றன. நீங்களே ரோபோவின் தளபதி!",
                tip: "நிஜ உலக உதாரணம்: நாம் வளர்ப்பு பிராணிக்கு 'உட்கார்', 'வா' என்று கட்டளையிடுவது போல, ரோபோவுக்கும் நாம் கட்டளையிடுகிறோம்!"
            },
            {
                headline: "லெகோ போல பிளாக்குகளை ஒன்றுடன் ஒன்று இணையுங்கள்! 🧩",
                story: "பழைய கோடிங்கில் ஒரு எழுத்துப் பிழை அல்லது கமா தவறினால் மொத்த புரோகிராமும் இயங்காது. ஆனால் பிளாக் கோடிங்கில் ஒவ்வொரு கட்டளையும் வண்ணமயமான பிளாக் வடிவில் இருக்கும். பொருந்தாத பிளாக்குகள் இணையவே இணையாது! அதனால் தவறுகள் நடக்க வாய்ப்பே இல்லை!",
                tip: "நிஜ உலக உதாரணம்: லெகோ கற்கள் போல சரியான வடிவம் மட்டுமே இணையும். எழுத்துப் பிழைகள் வரவே வராது!"
            },
            {
                headline: "மேலிருந்து கீழ் வரிசையாக வாசிக்கும் ரோபோ! 📖",
                story: "ரோபோ எப்போதும் கட்டளைகளை மேலிருந்து கீழாக வரிசையாகவே செய்யும். முதலில் பிளாக் 1, பிறகு பிளாக் 2, பிறகு பிளாக் 3! உதாரணத்திற்கு: 1) லைட்டை ஆன் செய் 💡 -> 2) 1 வினாடி காத்திரு ⏳ -> 3) லைட்டை ஆஃப் செய் 🌙.",
                tip: "நிஜ உலக உதாரணம்: சமையல் குறிப்பில் ஒவ்வொன்றாக செய்வது போல, ரோபோவும் கட்டளைகளை வரிசையாக செய்கிறது!"
            },
            {
                headline: "பிளாக்குகள் எப்படி நிஜ Python & AI கோடாக மாறுகின்றன! ✨",
                story: "ஒரு பெரிய ரகசியம் என்னவென்றால், பிளாக் கோடிங் என்பது நிஜ கோடிங் தான்! ஒவ்வொரு பிளாக்கின் பின்னணியிலும் நாசா (NASA), டெஸ்லா கார்கள் மற்றும் ChatGPT AI பயன்படுத்தும் அதே Python கோடு தானாக உருவாகிறது! பிளாக்குகளை அடுக்கும் போதே நீங்கள் நிஜ மென்பொருள் பொறியாளர் ஆகிறீர்கள்.",
                tip: "நவீன AI போக்கு: ChatGPT மற்றும் தற்கால ரோபோக்கள் Python மொழியிலேயே இயங்குகின்றன. பிளாக்குகள் அந்த சிந்தனையை உங்களுக்கு கற்பிக்கின்றன!"
            },
            {
                headline: "உங்கள் முதல் ரோபோ பணியைத் தொடங்க தயாரா? 🚀",
                story: "இப்போது பிளாக் கோடிங்கின் ரகசியத்தை தெரிந்து கொண்டீர்கள்! ஒரே கிளிக்கில் இந்த ஆரம்ப பிளாக்குகளை உங்கள் Workspace-ல் ஏற்றலாம். பிறகு RUN அழுத்தி உங்கள் ரோபோ உங்களுடன் உரையாடுவதை பாருங்கள்!",
                tip: "கீழே உள்ள பட்டனை அழுத்தி Workspace-ல் பிளாக்குகளை உடனே இயக்குங்கள்!"
            }
        ],
        quiz: {
            question: "ஆரம்பத்தில் கோடிங் கற்க நாம் பிளாக்குகளை ஏன் பயன்படுத்துகிறோம்?",
            options: [
                "பிளாக்குகள் பஸில் போல சரியாக பொருந்துவதால் எழுத்துப் பிழைகள் வராது! 🧩",
                "பிளாக்குகள் வெயில் இருக்கும் போது மட்டுமே வேலை செய்யும் ☀️",
                "பிளாக்குகள் மரத்தால் செய்யப்பட்டவை 🪵"
            ],
            feedback: "அருமை! 🌟 பிளாக்குகள் பஸில் போல பொருந்துவதால் எழுத்துப் பிழைகள் எதுவும் வராது, உங்கள் படைப்பாற்றலை எளிதாக வெளிப்படுத்தலாம்!"
        },
        starQuestions: [
            {
                id: "q1",
                question: "ஆரம்பத்தில் கோடிங் கற்க நாம் பிளாக்குகளை ஏன் பயன்படுத்துகிறோம்? 🧩",
                options: [
                    "பிளாக்குகள் பஸில் போல சரியாக பொருந்துவதால் எழுத்துப் பிழைகள் வராது!",
                    "பிளாக்குகள் இருட்டில் மட்டுமே வேலை செய்யும் 🌙",
                    "பிளாக்குகள் மரத்தால் செய்யப்பட்டவை 🎨"
                ],
                correctIndex: 0,
                feedback: "அருமை! 🌟 பிளாக்குகள் பஸில் போல பொருந்துவதால் எழுத்துப் பிழைகள் எதுவும் வராது, உங்கள் யோசனையை எளிதாக உருவாக்கலாம்!"
            },
            {
                id: "q2",
                question: "பிளாக் கோடிங் என்பது நிஜமான புரோகிராமிங் தானா? 🚀",
                options: [
                    "இல்லை, இது வெறும் கார்ட்டூன் விளையாட்டு 🖍️",
                    "ஆம்! ஒவ்வொரு பிளாக்கின் பின்னணியிலும் நிஜ Python கோடு உருவாகிறது! 🐍",
                    "கம்ப்யூட்டர் தூங்கும் போது மட்டுமே 😴"
                ],
                correctIndex: 1,
                feedback: "சரியான விடை! 🚀 ஒவ்வொரு பிளாக்கின் பின்னணியிலும் நாசா (NASA) மற்றும் ChatGPT AI பயன்படுத்தும் அதே Python கோடு தானாக உருவாகிறது!"
            },
            {
                id: "q3",
                question: "ரோபோ உங்கள் பிளாக்குகளை எந்த வரிசையில் இயக்கும்? ⬇️",
                options: [
                    "மேலிருந்து கீழாக, ஒவ்வொன்றாக வரிசையாக! ⬇️",
                    "தவளை போல தாறுமாறாக குதிக்கும் 🐸",
                    "கீழிருந்து மேலாக தலைகீழாக ⬆️"
                ],
                correctIndex: 0,
                feedback: "அற்புதம்! ⬇️ சமையல் குறிப்பை வரிசையாக செய்வது போல, ரோபோ கட்டளைகளை மேலிருந்து கீழாக வரிசையாகவே செய்கிறது!"
            },
            {
                id: "q4",
                question: "நம் கதையில் ரோபோ-டென் Python பற்றி என்ன தெரிந்து கொண்டது? 🐍💻",
                options: [
                    "Python என்பது கீபோர்டுக்குள் வாழும் ஆபத்தான பாம்பு 🐍",
                    "Python என்பது AI மற்றும் ரோபோக்களை இயக்கும் மிகச் சிறந்த கோடிங் மொழி! 🤖",
                    "Python என்பது ஒரு சைக்கிள் டயர் 🚲"
                ],
                correctIndex: 1,
                feedback: "அருமை! 🎉 Python என்பது பாம்பு அல்ல! இது மனித உருவ ரோபோக்களையும் ChatGPT AI-யையும் இயக்கும் உலகப் புகழ்பெற்ற கணினி மொழி!"
            },
            {
                id: "q5",
                question: "கோடு எப்படி பின் 4-ல் (Pin 4) உள்ள நிஜ LED லைட்டை ஒளிரச் செய்கிறது? 💡⚡",
                options: [
                    "பல்பு மீது மந்திரப் பொடி தூவி ✨",
                    "ESP32 மூளை கோடை 3.3V மின்சாரமாக மாற்றி பின் 4-க்கு அனுப்புகிறது! ⚡",
                    "கம்ப்யூட்டரை சத்தமாக திட்ட வேண்டும் 🗣️"
                ],
                correctIndex: 1,
                feedback: "அசத்தல்! 💡 ESP32 மைக்ரோசிப் உங்கள் Python கட்டளையை 3.3 வோல்ட் மின்சாரமாக மாற்றி பின் 4 வழியே அனுப்பி LED லைட்டை எரிய வைக்கிறது!"
            },
            {
                id: "q6",
                question: "பொருந்தாத இரண்டு பிளாக்குகளை இணைக்க முயன்றால் என்ன நடக்கும்? 🧩🚫",
                options: [
                    "அவை இணையவே இணையாது, அதனால் பிழைகள் வராமல் பாதுகாக்கும்! 🛡️",
                    "கம்ப்யூட்டர் பட்டாசு போல வெடிக்கும் 🎆",
                    "ரோபோ உங்கள் கேம்ஸ்களை அழித்துவிடும் 🎮"
                ],
                correctIndex: 0,
                feedback: "சரியாக சொன்னீர்கள்! 🛡️ பஸில் அமைப்புகள் தவறான பிளாக்குகள் இணையாமல் தடுத்து பிழையற்ற கோடிங் செய்ய உதவுகிறது!"
            }
        ]
    },
    te: {
        title: "బ్లాక్ కోడింగ్ పరిచయం",
        subtitle: "బ్లాక్స్ ఎలా పనిచేస్తాయి మరియు అవి నిజమైన Python కోడ్‌గా ఎలా మారతాయి",
        steps: [
            {
                headline: "కోడింగ్ అంటే ఏమిటి? మీ రోబోట్ మిత్రుడిని కలవండి! 🤖",
                story: "మీరు ఎప్పుడైనా LEGO బొమ్మలతో కోటను నిర్మించారా? కోడింగ్ కూడా సరిగ్గా అలాంటిదే! కంప్యూటర్లు మరియు రోబోట్లు చాలా వేగంగా ఉంటాయి, కానీ అవి సొంతంగా ఆలోచించలేవు. మీరు ఇచ్చే స్పష్టమైన దశల వారీ సూచనల కోసమే అవి వేచి చూస్తాయి. మీరే రోబోట్ బాస్!",
                tip: "నిజ జీవిత ఉదాహరణ: పెంపుడు జంతువుకు 'కూర్చో' అని నేర్పించినట్లుగా, కోడ్ రోబోట్‌కు దశలవారీగా పనులు నిర్దేశిస్తుంది!"
            },
            {
                headline: "పజిల్‌లా బ్లాక్‌లను ఒకదానితో ఒకటి కలపండి! 🧩",
                story: "పాత టైపింగ్ కోడింగ్‌లో ఒక్క అక్షరం తప్పుగా టైప్ చేసినా ప్రోగ్రామ్ ఆగిపోతుంది. కానీ బ్లాక్ కోడింగ్‌లో ప్రతి కమాండ్ అందమైన బ్లాక్ రూపంలో ఉంటుంది. సరిపోలని బ్లాక్‌లు అస్సలు అతుక్కోవు! కాబట్టి స్పెల్లింగ్ తప్పులు జరగడం అసాధ్యం!",
                tip: "నిజ జీవిత ఉదాహరణ: LEGO ఇటుకల్లా సరైన భాగాలు మాత్రమే కలుస్తాయి. టైపింగ్ పొరపాట్లు ఉండవు!"
            },
            {
                headline: "పై నుండి క్రిందికి చదివే రోబోట్! 📖",
                story: "రోబోట్ ఎల్లప్పుడూ పై నుండి క్రిందికి క్రమ పద్ధతిలో సూచనలను పాటిస్తుంది. మొదట బ్లాక్ 1, తర్వాత బ్లాక్ 2, ఆపై బ్లాక్ 3! ఉదాహరణ: 1) లైట్ వెలిగించు 💡 -> 2) 1 సెకను వేచి ఉండు ⏳ -> 3) లైట్ ఆర్పేయి 🌙.",
                tip: "నిజ జీవిత ఉదాహరణ: వంట చేసేటప్పుడు రెసిపీని వరుసగా ఎలా పాటిస్తామో, రోబోట్ కూడా అలానే చేస్తుంది!"
            },
            {
                headline: "బ్లాక్స్ నిజమైన Python మరియు AI కోడ్‌గా ఎలా మారతాయి! ✨",
                story: "ఒక గొప్ప రహస్యం ఏమిటంటే, బ్లాక్ కోడింగ్ అనేది నిజమైన కోడింగ్! ప్రతి రంగురంగుల బ్లాక్ వెనుక నాసా (NASA), టెస్లా కార్లు మరియు ChatGPT AI ఉపయోగించే అత్యుత్తమ PYTHON కోడ్ స్వయంచాలకంగా తయారవుతుంది! బ్లాక్స్ వాడటం ద్వారా మీరు నేరుగా AI లాజిక్‌ని నేర్చుకుంటున్నారు.",
                tip: "ప్రస్తుత AI ట్రెండ్: ChatGPT మరియు అధునాతన రోబోట్లు Python పైనే నడుస్తాయి. బ్లాక్స్ మీకు అదే లాజిక్‌ను నేర్పుతాయి!"
            },
            {
                headline: "మీ మొదటి రోబోట్ ప్రోగ్రామ్‌ను ప్రారంభించడానికి సిద్ధమా? 🚀",
                story: "ఇప్పుడు మీరు బ్లాక్ కోడింగ్ రహస్యాన్ని తెలుసుకున్నారు! కేవలం ఒక్క క్లిక్‌తో మీ మొదటి బ్లాక్‌లను వర్క్‌స్పేస్‌లోకి లోడ్ చేసి, RUN బటన్ నొక్కండి!",
                tip: "క్రింది గ్రీన్ బటన్ నొక్కి బ్లాక్‌లను వర్క్‌స్పేస్‌లో చేర్చి రన్ చేయండి!"
            }
        ],
        quiz: {
            question: "కోడింగ్ ప్రారంభంలో మనం బ్లాక్స్ ఎందుకు ఉపయోగిస్తాము?",
            options: [
                "బ్లాక్స్ పజిల్‌లా అమరుతాయి కాబట్టి స్పెల్లింగ్ తప్పులు జరగవు! 🧩",
                "బ్లాక్స్ ఎండ ఉన్నప్పుడే పనిచేస్తాయి ☀️",
                "బ్లాక్స్ చెక్కతో తయారు చేయబడతాయి 🪵"
            ],
            feedback: "ఖచ్చితంగా సరైన సమాధానం! 🌟 బ్లాక్స్ పజిల్‌లా సరిగ్గా అమరుతాయి, టైపింగ్ తప్పులు లేకుండా సరదాగా కోడింగ్ చేయవచ్చు!"
        },
        starQuestions: [
            {
                id: "q1",
                question: "కోడింగ్ ప్రారంభంలో మనం బ్లాక్స్ ఎందుకు ఉపయోగిస్తాము? 🧩",
                options: [
                    "బ్లాక్స్ పజిల్‌లా అమరుతాయి కాబట్టి స్పెల్లింగ్ లేదా టైపింగ్ తప్పులు జరగవు!",
                    "బ్లాక్స్ చీకట్లో మాత్రమే పనిచేస్తాయి 🌙",
                    "బ్లాక్స్ చెక్కతో తయారు చేయబడతాయి 🎨"
                ],
                correctIndex: 0,
                feedback: "ఖచ్చితంగా సరైన సమాధానం! 🌟 బ్లాక్స్ పజిల్‌లా సరిగ్గా అమరుతాయి, టైపింగ్ తప్పులు లేకుండా సరదాగా కోడింగ్ చేయవచ్చు!"
            },
            {
                id: "q2",
                question: "బ్లాక్ కోడింగ్ అనేది నిజమైన ప్రోగ్రామింగ్ అవునా? 🚀",
                options: [
                    "కాదు, ఇది కేవలం చిన్నపిల్లల బొమ్మల ఆట 🖍️",
                    "అవును! ప్రతి బ్లాక్ వెనుక నిజమైన ప్రొఫెషనల్ Python కోడ్ తయారవుతుంది! 🐍",
                    "ఆదివారాల్లో మాత్రమే పనిచేస్తుంది 😴"
                ],
                correctIndex: 1,
                feedback: "అద్భుతం! 🚀 ప్రతి రంగురంగుల బ్లాక్ వెనుక నాసా (NASA) మరియు AI ఉపయోగించే అత్యుత్తమ PYTHON కోడ్ స్వయంచాలకంగా తయారవుతుంది!"
            },
            {
                id: "q3",
                question: "రోబోట్ మీ బ్లాక్‌లను ఏ క్రమంలో రన్ చేస్తుంది? ⬇️",
                options: [
                    "పై నుండి క్రిందికి, ఒక్కొక్కటిగా వరుస క్రమంలో! ⬇️",
                    "కప్పలా అటూ ఇటూ దూకుతుంది 🐸",
                    "క్రింది నుండి పైకి రివర్స్‌లో ⬆️"
                ],
                correctIndex: 0,
                feedback: "సూపర్! ⬇️ వంట చేసేటప్పుడు రెసిపీని వరుసగా ఎలా పాటిస్తామో, కంప్యూటర్ కూడా పై నుండి క్రిందికి సూచనలను పాటిస్తుంది!"
            },
            {
                id: "q4",
                question: "మన కథలో రోబో-టెన్ Python గురించి ఏమి తెలుసుకున్నాడు? 🐍💻",
                options: [
                    "Python అనేది కీబోర్డులో ఉండే ప్రమాదకరమైన పాము 🐍",
                    "Python అనేది AI మరియు రోబోట్లను నడిపించే ప్రపంచ ప్రసిద్ధ కోడింగ్ భాష! 🤖",
                    "Python అంటే సైకిల్ టైరు 🚲"
                ],
                correctIndex: 1,
                feedback: "కరెక్ట్! 🎉 Python అనేది పాము కాదు! ఇది ChatGPT మరియు అత్యాధునిక రోబోట్లను నడిపించే అత్యంత ప్రజాదరణ పొందిన ప్రోగ్రామింగ్ భాష!"
            },
            {
                id: "q5",
                question: "కోడ్ పిన్ 4 (Pin 4) వద్ద ఉన్న LED లైట్‌ను ఎలా వెలిగిస్తుంది? 💡⚡",
                options: [
                    "బల్బుపై మంత్రాల పొడి చల్లడం వల్ల ✨",
                    "ESP32 చిప్ కోడ్‌ను 3.3V కరెంట్‌గా మార్చి పిన్ 4కి పంపుతుంది! ⚡",
                    "కంప్యూటర్‌పై గట్టిగా అరవాలి 🗣️"
                ],
                correctIndex: 1,
                feedback: "షాబాష్! 💡 ESP32 ప్రాసెసర్ మీ కోడ్‌ను 3.3 వోల్ట్ల విద్యుత్ ప్రవాహంగా మార్చి పిన్ 4 ద్వారా LED లైట్ వెలిగేలా చేస్తుంది!"
            },
            {
                id: "q6",
                question: "సరిపోలని రెండు బ్లాక్‌లను కలపడానికి ప్రయత్నిస్తే ఏమి జరుగుతుంది? 🧩🚫",
                options: [
                    "అవి అస్సలు అతుక్కోవు, తద్వారా తప్పులు జరగకుండా రక్షిస్తాయి! 🛡️",
                    "కంప్యూటర్ టపాకాయలా పేలిపోతుంది 🎆",
                    "రోబోట్ మీ వీడియో గేమ్‌లను డిలీట్ చేస్తుంది 🎮"
                ],
                correctIndex: 0,
                feedback: "కరెక్ట్! 🛡️ పజిల్ నిర్మాణం తప్పుడు బ్లాక్‌లు కలవకుండా ఆపి, మీ కోడింగ్‌ను 100% సురక్షితంగా ఉంచుతుంది!"
            }
        ]
    }
};

// Return localized data or fallback to English
export function getLocalizedModuleContent(lang = 'en') {
    if (MODULE_1_LOCALIZED[lang]) {
        return MODULE_1_LOCALIZED[lang];
    }
    // Fallback aliases
    if (lang === 'hinglish') return MODULE_1_LOCALIZED['hi'] || MODULE_1_LOCALIZED['en'];
    return MODULE_1_LOCALIZED['en'];
}
