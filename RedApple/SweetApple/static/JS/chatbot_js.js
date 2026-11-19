let questions = [
    {
        question: "Do you know how to sow soil?",
        options: {
            a: "Yes, it's my speciality",
            b: "Not yet, still figuring out the tools",
            c: "It wouldn't have crossed my mind"
        },
        correctAnswer: "a",
        correctResponse: "Excelent! We'll make you a gardener in no time!",
        incorrectResponse: "Nope. But we can try again!"
    },
    {
        question: "How would you water this plant?",
        options: {
            a: "You tilt the watering can",
            b: "If you kiss it enough it'll nourish it",
            c: "I'm not sure"
        },
        correctAnswer: "a",
        correctResponse: "Excelent! We'll make you a gardener in no time!",
        incorrectResponse: "Nope. But we can try again!"
    },
    {
        question: "How do you pull out the weeds?",
        options: {
            a: "You hack it with your scythe",
            b: "You reach around, twist the stem and pull!",
            c: "If you close your eyes they'll go away"
        },
        correctAnswer: "b",
        correctResponse: "Excelent! We'll make you a gardener in no time!",
        incorrectResponse: "Nope. But we can try again!"
    }
];

let currentQuestionIndex = 0;
let chatContainer = document.getElementById("chat-container");
let chatForm = document.getElementById("chat-form");
let userInput = document.getElementById("user-input");

displayQuestion();

function displayQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let optionsHTML = Object.keys(currentQuestion.options)
        .map(key => `${key}. ${currentQuestion.options[key]}`)
        .join(" | ");

    let botResponse = document.createElement("div");
    botResponse.classList.add("message");
    botResponse.innerHTML = `<strong>Bot:</strong> ${currentQuestion.question}<br>${optionsHTML}`;

    chatContainer.appendChild(botResponse);
    scrollChatContainerToBottom();
}

function scrollChatContainerToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let userResponse = userInput.value.toLowerCase().trim();
    if (userResponse === "") return;

    let userMessage = document.createElement("div");
    userMessage.classList.add("message");
    userMessage.innerHTML = `<strong>You:</strong> ${userResponse}`;
    chatContainer.appendChild(userMessage);

    let currentQuestion = questions[currentQuestionIndex];
    let botResponse = document.createElement("div");
    botResponse.classList.add("message");
    botResponse.innerHTML = '<strong>Bot: </strong>';

    if (userResponse === currentQuestion.correctAnswer) {
        botResponse.innerHTML += currentQuestion.correctResponse;
    } else {
        botResponse.innerHTML += currentQuestion.incorrectResponse;
    }

    chatContainer.appendChild(botResponse);
    
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    userInput.value = "";

    setTimeout(() => {
        displayQuestion();
        scrollChatContainerToBottom();
    }, 800);
});