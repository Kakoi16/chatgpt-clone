// Event listener untuk tombol "Enter" pada input
document.getElementById('user-input').addEventListener('keydown', function (e) {
    // Jika pengguna menekan Shift+Enter, tambahkan baris baru
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // Mencegah pengiriman pesan
        const input = document.getElementById('user-input');
        const cursorPosition = input.selectionStart;
        input.value = input.value.substring(0, cursorPosition) + '\n' + input.value.substring(cursorPosition);
        input.selectionEnd = cursorPosition + 1; // Memposisikan kursor setelah newline
    } 
    // Jika hanya menekan Enter, kirim pesan
    else if (e.key === 'Enter') {
        e.preventDefault(); // Mencegah perilaku default (newline di input textarea)
        document.getElementById('send-button').click(); // Trigger button click
    }
});

document.getElementById('send-button').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    addMessage('User', userInput);
    document.getElementById('user-input').value = ''; // Bersihkan input setelah dikirim

    // Show typing indicator for the bot
    showTypingIndicator();

    try {
        const response = await fetch(`/ask?message=${encodeURIComponent(userInput)}`);
        const data = await response.json();

        // Remove typing indicator before displaying the response
        hideTypingIndicator();

        if (data?.response) {
            addMessage('Kakoi', data.response);
        } else {
            const errorMessage = data.error ? `Error: ${data.error}` : 'Maaf, terjadi kesalahan.';
            addMessage('Kakoi', errorMessage, 'error');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage('Kakoi', 'Error: Tidak bisa terhubung ke server.', 'error');
    }
});

function addMessage(sender, message, type = 'default') {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'User' ? 'user-message' : 'bot-message');
    if (type === 'error') messageDiv.classList.add('error-message');

    // Define the code block pattern
    const codeBlockPattern = /```(.*?)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockPattern.exec(message)) !== null) {
        const textBeforeCode = message.substring(lastIndex, match.index);
        if (textBeforeCode) {
            formatTextBlocks(messageDiv, textBeforeCode, sender);
        }

        const language = match[1].trim();
        const code = match[2].trim();
        createCodeBlock(messageDiv, code, language);

        lastIndex = codeBlockPattern.lastIndex;
    }

    // Add any remaining text after the last code block
    const remainingText = message.substring(lastIndex);
    if (remainingText) {
        formatTextBlocks(messageDiv, remainingText, sender);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function formatTextBlocks(parentDiv, text, sender) {
    const paragraphs = text.split(/\n\s*\n|(?=\d+\.\s)|(?=\*\*)/g);

    paragraphs.forEach((paragraph) => {
        if (!paragraph) return; // Skip empty lines

        const trimmedText = paragraph.trim();

        if (trimmedText.match(/^\d+\.\s/)) {
            // Handle numbered list items
            const parts = trimmedText.split(/\s(.+)/);
            const listItem = document.createElement('li');
            listItem.innerHTML = `${escapeHTML(parts[0])} ${escapeHTML(parts[1])}`;
            let list = parentDiv.querySelector('ol') || document.createElement('ol');
            list.appendChild(listItem);
            if (!parentDiv.contains(list)) parentDiv.appendChild(list);
        } else if (trimmedText.startsWith('####')) {
            // Heading level 4
            const headingText = trimmedText.replace(/####/g, '').trim();
            const headingDiv = document.createElement('h4');
            headingDiv.textContent = headingText;
            parentDiv.appendChild(headingDiv);
        } else if (trimmedText.startsWith('###')) {
            // Heading level 3
            const headingText = trimmedText.replace(/###/g, '').trim();
            const headingDiv = document.createElement('h3');
            headingDiv.textContent = headingText;
            parentDiv.appendChild(headingDiv);
        } else {
            // Regular paragraph
            const textDiv = document.createElement('div');
            textDiv.textContent = trimmedText;
            parentDiv.appendChild(textDiv);
        }
    });
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('bot-message');
    typingDiv.innerHTML = '<em>Kakoi is typing...</em>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

function escapeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

function createCodeBlock(parentDiv, code, language) {
    const codeContainer = document.createElement('div');
    codeContainer.classList.add('code-container');

    const codeBlock = document.createElement('pre');
    codeBlock.classList.add('code-block');
    const codeElement = document.createElement('code');
    codeElement.innerHTML = escapeHTML(code);

    codeBlock.appendChild(codeElement);

    const copyButton = document.createElement('button');
    copyButton.innerText = `Copy ${language} Code`;
    copyButton.classList.add('copy-button');

    copyButton.addEventListener('click', () => {
        copyToClipboard(code);
        copyButton.innerText = 'Copied!';
        setTimeout(() => (copyButton.innerText = `Copy ${language} Code`), 2000);
    });

    codeContainer.appendChild(copyButton);
    codeContainer.appendChild(codeBlock);
    parentDiv.appendChild(codeContainer);
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}
