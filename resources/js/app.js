function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
}

const messages = document.getElementById('chat-messages');

if (messages) scrollToBottom(messages);

document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', e => {
        if (!form.checkValidity()) {
            e.preventDefault()
            e.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)
})
