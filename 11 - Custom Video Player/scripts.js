// GLOBALS
let mousedown = false
let isFullScreen = false

// SELECT ELEMENTS
const player      = document.querySelector('.player')
const video       = player.querySelector('.viewer')
const progress    = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle      = player.querySelector('.toggle')
const skipButtons = player.querySelectorAll('[data-skip]')
const ranges      = player.querySelectorAll('.player__slider')
const fullScreen  = player.querySelector('#full-screen')

// EVENTS
video.addEventListener('click', togglePlay)           // Video click event
video.addEventListener('play', updatePlayButton)      // Video Playing event
video.addEventListener('pause', updatePlayButton)     // Video Paused event
video.addEventListener('timeupdate', handleProgress)  // Video playing time event

progress.addEventListener('click', scrub)                             // Handles click on progressBar
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))  // Handles mouse move on progressBar while the mouse is down
progress.addEventListener('mousedown', () => mousedown = true)        // Changes gloabal variable 'mousedown' to true when the mouse is pressed
progress.addEventListener('mouseup', () => mousedown = false)         // Changes gloabal variable 'mousedown' to false when the mouse is released

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))    // Slider change event
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate)) // Slider change event
skipButtons.forEach(button => button.addEventListener('click', skip))           // Skip button click event

toggle.addEventListener('click', togglePlay)            // Play/Pause button click event
fullScreen.addEventListener('click', toggleFullScreen)  // Full-screen button click event

// FUNCTIONS

//Play is paused and pause if playing
function togglePlay() { 
  if(video.paused) {
    video.play()
  } else {
    video.pause()
  }
}

// Change the button icon depending on the video playing status
function updatePlayButton () {
  toggle.querySelector('.material-icons').textContent = this.paused ? 'play_arrow' : 'pause'
}

// Skip FWD or REV based on the button's dataset-skip value
function skip () {
  console.log(`skipping ${this.dataset.skip}`)
  video.currentTime += parseFloat(this.dataset.skip)
}

// Change playback speed or volume to the slider value
function handleRangeUpdate () {
  video[this.name] = this.value
}

// Changes the display of the progress bar based on the video percent complete
function handleProgress () {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
}

// Changesthe video time as a percent to match where the progress bar was clicked
function scrub (e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = scrubTime
}

function toggleFullScreen () {
  if (!isFullScreen){
    player.style.maxWidth = 'none'
    player.style.width = '100%'
    isFullScreen = true
  } else {
    player.style.maxWidth = '750px'
    player.style.width = `${video.videoWidth}px`
    isFullScreen = false
  }
  fullScreen.querySelector('.material-icons').textContent = isFullScreen ? 'fullscreen_exit' : 'fullscreen'
}
