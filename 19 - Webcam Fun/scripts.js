//  GLOBALS
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const greenScreenSliders = document.querySelectorAll('.rgb input')
const radioGroup = document.querySelectorAll('.radio-group')
const radioInputs = document.querySelectorAll('.radio-group input')
const externalVideo = document.querySelector('#extermalVideo')
const greenScreenControls = document.querySelector('.controls')
const videoParams = {}
const testVideo = "https://player.vimeo.com/external/194837908.sd.mp4?s=c350076905b78c67f74d7ee39fdb4fef01d12420&profile_id=164"
let paused = false

videoParams.src = 'default'
videoParams.default = testVideo

//  EVENTS
$(document).ready(function() {
  $('select').material_select();
  //$('#effectSelector').on('change', handleSelection)  
 const options = document.querySelectorAll('.select-wrapper li')
 options.forEach((option) => option.addEventListener('mouseup', handleSelection))
});
video.addEventListener('canplay', paintToCanvas)
video.addEventListener('click', () => {
  if (paused) {
    video.play()
    paused = false
  } else {
    video.pause()
    paused = true
  }
})

canvas.addEventListener('click', () => {
  if (paused) {
    video.play()
    paused = false
  } else {
    video.pause()
    paused = true
  }
})

radioGroup.forEach((radio) => radio.addEventListener('click', handleRadioGroup))
greenScreenControls.addEventListener('mousedown', () => alert('Green Screen Effect must be slected in the Effect\'s selection drop down'))

//  FUNCTIONS
function handleRadioGroup (e) {
  let selectedInput = this.querySelector('input')
  console.log(selectedInput)
  radioInputs.forEach((input) => input.checked = input == selectedInput)

  videoParams.src = selectedInput.id
  getVideo()
}

function getVideo() {
  switch (videoParams.src){
    case 'webcam':
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        console.log(localMediaStream)
        video.src = window.URL.createObjectURL(localMediaStream)
      })
      .catch(err => {
        console.error(`OH NO!!!`, err)
      })
      break
    case 'custom':
      console.log(externalVideo.value)
      video.src = externalVideo.value
      break
    case 'default':
    default:
      video.src = videoParams.default
    break
  }

  try {
    video.play()
  } catch(err) {
    console.error('Problem playing video, switching to default source')
    radioInputs.forEach((input) => input.checked = input.id == 'default')
    videoParams.src = 'defalt'
    getVideo()
  }
}

function paintToCanvas () {
  const width = video.videoWidth
  const height = video.videoHeight
  
  canvas.width = width
  canvas.height = height

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0, 0, width, height)
    pixels = getEffectPixels(pixels)

    ctx.putImageData(pixels, 0, 0)
  }, 41)
}

function getEffectPixels (pixels) {
  let effectPixels
  if (videoParams.effect == 'Green Screen Effect') {
      effectPixels = greenScreen(pixels)
      greenScreenSliders.forEach((slider) => slider.disabled = false)
  } else {
    greenScreenSliders.forEach((slider) => slider.disabled = true)
    switch (videoParams.effect) {
      case 'Red Effect':
        effectPixels = redEffect(pixels)
        break
      case 'Green Effect':
        effectPixels = greenEffect(pixels)
        break
      case 'Blue Effect':
        effectPixels = blueEffect(pixels)
        break
      case 'Black and White':
        effectPixels = blackWhiteEffect(pixels)
        break
      case 'Pink and Green':
        effectPixels = pinkGreenEffect(pixels)
        break
      case 'Negative Effect':
        effectPixels = negitiveEffect(pixels)
        break
      case 'RGB Split Effect':
        effectPixels = rgbSplit(pixels)
        break    
      default:
        effectPixels = pixels
        break
    }
}
  return pixels
}

function takePhoto () {
  console.log('snapping photo')
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')

  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'test')
  link.innerHTML = `<img src="${data}" alt="Test" />`
  strip.insertBefore(link, strip.firstChild)
}

function handleSelection (e) {
  console.log(this.textContent)
  videoParams.effect = this.textContent
}

//  EFFECTS
function redEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 0] + 100 //  RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50  //  GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 //  BLUE
  }
  return pixels
}

function greenEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 0] - 50  //  RED
    pixels.data[i + 1] = pixels.data[i + 1] + 100 //  GREEN
    pixels.data[i + 2] = pixels.data[i + 2] - 50  //  BLUE
  }
  return pixels
}

function blueEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 0] - 50  //  RED
    pixels.data[i + 1] = pixels.data[i + 1] * 0.5 //  GREEN
    pixels.data[i + 2] = pixels.data[i + 2] + 100 //  BLUE
  }
  return pixels
}

function blackWhiteEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 2]  //  RED
    pixels.data[i + 1] = pixels.data[i + 0]  //  GREEN
    pixels.data[i + 2] = pixels.data[i + 1]  //  BLUE
  }
  return pixels
}

function pinkGreenEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 1]  //  RED
    pixels.data[i + 1] = pixels.data[i + 2]  //  GREEN
    pixels.data[i + 2] = pixels.data[i + 0]  //  BLUE
  }
  return pixels
}

function negitiveEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = 255 - pixels.data[i + 0]  //  RED
    pixels.data[i + 1] = 255 - pixels.data[i + 1]  //  GREEN
    pixels.data[i + 2] = 255 - pixels.data[i + 2]  //  BLUE
  }
  return pixels
}

function rgbSplit (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i - 150] = pixels.data[i + 0] //  RED
    pixels.data[i + 100] = pixels.data[i + 1] //  GREEN
    pixels.data[i - 150] = pixels.data[i + 2] //  BLUE
  }
  return pixels
}

function greenScreen(pixels) {
  const levels = {};

  greenScreenSliders.forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
// END EFFECTS
getVideo()