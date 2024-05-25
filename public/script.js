const socket = io("http://localhost:3000");

const clientsTotal = document.getElementById("clients-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const messageTone = new Audio("/message-tone.mp3");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  6;
  messageInput.value != "" && sendMessage();
});

socket.on("clients-total", (data) => {
  clientsTotal.innerHTML = `Total clients: ${data}`;
});

function sendMessage() {
  //   console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  //   console.log("chat-received script.js", data);
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  messageTone.play();
  clearFeedback();
  const element = ` <li class=${
    isOwnMessage ? "message-left" : "message-right"
  }>
                        <p class="message">
                            ${data.message}
                            <span
                                >${isOwnMessage ? "Me" : data.name}
                                <i class="fa-solid fa-circle" style="color: #000"></i>${moment(
                                  data.dateTime
                                ).fromNow()}</span
                            >
                        </p>
                    </li>`;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", () => {
  socket.emit("feedback", { feedback: `✒️ ${nameInput.value} is typing...` });
});

messageInput.addEventListener("keypress", () => {
  socket.emit("feedback", { feedback: `✒️ ${nameInput.value} is typing...` });
});

messageInput.addEventListener("blur", () => {
  socket.emit("feedback", { feedback: "" });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
