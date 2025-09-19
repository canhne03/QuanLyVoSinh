from pyngrok import ngrok
from app import app  # import Flask app chính

# Mở ngrok tunnel
port = 5000
public_url = ngrok.connect(port)
print(f"Ngrok tunnel URL: {public_url}")

# Chạy Flask
app.run(port=port)
