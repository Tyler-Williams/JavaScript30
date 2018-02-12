//  Globals
const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const buttons = document.querySelectorAll('[data-time]')
let countdown //  Variable for setInterval

//  Events
buttons.forEach(button => button.addEventListener('click', startTimer))
document.customForm.addEventListener('submit', function (e) {
  e.prevetnDefault()                  //  Prevent Page Reload
  const minutes = this.minutes.value  
  this.reset()                        //  Reset The Value
  timer(minutes * 60)
})

//  Functions
function timer (seconds) {
  clearInterval(countdown)            //  Clear any timers
  const now = Date.now()              //  Get the current time
  const then = now + seconds * 1000   //  Add secconds to current time to get end time in ms

  displayTimeLeft(seconds)

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000)  //  Get the current time and calculate how many seconds remain
    if (secondsLeft < 0) {
      clearInterval(countdown)      
      displayEndTime(then)
      document.title = 'Countdown Timer'
      return
    }
    displayTimeLeft(secondsLeft)
    displayEndTime(then)
  }, 1000)
}

function displayTimeLeft (seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = Math.floor(seconds % 60)
  const display = `${hours > 0 && hours < 10 ? '0' : ''}${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`

  document.title = display
  timerDisplay.textContent = display
  console.log(hours, minutes, secondsLeft)
}

function displayEndTime (timestamp) {
  const end = new Date(timestamp)
  const hour = end.getHours()
  const minute = end.getMinutes()
  const secconds = end.getSeconds()

  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minute < 10 ? '0' : ''}${minute}`
}

function startTimer () {
  const secconds = parseInt(this.dataset.time)
  timer(secconds)
}