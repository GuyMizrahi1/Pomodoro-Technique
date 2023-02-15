function init_timer(){
  showSlides(1);
  createTimer();
}
function init_alert(){
  showSlides(1);
  document.getElementById('id04').style.display='block';
}
// creart the dots in the bottom of the home screen by the number of text divs
var slideIndex = 1;

// showSlides(slideIndex);
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

// light up the relevant dot's slide
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
} 

// Get the sign up modal
var modal1 = document.getElementById('id01');

// Get the sign in modal
var modal2 = document.getElementById('id02');

// Get the start now modal
var modal3 = document.getElementById('id03');

// Get the start now modal
var modal4 = document.getElementById('id04');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal1 || event.target == modal2 || event.target == modal3 || event.target == modal4) {
        modal1.style.display = "none";
        modal2.style.display = "none";
        modal3.style.display = "none";
        modal4.style.display = "none";
    }
}

// for the Are you sure modal - set the new time elements
function setSureTimeElements(){
  localStorage.clear();
  let work = document.getElementById("work").innerText;
  let short_break_time = document.getElementById("short_break").innerText;
  let long_break_time = document.getElementById("long_break").innerText;
  localStorage.setItem("work_time", 60*work);
  localStorage.setItem("short_break_time", 60*short_break_time);
  localStorage.setItem("long_break_time", 60*long_break_time);
  TIME_LIMIT = localStorage.getItem("work_time");
  timeLeft = TIME_LIMIT
  WARNING_THRESHOLD = TIME_LIMIT/2; 
  ALERT_THRESHOLD = TIME_LIMIT/5;
  console.log("im surreeeee--------work_time: " + localStorage.getItem("work_time") + ", short_break_time:"
   + localStorage.getItem("short_break_time") + ", long_break_time:" + localStorage.getItem("long_break_time"));
}

// -------------------------------------------- Timer --------------------------------------------
// define the timer intervals, at the next part it would be by the client
const FULL_DASH_ARRAY = 283;
let TIME_LIMIT = localStorage.getItem("work_time");
// let TIME_LIMIT = 25;
let WARNING_THRESHOLD = TIME_LIMIT/2;
let ALERT_THRESHOLD = TIME_LIMIT/5;
//  define the colors by proportionate part.
let COLOR_CODES= {
  info: {
    color: "green"
  },
  warning: {
    color: "yellow",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
}
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let isRunning = false;
let work_interval = true;
let short_interval = false;
let long_interval = false;
let four_round_couner= 0;
let last, next = ''

// for being able to create the color changing animation I wrote the content from the HTML file inside the js file
// because HTML can't use javascript variables, HTML is not a programming language, it's a markup language.
function createTimer(){
  setSureTimeElements();
  document.getElementById("myTimer").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining ${COLOR_CODES.info.color}"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
  </div>
  `;
  fisrtLight();
  console.log("--------work_time: " + localStorage.getItem("work_time") + ", short_break_time:"
  + localStorage.getItem("short_break_time") + ", long_break_time:" + localStorage.getItem("long_break_time"));
}

// first automatic element i would like to have is indication for work status
// status bar functionality
function fisrtLight(){
  lightItUp('work-step');
}

// both functions responsible for setting the indication for the current status
function lightItUp(step) {
  document.getElementById(step).className += " active";
}
function turnOff(step) {
  document.getElementById(step).className = "btn btn-outline-dark";
}

// the play button is start the animation for the timer 
function startTimer() {
  if (isRunning || timeLeft === 0) {
    return;
  }
  isRunning = true;
  timerId = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      arr = status_check();
      last = arr[0];
      next = arr[1];
      onTimesUp(last);
      if (next != null){
        isRunning = false;
        lightItUp(next);
        timeLeft = TIME_LIMIT;
      }
    }
  }, 1000);
}

// check what was the last status to be abke to determine the next status
function status_check(){
  if (work_interval){
    work_interval = false;
    short_interval = true;
    updateTime("short_break_time");
    restartTimer();
    return ['work-step', 'short-step'];
  }
  if (short_interval){
    four_round_couner += 1;
    if (four_round_couner >= 4){
      short_interval = false;
      long_interval = true;
      updateTime("long_break_time");
      restartTimer();
      return ['short-step', 'long-step'];
    }else{
      short_interval = false;
      work_interval = true;
      updateTime("work_time");
      restartTimer();
      return ['short-step', 'work-step'];
    }
  }
  if (long_interval){
    long_interval = false;
    return ['long-step', null];
  }
}

// for each interval would be unique warning and alert thresholds
function updateTime(upcomingTime){
    TIME_LIMIT = localStorage.getItem(upcomingTime);
    WARNING_THRESHOLD = TIME_LIMIT/2;
    ALERT_THRESHOLD = TIME_LIMIT/5;
}

// in the next part it would run automatically 4 times in a row
function mainFunction(){
  while (four_round_couner <= 4){
    startTimer();
  }
}

// stop button click
function stopTimer() {
  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
  }
}

// Alert tone for the moment a session will complete
function playSound() {
  var audio = new Audio('./ringtone/time_up.mp3');
  audio.play();
}

// set of actions to be executed when the session ends
function onTimesUp(last) {
  stopTimer();
  turnOff(last);
  playSound();
}

// responsible for restart the session
function restartButton(){
  stopTimer();
  restartTimer();
}

function restartTimer() {
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(TIME_LIMIT);
}

// creat the format of minutes and seconds
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  var { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= ALERT_THRESHOLD) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= WARNING_THRESHOLD) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }else{
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
      document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
}

// helper function for the circle settings
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// create the circle
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
