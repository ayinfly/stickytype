// document consts
const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const tryAgainBtn = document.querySelector(".try-again");
const timeTag = document.querySelector(".time span b");
const accuracyTag = document.querySelector(".accuracy span");
const wpmTag = document.querySelector(".wpm span");
const rawTag = document.querySelector(".raw span");
const cpmTag = document.querySelector(".cpm span");
const errorsTag = document.querySelector(".errors span");
const modeTag = document.querySelector(".mode span");
const modeLeft = document.querySelector(".time p")

// mode buttons
const timeBtn = document.querySelector(".type-time");
const wordsBtn = document.querySelector(".type-words");
const amt15Btn = document.querySelector(".amt-15");
const amt30Btn = document.querySelector(".amt-30");
const amt45Btn = document.querySelector(".amt-45");
const amt60Btn = document.querySelector(".amt-60");
const amt90Btn = document.querySelector(".amt-90");
const amt120Btn = document.querySelector(".amt-120");

// important vars
let timer,
maxTime = 10000000,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;
let dataSent = false;
let wpm = 0;
let maxWords = 15;
let wordsLeft = 15;
let wordPoints = [];
let curLine = 0;
let lineCnt = 0;
let lineDif = 0;
let lineTop = 0;
let lineMeasured = false;

// sent vars
let wpm_total = 0;
let wpm_raw = 0;
let accuracy = 0;
let mode_type = 'words';
let mode_amt = 15

// generate a random paragraph and adds each letter as a span to the typing text element
function loadParagraph() {
    wordPoints = [];
    // prevents repeated data from sending
    dataSent = false;
    let curText = "";
    if (mode_type == 'time') {
        for (let i = 0; i < 100; i++) {
            let ranIndex = Math.floor(Math.random() * words.length);
            curText += words[ranIndex].toLowerCase();
            curText += " ";
        }
        curText = curText.slice(0, -1); 
    }
    if (mode_type == 'words') {
        for (let i = 0; i < mode_amt; i++) {
            let ranIndex = Math.floor(Math.random() * words.length);
            curText += words[ranIndex].toLowerCase();
            curText += " ";
            wordPoints.push(curText.length);
        }
        curText = curText.slice(0, -1);
    }
    typingText.innerHTML = "";
    curText.split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
    lineTop = typingText.querySelectorAll("span")[charIndex].getBoundingClientRect().top;
    lineCnt = 0;
    lineDif = 0;
    lineMeasured = false;
}

// checks typing stats
function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");
        curLine = characters[charIndex].getBoundingClientRect().top;
        if (lineTop != curLine && lineMeasured == false ) {
            lineDif = curLine - lineTop;
            lineMeasured = true;
        }
        // console.log(lineTop);
        // console.log(curLine);
        if (lineMeasured == true && (curLine - lineTop) / lineDif > 2) {
            lineCnt += 1;
            document.getElementById("p-text").style.top = "-" + (lineCnt * lineDif) + "px";
        } else if (lineMeasured == true && (curLine - lineTop) / lineDif < 2 && lineCnt > 0) {
            lineCnt -= 1;
            document.getElementById("p-text").style.top = "-" + (lineCnt * lineDif) + "px";
        }

        wordsLeft = maxWords;
        for (let i = 0; i < wordPoints.length; i++) {
            if (charIndex >= wordPoints[i]) {
                wordsLeft -= 1;
            }
        }
        if (mode_type != 'time') {
            timeTag.innerText = wordsLeft;
        }
        wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
        accuracy = Math.round(((charIndex - mistakes) * 100) / charIndex);
        accuracyTag.innerText = accuracy + "%";
        wpm_raw = Math.round((charIndex  / 5) / (maxTime - timeLeft) * 60);
        errorsTag.innerText = mistakes;
        rawTag.innerText = wpm_raw;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
        wpm_total = wpm;
        wpm_raw = Math.round((charIndex  / 5) / (maxTime - timeLeft) * 60);
        accuracy = Math.round(((charIndex - mistakes) * 100) / charIndex);
        if (dataSent == false) {
            dataSent = true;
            sendData()
        }
    }   
}

// timer
function initTimer() {
    if(timeLeft > 0) {
            timeLeft--;
            if (mode_type == 'time') {
                timeTag.innerText = timeLeft;
            }
            wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
            wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
        wpm_total = wpm;
        wpm_raw = Math.round((charIndex  / 5) / (maxTime - timeLeft) * 60);
        accuracy = Math.round(((charIndex - mistakes) * 100) / charIndex);
        if (dataSent == false) {
            dataSent = true;
            sendData()
        }
    }
}

// game reset
function resetGame() {
    loadParagraph();
    clearInterval(timer);
    if (mode_type == 'time') {
        maxTime = mode_amt;
    } else {
        maxTime = 10000000;
        maxWords = mode_amt;
    }
    timeLeft = maxTime;
    wordsLeft = maxWords;
    charIndex = mistakes = isTyping = 0;
    modeLeft.innerText = mode_type + " left:"
    inpField.value = "";
    if (mode_type == 'time') {
        timeTag.innerText = timeLeft;
    } else {
        timeTag.innerText = wordsLeft;
    }
    wpmTag.innerText = 0;
    accuracyTag.innerText = 0;
    cpmTag.innerText = 0;
    modeTag.innerText = mode_type + " " + mode_amt
}

// button workaround cuz idk how to do this
function modeBtns() {
    timeBtn.className = "btn btn-light type-time";
    wordsBtn.className = "btn btn-light type-words";
}
function timeMode() {
    mode_type = 'time';
    modeBtns();
    timeBtn.className = "btn btn-secondary type-time";
    resetGame();
}
function wordsMode() {
    mode_type = 'words';
    modeBtns();
    wordsBtn.className = "btn btn-secondary type-words";
    resetGame();
}
function amtBtns() {
    amt15Btn.className = "btn btn-light amt-15";
    amt30Btn.className = "btn btn-light amt-30";
    amt45Btn.className = "btn btn-light amt-45";
    amt60Btn.className = "btn btn-light amt-60";
    amt90Btn.className = "btn btn-light amt-90";
    amt120Btn.className = "btn btn-light amt-120";
}
function amt15() {
    mode_amt = 15
    amtBtns();
    amt15Btn.className = "btn btn-secondary amt-15";
    resetGame();
}
function amt30() {
    mode_amt = 30
    amtBtns();
    amt30Btn.className = "btn btn-secondary amt-30";
    resetGame();
}
function amt45() {
    mode_amt = 45
    amtBtns();
    amt45Btn.className = "btn btn-secondary amt-45";
    resetGame();
}
function amt60() {
    mode_amt = 60
    amtBtns();
    amt60Btn.className = "btn btn-secondary amt-60";
    resetGame();
}
function amt90() {
    mode_amt = 90
    amtBtns();
    amt90Btn.className = "btn btn-secondary amt-90";
    resetGame();
}
function amt120() {
    mode_amt = 120
    amtBtns();
    amt120Btn.className = "btn btn-secondary amt-120";
    resetGame();
}
// button adders
loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
timeBtn.addEventListener("click", timeMode);
wordsBtn.addEventListener("click", wordsMode);
amt15Btn.addEventListener("click", amt15);
amt30Btn.addEventListener("click", amt30);
amt45Btn.addEventListener("click", amt45);
amt60Btn.addEventListener("click", amt60);
amt90Btn.addEventListener("click", amt90);
amt120Btn.addEventListener("click", amt120);

// data sending
function sendData() {
    let csrftoken = getCookie('csrftoken');
    $.ajax(
    {
        type:"POST",
        url: "/done/",
        headers: { "X-CSRFToken": csrftoken },
        data:{
            'wpm_total': wpm_total,
            'wpm_raw': wpm_raw,
            'accuracy': accuracy,
            'mode': mode_type + " " + mode_amt
        },
        success: function (data) {
            if (data.status == 1) {
                window.location.href = "/stats/" + data.username;
            } else {
                window.location.reload();
            }
        }
    })
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
