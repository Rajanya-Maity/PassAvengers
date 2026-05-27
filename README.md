# 🔐 PassAvengers — Password Strength Checker
> Built by [Rajanya Maity](https://github.com/Rajanya-Maity)
A clean, real-time password strength checker built with **Python (Flask)** and a sky-blue + canary-yellow themed frontend. The animated sliding meter shifts from red → orange → green as your password gets stronger.

## ✨ Features

- Real-time strength analysis of your password is available as you type
- Animated strength meter (red → orange → green) indicates how string your password is 'so far.'
- 8 criteria checked: length, uppercase, lowercase, digits, special characters, common-password detection
- Show/hide password toggle is available
- Fully responsive design

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Rajanya-Maity/PassAvengers.git
cd passwordChecker
```

### 2. Create a virtual environment (recommended)
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the app
```bash
python app.py
```

### 5. Open in browser
Visit: [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 📁 Project Structure

```
password-checker/
├── app.py               # Flask backend — strength logic
├── requirements.txt     # Python dependencies
├── templates/
│   └── index.html       # Main HTML page
└── static/
    ├── css/
    │   └── style.css    # All styling
    └── js/
        └── main.js      # Frontend interactions
```

## 🛠 Tech Stack

|  Layer   |         Technology           |
|----------|------------------------------|
| Backend  | Python 3, Flask              |
| Frontend | HTML5, CSS3, Vanilla JS      |
| Fonts    | Syne, DM Mono (Google Fonts) |

## 📜 License

MIT — free to use and modify.
