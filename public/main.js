const socket = io();

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");

const nameInput = document.getElementById("name-input");

const messageForm = document.getElementById("message-form");

const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  //console.log(data);
  clientsTotal.innerText = `Total Clients: ${data}`;
});

socket.on("chat-message", (data) => {
  //console.log("chat-message", data);
  addMessageToUI(false, data);
});

function sendMessage() {
  console.log("send message");
  const message = messageInput.value;
  if (message === "") return;
  const data = {
    name: nameInput.value,
    message: message,
    dateTime: new Date(),
  };

  console.log(data);

  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  //var pastDate = new Date("2017-10-01T02:30");
  data.dateTime = fromNow(data.dateTime);
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      <p class="message">
        ${data.message}
        <span>${data.name} 🔹 ${data.dateTime}</span>
        ${data.message}
      </p>
    </li>
  `;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

/**
 * Implements all the behaviors of moment.fromNow(). Pass a
 * valid JavaScript Date object and the method will return the
 * time that has passed since that date in a human-readable
 * format. Passes the moment test suite for `fromNow()`.
 * See: https://momentjs.com/docs/#/displaying/fromnow/
 *
 * @example
 *
 *     var pastDate = new Date('2017-10-01T02:30');
 *     var message = fromNow(pastDate);
 *     //=> '2 days ago'
 *
 * @license
 *
 * Copyright 2023 David Leonard
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @param  {Date} Native JavaScript Date object
 * @return {string}
 */
function fromNow(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var years = Math.floor(seconds / 31536000);
  var months = Math.floor(seconds / 2592000);
  var days = Math.floor(seconds / 86400);

  if (days > 548) {
    return years + " years ago";
  }
  if (days >= 320 && days <= 547) {
    return "a year ago";
  }
  if (days >= 45 && days <= 319) {
    return months + " months ago";
  }
  if (days >= 26 && days <= 45) {
    return "a month ago";
  }

  var hours = Math.floor(seconds / 3600);

  if (hours >= 36 && days <= 25) {
    return days + " days ago";
  }
  if (hours >= 22 && hours <= 35) {
    return "a day ago";
  }

  var minutes = Math.floor(seconds / 60);

  if (minutes >= 90 && hours <= 21) {
    return hours + " hours ago";
  }
  if (minutes >= 45 && minutes <= 89) {
    return "an hour ago";
  }
  if (seconds >= 90 && minutes <= 44) {
    return minutes + " minutes ago";
  }
  if (seconds >= 45 && seconds <= 89) {
    return "a minute ago";
  }
  if (seconds >= 0 && seconds <= 45) {
    return "a few seconds ago";
  }
}

function scrollToBottom() {
  messageContainer.scrollTo = (0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
    `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
