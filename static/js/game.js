/**
 * HANGMAN GAME — Data Engineering Edition
 * With Theme Toggle, Session-Based Scores, and Number Support
 */

// ===========================
//  THEME MANAGEMENT
// ===========================
function initTheme() {
    const savedTheme = localStorage.getItem("hangman_theme") || "dark";
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("hangman_theme", newTheme);
    
    const btn = document.getElementById("theme-toggle");
    btn.style.transition = "transform 0.3s ease";
    btn.style.transform = "translateY(-50%) rotate(360deg)";
    setTimeout(() => {
        btn.style.transform = "translateY(-50%) rotate(0deg)";
    }, 300);
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const icon = document.getElementById("theme-icon");
    
    if (theme === "light") {
        icon.textContent = "☀️";
        document.getElementById("theme-toggle").title = "Switch to Dark Mode";
    } else {
        icon.textContent = "🌙";
        document.getElementById("theme-toggle").title = "Switch to Light Mode";
    }
}

// ===========================
//  STATE
// ===========================
let gameState = {
    active: false,
    displayWord: "",
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrong: 6,
    gameOver: false,
    won: false,
    hintVisible: false,
};

// Session-based scores (reset on browser close)
let scores = {
    wins: parseInt(sessionStorage.getItem("hangman_wins") || "0"),
    losses: parseInt(sessionStorage.getItem("hangman_losses") || "0"),
    streak: parseInt(sessionStorage.getItem("hangman_streak") || "0"),
};

const BODY_PARTS = [
    "head",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
];

const DEAD_FACE = [
    "left-eye-1",
    "left-eye-2",
    "right-eye-1",
    "right-eye-2",
    "sad-mouth",
];

const HAPPY_FACE = ["happy-left-eye", "happy-right-eye", "happy-mouth"];

// ===========================
//  INITIALIZATION
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    buildKeyboard();
    updateScoreboard();
    setupKeyboardListener();
    showWelcomeMessage();
});

function showWelcomeMessage() {
    const isNewSession = !sessionStorage.getItem("hangman_session_started");
    if (isNewSession) {
        sessionStorage.setItem("hangman_session_started", "true");
        console.log("🎮 New game session started! Scores reset.");
    }
}

function buildKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    
    // Letters A-Z
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const letter of letters) {
        const key = document.createElement("button");
        key.className = "key";
        key.id = `key-${letter}`;
        key.textContent = letter;
        key.dataset.letter = letter;
        key.addEventListener("click", () => handleGuess(letter));
        keyboard.appendChild(key);
    }
    
    // Add a line break for better layout
    const lineBreak = document.createElement("div");
    lineBreak.style.width = "100%";
    lineBreak.style.height = "0";
    keyboard.appendChild(lineBreak);
    
    // Numbers 0-9
    const numbers = "0123456789";
    for (const num of numbers) {
        const key = document.createElement("button");
        key.className = "key key-number";
        key.id = `key-${num}`;
        key.textContent = num;
        key.dataset.letter = num;
        key.addEventListener("click", () => handleGuess(num));
        keyboard.appendChild(key);
    }
}

function setupKeyboardListener() {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        const key = e.key.toUpperCase();
        
        // Check if it's a letter (A-Z) or number (0-9)
        if (/^[A-Z0-9]$/.test(key)) {
            handleGuess(key);
        }
        if (e.key === "Enter") {
            startNewGame();
        }
    });
}

// ===========================
//  API CALLS
// ===========================
async function startNewGame() {
    try {
        const response = await fetch("/api/new-game", { method: "POST" });
        const data = await response.json();

        gameState = {
            active: true,
            displayWord: data.display_word,
            guessedLetters: [],
            wrongGuesses: 0,
            maxWrong: data.max_wrong,
            gameOver: false,
            won: false,
            hintVisible: false,
            hint: data.hint,
            category: data.category,
            wordLength: data.word_length,
        };

        resetHangman();
        resetKeyboard();
        clearMessage();
        clearConfetti();
        updateWordDisplay(data.display_word);
        updateCategory(data.category);
        updateHint(data.hint);
        updateLives(data.max_wrong);
        hideHintText();

        const btn = document.getElementById("new-game-btn");
        btn.textContent = "🔄 New Game";
    } catch (err) {
        console.error("Error starting new game:", err);
        showMessage("Failed to start new game. Please try again.", "info");
    }
}

async function handleGuess(letter) {
    if (!gameState.active || gameState.gameOver) return;

    const key = document.getElementById(`key-${letter}`);
    if (!key || key.classList.contains("correct") || key.classList.contains("wrong")) {
        return;
    }

    try {
        const response = await fetch("/api/guess", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ letter }),
        });

        const data = await response.json();

        if (data.error) {
            return;
        }

        gameState.displayWord = data.display_word;
        gameState.guessedLetters = data.guessed_letters;
        gameState.wrongGuesses = data.wrong_guesses;
        gameState.gameOver = data.game_over;
        gameState.won = data.won;

        if (data.correct) {
            key.classList.add("correct");
        } else {
            key.classList.add("wrong");
            showBodyPart(data.wrong_guesses - 1);
        }

        updateWordDisplay(data.display_word, data.game_over, data.won, data.answer);
        updateLives(data.max_wrong - data.wrong_guesses);

        if (data.game_over) {
            gameState.active = false;
            disableAllKeys();

            if (data.won) {
                handleWin(data.answer);
            } else {
                handleLoss(data.answer);
            }
        }
    } catch (err) {
        console.error("Error processing guess:", err);
    }
}

// ===========================
//  UI UPDATES
// ===========================
function updateWordDisplay(displayWord, gameOver = false, won = false, answer = "") {
    const container = document.getElementById("word-display");
    container.innerHTML = "";

    if (gameOver && answer) {
        for (const char of answer) {
            if (char === " ") {
                const space = document.createElement("span");
                space.className = "space";
                container.appendChild(space);
            } else {
                const letterEl = document.createElement("span");
                letterEl.className = "letter";
                letterEl.textContent = char;
                if (won) {
                    letterEl.classList.add("won-reveal");
                } else if (gameState.guessedLetters.includes(char)) {
                    letterEl.classList.add("revealed");
                } else {
                    letterEl.classList.add("answer-reveal");
                }
                container.appendChild(letterEl);
            }
        }
    } else {
        const chars = displayWord.split(" ");
        let i = 0;
        for (const char of chars) {
            if (char === "" && i > 0) {
                const space = document.createElement("span");
                space.className = "space";
                container.appendChild(space);
            } else {
                const letterEl = document.createElement("span");
                letterEl.className = "letter";
                if (char !== "_") {
                    letterEl.textContent = char;
                    letterEl.classList.add("revealed");
                } else {
                    letterEl.textContent = "";
                }
                container.appendChild(letterEl);
            }
            i++;
        }
    }
}

function updateCategory(category) {
    const badge = document.getElementById("category-badge");
    const text = document.getElementById("category-text");
    text.textContent = category;
    badge.classList.add("visible");
}

function updateHint(hint) {
    const box = document.getElementById("hint-box");
    const text = document.getElementById("hint-text");
    text.textContent = hint;
    box.classList.add("visible");
}

function updateLives(remaining) {
    const el = document.getElementById("lives-text");
    const hearts = "❤️".repeat(Math.max(0, remaining));
    const empty = "🖤".repeat(Math.max(0, gameState.maxWrong - Math.max(0, remaining)));

    if (remaining <= 0) {
        el.textContent = `💀 No lives`;
        el.style.color = "#ef4444";
    } else if (remaining <= 2) {
        el.textContent = `${hearts}${empty} ${remaining} ${remaining === 1 ? "life" : "lives"}`;
        el.style.color = "#ef4444";
    } else {
        el.textContent = `${hearts}${empty} ${remaining} lives`;
        el.style.color = "";
    }
}

function showMessage(text, type = "info") {
    const box = document.getElementById("message-box");
    box.textContent = text;
    box.className = `message-box visible ${type}`;
}

function clearMessage() {
    const box = document.getElementById("message-box");
    box.textContent = "";
    box.className = "message-box";
}

function updateScoreboard() {
    document.getElementById("wins").textContent = scores.wins;
    document.getElementById("losses").textContent = scores.losses;
    document.getElementById("streak").textContent = scores.streak;
}

function saveScores() {
    sessionStorage.setItem("hangman_wins", scores.wins);
    sessionStorage.setItem("hangman_losses", scores.losses);
    sessionStorage.setItem("hangman_streak", scores.streak);
}

// ===========================
//  HANGMAN DRAWING
// ===========================
function resetHangman() {
    BODY_PARTS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove("visible", "danger");
        }
    });
    DEAD_FACE.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("visible");
    });
    HAPPY_FACE.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("visible");
    });
}

function showBodyPart(index) {
    if (index >= 0 && index < BODY_PARTS.length) {
        const el = document.getElementById(BODY_PARTS[index]);
        if (el) {
            el.classList.add("visible");
            if (index >= 4) {
                el.classList.add("danger");
            }
        }
    }
}

function showDeadFace() {
    DEAD_FACE.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("visible");
    });
}

function showHappyFace() {
    const head = document.getElementById("head");
    if (head && head.classList.contains("visible")) {
        HAPPY_FACE.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.add("visible");
        });
    }
}

// ===========================
//  KEYBOARD MANAGEMENT
// ===========================
function resetKeyboard() {
    const keys = document.querySelectorAll(".key");
    keys.forEach((key) => {
        key.classList.remove("correct", "wrong", "disabled");
    });
}

function disableAllKeys() {
    const keys = document.querySelectorAll(".key");
    keys.forEach((key) => {
        if (
            !key.classList.contains("correct") &&
            !key.classList.contains("wrong")
        ) {
            key.classList.add("disabled");
        }
    });
}

// ===========================
//  HINT TOGGLE
// ===========================
function toggleHint() {
    const btn = document.getElementById("hint-toggle");
    const text = document.getElementById("hint-text");

    gameState.hintVisible = !gameState.hintVisible;

    if (gameState.hintVisible) {
        text.classList.add("visible");
        btn.textContent = "💡 Hide Hint";
        btn.classList.add("active");
    } else {
        text.classList.remove("visible");
        btn.textContent = "💡 Show Hint";
        btn.classList.remove("active");
    }
}

function hideHintText() {
    const btn = document.getElementById("hint-toggle");
    const text = document.getElementById("hint-text");
    text.classList.remove("visible");
    btn.textContent = "💡 Show Hint";
    btn.classList.remove("active");
    gameState.hintVisible = false;
}

// ===========================
//  WIN / LOSE HANDLERS
// ===========================
function handleWin(answer) {
    scores.wins++;
    scores.streak++;
    saveScores();
    updateScoreboard();

    showHappyFace();

    const messages = [
        `🎉 Brilliant! "${answer}" is correct!`,
        `🏆 You nailed it! "${answer}"!`,
        `⭐ Outstanding! "${answer}"!`,
        `🚀 Correct! "${answer}"!`,
        `💯 Perfect! Streak: ${scores.streak}!`,
    ];
    showMessage(messages[Math.floor(Math.random() * messages.length)], "win");
    launchConfetti();
}

function handleLoss(answer) {
    scores.losses++;
    scores.streak = 0;
    saveScores();
    updateScoreboard();

    showDeadFace();

    const messages = [
        `💀 Game over! The word was "${answer}"`,
        `😵 So close! It was "${answer}"`,
        `📚 The answer was "${answer}"`,
        `🔍 The word was "${answer}"`,
    ];
    showMessage(messages[Math.floor(Math.random() * messages.length)], "lose");
}

// ===========================
//  CONFETTI EFFECT
// ===========================
function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 120;
    const confettiPieces = [];
    const colors = [
        "#00d4ff",
        "#7c3aed",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#ec4899",
        "#06b6d4",
        "#8b5cf6",
    ];

    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 8 + 4,
            h: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 2 + 1.5,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 8 - 4,
            opacity: Math.random() * 0.5 + 0.5,
        });
    }

    let frameCount = 0;
    const maxFrames = 180;

    function animate() {
        if (frameCount >= maxFrames) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach((piece) => {
            ctx.save();
            ctx.translate(piece.x + piece.w / 2, piece.y + piece.h / 2);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.globalAlpha = piece.opacity * (1 - frameCount / maxFrames);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
            ctx.restore();

            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += piece.rotationSpeed;

            if (piece.y > canvas.height) {
                piece.y = -10;
                piece.x = Math.random() * canvas.width;
            }
        });

        frameCount++;
        requestAnimationFrame(animate);
    }

    animate();
}

function clearConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", () => {
    const canvas = document.getElementById("confetti-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});