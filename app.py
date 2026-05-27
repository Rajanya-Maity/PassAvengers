from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)


def check_password_strength(password):
    score = 0
    feedback = []
    criteria = {
        "length_8": False,
        "length_12": False,
        "length_16": False,
        "uppercase": False,
        "lowercase": False,
        "digits": False,
        "special": False,
        "no_common": False,
    }

    # Length checks
    if len(password) >= 8:
        score += 10
        criteria["length_8"] = True
        feedback.append({"text": "At least 8 characters", "met": True})
    else:
        feedback.append({"text": "At least 8 characters", "met": False})

    if len(password) >= 12:
        score += 15
        criteria["length_12"] = True
        feedback.append({"text": "12+ characters", "met": True})
    else:
        feedback.append({"text": "12+ characters", "met": False})

    if len(password) >= 16:
        score += 10
        criteria["length_16"] = True
        feedback.append({"text": "16+ characters (excellent!)", "met": True})
    else:
        feedback.append({"text": "16+ characters (excellent!)", "met": False})

    # Character variety
    if re.search(r"[A-Z]", password):
        score += 15
        criteria["uppercase"] = True
        feedback.append({"text": "Uppercase letters (A–Z)", "met": True})
    else:
        feedback.append({"text": "Uppercase letters (A–Z)", "met": False})

    if re.search(r"[a-z]", password):
        score += 15
        criteria["lowercase"] = True
        feedback.append({"text": "Lowercase letters (a–z)", "met": True})
    else:
        feedback.append({"text": "Lowercase letters (a–z)", "met": False})

    if re.search(r"\d", password):
        score += 15
        criteria["digits"] = True
        feedback.append({"text": "Numbers (0–9)", "met": True})
    else:
        feedback.append({"text": "Numbers (0–9)", "met": False})

    if re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password):
        score += 20
        criteria["special"] = True
        feedback.append({"text": "Special characters (!@#$...)", "met": True})
    else:
        feedback.append({"text": "Special characters (!@#$...)", "met": False})

    # Common password check
    common_passwords = [
        "password", "123456", "12345678", "qwerty", "abc123",
        "monkey", "1234567", "letmein", "trustno1", "dragon",
        "baseball", "iloveyou", "master", "sunshine", "ashley",
        "bailey", "passw0rd", "shadow", "123123", "654321",
        "superman", "qazwsx", "michael", "football", "password1"
    ]
    if password.lower() not in common_passwords:
        score += 10  # smaller bonus to not tip balance
        criteria["no_common"] = True
        feedback.append({"text": "Not a common password", "met": True})
    else:
        score = min(score, 15)  # hard cap for common passwords
        feedback.append({"text": "Not a common password", "met": False})

    # Clamp score
    score = min(score, 100)

    # Determine label
    if score < 25:
        label = "Very Weak"
        color = "#e74c3c"
    elif score < 50:
        label = "Weak"
        color = "#e67e22"
    elif score < 70:
        label = "Moderate"
        color = "#f39c12"
    elif score < 85:
        label = "Strong"
        color = "#27ae60"
    else:
        label = "Very Strong"
        color = "#1e8449"

    return {
        "score": score,
        "label": label,
        "color": color,
        "feedback": feedback,
        "criteria": criteria,
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()
    password = data.get("password", "")
    result = check_password_strength(password)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
