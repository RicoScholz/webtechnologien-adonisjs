function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
}

const messages = document.getElementById('chat-messages');

if (messages) scrollToBottom(messages);
