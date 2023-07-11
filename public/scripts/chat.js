var socket = io();

const cookies = parseCookies()
let form = document.getElementById('userInputForm');
let userChatInput = document.getElementById('userChatInput');
let messages = document.querySelector('.chat__conversation-board');
let username = "<%= String(user.username) %>"

const createMessageHTML = (username, msg) => {
    const isReversed = username === cookies.username ? 'reversed' : ''
    const template = `
    <div class="chat__conversation-board__message-container ${isReversed}">
        <div class="chat__conversation-board__message__person">
            <div class="chat__conversation-board__message__person__avatar">
                <!-- <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="${username} profile picture" /> -->
                <div class="profile-picture-letter"> ${username[0]} </div>
            </div>
            <span class="chat__conversation-board__message__person__nickname">${username}</span>
        </div>
        <div class="chat__conversation-board__message__context">
            <div class="chat__conversation-board__message__bubble"> <span>${msg}</span></div>
        </div>
        <div class="chat__conversation-board__message__options">
            <button class="btn-icon chat__conversation-board__message__option-button option-item emoji-button">
                <svg class="feather feather-smile sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
            </button>
            <button class="btn-icon chat__conversation-board__message__option-button option-item more-button">
                <svg class="feather feather-more-horizontal sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                </svg>
            </button>
        </div>
    </div>
    `
    return template
}

function parseCookies() {
    var cookies = document.cookie.split(';');
    var cookieObj = {};

    cookies.forEach(function (cookie) {
        var parts = cookie.trim().split('=');
        var name = decodeURIComponent(parts[0]);
        var value = decodeURIComponent(parts[1]);
        cookieObj[name] = value;
    });

    return cookieObj;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (userChatInput.value) {
        socket.emit('chat message', { username: cookies.username, msg: userChatInput.value }); // send message
        userChatInput.value = ''; // reset chat
    }
});

socket.on('chat message', function (res) {
    // console.log(res)
    let item = createMessageHTML(res.username, res.msg)
    messages.innerHTML += item
    messages.scrollTop = messages.scrollHeight;
});
