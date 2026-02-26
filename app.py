"""
Hangman Game - Data Engineering Edition
Flask Backend - Production Ready with Number Support
"""

import os
import random
import string
from flask import Flask, render_template, jsonify, request, session

from words import WORDS

# === Explicitly set template and static folder paths ===
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

# Use environment variable for secret key in production
app.secret_key = os.environ.get("SECRET_KEY", "data-engineering-hangman-secret-key-2024")

MAX_WRONG_GUESSES = 6


def get_new_game():
    """Initialize a new game state."""
    word_data = random.choice(WORDS)
    return {
        "word": word_data["word"].upper(),
        "hint": word_data["hint"],
        "category": word_data["category"],
        "guessed_letters": [],
        "wrong_guesses": 0,
        "game_over": False,
        "won": False,
    }


def get_display_word(word, guessed_letters):
    """Return the word with unguessed letters replaced by underscores."""
    return " ".join(
        letter if letter in guessed_letters or letter == " " else "_"
        for letter in word
    )


@app.route("/")
def index():
    """Serve the main game page."""
    return render_template("index.html")


@app.route("/api/new-game", methods=["POST"])
def new_game():
    """Start a new game."""
    game = get_new_game()
    session["game"] = game
    display = get_display_word(game["word"], game["guessed_letters"])
    return jsonify({
        "display_word": display,
        "hint": game["hint"],
        "category": game["category"],
        "wrong_guesses": 0,
        "max_wrong": MAX_WRONG_GUESSES,
        "guessed_letters": [],
        "game_over": False,
        "won": False,
        "word_length": len(game["word"]),
    })


@app.route("/api/guess", methods=["POST"])
def guess():
    """Process a letter/number guess."""
    game = session.get("game")
    if not game:
        return jsonify({"error": "No active game. Start a new game."}), 400

    if game["game_over"]:
        return jsonify({"error": "Game is already over. Start a new game."}), 400

    data = request.get_json()
    letter = data.get("letter", "").upper().strip()

    # Validate input - allow letters (A-Z) and numbers (0-9)
    if not letter or len(letter) != 1:
        return jsonify({"error": "Invalid input. Please guess a single character."}), 400
    
    # Check if it's a valid letter or number
    if letter not in string.ascii_uppercase and letter not in string.digits:
        return jsonify({"error": "Invalid input. Please guess a letter or number."}), 400

    if letter in game["guessed_letters"]:
        return jsonify({"error": f"You already guessed '{letter}'. Try another."}), 400

    # Process the guess
    game["guessed_letters"].append(letter)
    correct = letter in game["word"]

    if not correct:
        game["wrong_guesses"] += 1

    # Check win/lose
    display = get_display_word(game["word"], game["guessed_letters"])
    all_letters_guessed = all(
        l in game["guessed_letters"] or l == " " for l in game["word"]
    )

    if all_letters_guessed:
        game["game_over"] = True
        game["won"] = True

    if game["wrong_guesses"] >= MAX_WRONG_GUESSES:
        game["game_over"] = True
        game["won"] = False

    session["game"] = game

    response = {
        "display_word": display,
        "hint": game["hint"],
        "category": game["category"],
        "wrong_guesses": game["wrong_guesses"],
        "max_wrong": MAX_WRONG_GUESSES,
        "guessed_letters": game["guessed_letters"],
        "correct": correct,
        "game_over": game["game_over"],
        "won": game["won"],
        "letter": letter,
    }

    # Reveal the word if game is over
    if game["game_over"]:
        response["answer"] = game["word"]

    return jsonify(response)


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Return all available categories."""
    categories = sorted(set(w["category"] for w in WORDS))
    return jsonify({"categories": categories})


@app.route("/health")
def health():
    """Health check endpoint for monitoring."""
    return jsonify({"status": "healthy", "service": "hangman-game"})


if __name__ == "__main__":
    # Only for local development
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)