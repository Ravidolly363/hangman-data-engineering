"""
Tamil Movie related words and Tamil hints for the Hangman game.
Each entry is a dict with 'word', 'hint', and 'category'.
"""

WORDS = [

    # --- Rajinikanth Movies ---
    {"word": "BAASHA", "hint": "ஆட்டோ டிரைவராக இருக்கும் மனிதரின் கும்பல் தலைவன் கடந்தகாலம்", "category": "Rajinikanth"},
    {"word": "PADAYAPPA", "hint": "ஹீரோ மற்றும் நீலாம்பரியின் எதிர்ப்பு கதைக்களம்", "category": "Rajinikanth"},
    {"word": "SIVAJI", "hint": "ஊழலை எதிர்த்து போராடும் வெளிநாட்டில் இருந்து வரும் இளைஞர்", "category": "Rajinikanth"},
    {"word": "ENTHIRAN", "hint": "மனித உணர்வுகளை பெறும் ரோபோ பற்றிய கதை", "category": "Rajinikanth"},
    {"word": "KABALI", "hint": "தன் மனைவியை தேடும் மலேசிய டான்", "category": "Rajinikanth"},
    {"word": "PETTA", "hint": "ஹோஸ்டல் வார்டனின் மர்மமான கடந்தகாலம்", "category": "Rajinikanth"},
    {"word": "THALAPATHI", "hint": "நட்பு மற்றும் நம்பிக்கையை மையமாக கொண்ட கதை", "category": "Rajinikanth"},
    {"word": "DARBAR", "hint": "மும்பையில் குற்றவாளிகளை எதிர்க்கும் போலீஸ் அதிகாரி", "category": "Rajinikanth"},
    {"word": "LINGAA", "hint": "கிராமத்திற்கு அணை கட்டும் தாத்தாவின் கதை", "category": "Rajinikanth"},
    {"word": "ANNAATTHE", "hint": "தங்கையை பாதுகாக்கும் அண்ணன்", "category": "Rajinikanth"},

    # --- Vijay Movies ---
    {"word": "GILLI", "hint": "கபடி வீரர் ஒரு பெண்ணை காப்பாற்றும் கதை", "category": "Vijay"},
    {"word": "THUPPAKKI", "hint": "தீவிரவாதிகளை எதிர்க்கும் இராணுவ அதிகாரி", "category": "Vijay"},
    {"word": "MERSAL", "hint": "மூன்று வேடங்களில் நடித்த ஹீரோ", "category": "Vijay"},
    {"word": "MASTER", "hint": "ஜூவெனில் பள்ளியில் வேலை செய்யும் பேராசிரியர்", "category": "Vijay"},
    {"word": "LEO", "hint": "காபி ஷாப் உரிமையாளரின் வன்முறை கடந்தகாலம்", "category": "Vijay"},
    {"word": "THERI", "hint": "மகளை காப்பாற்ற மறைந்து வாழும் போலீஸ்", "category": "Vijay"},
    {"word": "BIGIL", "hint": "பெண்கள் கால்பந்து அணியை பயிற்சி அளிக்கும் கோச்", "category": "Vijay"},
    {"word": "KATHI", "hint": "விவசாயிகளுக்காக போராடும் இளைஞர்", "category": "Vijay"},
    {"word": "SARKAR", "hint": "அரசியலில் இறங்கும் கார்ப்பரேட் CEO", "category": "Vijay"},
    {"word": "POKIRI", "hint": "கும்பல் உறுப்பினராக நடிக்கும் மறைமுக போலீஸ்", "category": "Vijay"},

    # --- Ajith Movies ---
    {"word": "MANKATHA", "hint": "கிரிக்கெட் பந்தயம் தொடர்பான கொள்ளை கதை", "category": "Ajith"},
    {"word": "VISWASAM", "hint": "மகளுடன் மீண்டும் சேரும் தந்தை", "category": "Ajith"},
    {"word": "VALIMAI", "hint": "பைக் கும்பலை எதிர்க்கும் போலீஸ்", "category": "Ajith"},
    {"word": "BILLA", "hint": "டான் கதையின் ஸ்டைலிஷ் ரீமேக்", "category": "Ajith"},
    {"word": "VEDALAM", "hint": "அண்ணனின் மறைக்கப்பட்ட கடந்தகாலம்", "category": "Ajith"},
    {"word": "VEERAM", "hint": "கிராமத்து இளைஞரின் காதல் மற்றும் குடும்பம்", "category": "Ajith"},
    {"word": "AARAMBAM", "hint": "சைபர் குற்றங்களை பற்றிய த்ரில்லர்", "category": "Ajith"},
    {"word": "THUNIVU", "hint": "வங்கி கொள்ளையை மையமாக கொண்ட கதை", "category": "Ajith"},
    {"word": "YENNAIARINDHAAL", "hint": "போலீஸின் வாழ்க்கைப் பயணம்", "category": "Ajith"},
    {"word": "NERKONDAPAARVAI", "hint": "பெண்கள் உரிமை குறித்து பேசும் நீதிமன்ற கதை", "category": "Ajith"},

    # --- Kamal Movies ---
    {"word": "NAYAKAN", "hint": "ச்லம் பகுதியில் இருந்து டானாக உயர்ந்த மனிதர்", "category": "Kamal"},
    {"word": "INDIAN", "hint": "ஊழலை எதிர்த்து போராடும் சுதந்திரப் போராட்ட வீரர்", "category": "Kamal"},
    {"word": "ANBE SIVAM".replace(" ", ""), "hint": "மனித நேயத்தை பேசும் பயண கதை", "category": "Kamal"},
    {"word": "VIKRAM", "hint": "ரகசிய மிஷனில் ஈடுபடும் அதிகாரி", "category": "Kamal"},
    {"word": "DASAVATHARAM", "hint": "பத்து வேடங்களில் நடித்த ஹீரோ", "category": "Kamal"},
    {"word": "APOORVASAGODHARARGAL", "hint": "குறும்படமான மனிதனின் பழிவாங்கும் கதை", "category": "Kamal"},
    {"word": "THEVARMAGAN", "hint": "கிராமத்து அரசியல் மற்றும் குடும்ப கதை", "category": "Kamal"},
    {"word": "HEYRAM", "hint": "வரலாற்று பின்னணியில் அமைந்த கதை", "category": "Kamal"},
    {"word": "PANCHATANTHIRAM", "hint": "நகைச்சுவை கலந்த நண்பர்கள் கதை", "category": "Kamal"},
    {"word": "UNNAIPOL ORUVAN".replace(" ", ""), "hint": "தீவிரவாதத்தை எதிர்க்கும் கதை", "category": "Kamal"},

]