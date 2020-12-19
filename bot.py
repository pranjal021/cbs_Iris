
import zulip

# Send a private message
def send_message(message, email):
    client.send_message({
        "type": "private",
        "to": email,
        "content": message,
    })
    
