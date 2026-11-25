# Telegram typing bubble

An independent interaction proposal for Telegram. Three dots move in sequence while a contact is typing. On delivery, the same bubble expands to fit the actual message in 330 milliseconds.

## Try it

Download the repository and open `index.html` in a browser. No build or account is required. The composer acts as the sender and the chat above shows the recipient’s view. Everything runs locally.

1. Type a message. The recipient sees the indicator as soon as the draft contains text.
2. Press Enter or the arrow button to deliver it. Use Shift+Enter for a new line.
3. Try different lengths, clear a draft, or send several messages in succession. The component respects the system’s reduced-motion preference.

## Integrate the interaction

The `IncomingBubble` class in `bubble.js` takes a chat container. Call `setTyping(true)` on a typing event, `setTyping(false)` on cancellation, and `receive(text)` when a message arrives. The example connects these events locally. The component and demo use browser APIs and CSS.
