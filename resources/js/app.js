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
});

const imageInputs = document.querySelectorAll('input[type="file"]');
const avatarPreview = document.querySelector('.avatar-preview');
const imageContainer = document.querySelector('#multiple-img-preview');

imageInputs.forEach(imgInp => {
    imgInp.onchange = evt => {
        const files = imgInp.files;
        
        if (avatarPreview && files) {
            avatarPreview.src = URL.createObjectURL(files[0]);
        }

        if (imageContainer) {
            imageContainer.innerHTML = '';
            if (files.length > 5 || files.length == 0) {
                imageContainer.innerHTML = '<span class="fs-1 fw-medium text-body-tertiary">Bilder Vorschau</span>';
                return imgInp.setCustomValidity('File Error!');
            }

            imgInp.setCustomValidity('');

            for (const file of files) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.width = '20%';
                img.style.height = '250px';

                imageContainer.appendChild(img);
            }
        }
    }
});