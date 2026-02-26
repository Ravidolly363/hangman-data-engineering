"""
Production server for Hangman Game
Uses Waitress WSGI server (for local testing only)
NOTE: Render.com does NOT use this file!
"""

import socket
import sys

try:
    from waitress import serve
    from app import app
except ImportError as e:
    print("\n❌ Error: Missing dependencies!")
    print("\nRun this command to install:")
    print("  pip install waitress\n")
    sys.exit(1)

if __name__ == "__main__":
    # Get local IP address
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except:
        local_ip = "Unable to detect"
    
    print(f"\n{'='*60}")
    print(f"  🎮 HANGMAN - Data Engineering Edition")
    print(f"  🚀 Production Server (Waitress)")
    print(f"  📍 LOCAL TESTING ONLY - Not used by Render.com")
    print(f"{'='*60}")
    print(f"\n  📱 Access the game from:")
    print(f"     • This computer:    http://localhost:8080")
    
    if local_ip != "Unable to detect":
        print(f"     • Your network:     http://{local_ip}:8080")
        print(f"     • Mobile/Tablet:    http://{local_ip}:8080")
    
    print(f"\n  💡 Make sure devices are on the same WiFi network!")
    print(f"  🔒 Press Ctrl+C to stop the server")
    print(f"{'='*60}\n")
    
    try:
        # Serve with Waitress (production-ready)
        serve(app, host='0.0.0.0', port=8080, threads=4)
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped gracefully. Goodbye! 👋\n")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}\n")
        sys.exit(1)