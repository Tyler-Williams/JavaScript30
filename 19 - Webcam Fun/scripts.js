//  GLOBALS
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
let paused = false

video.src = "https://player.vimeo.com/external/194837908.sd.mp4?s=c350076905b78c67f74d7ee39fdb4fef01d12420&profile_id=164"

//  EVENTS
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

//  FUNCTIONS
function getVideo() {
  // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  //   .then(localMediaStream => {
  //     console.log(localMediaStream);
  //     video.src = window.URL.createObjectURL(localMediaStream);
  //     video.play();
  //   })
  //   .catch(err => {
  //     console.error(`OH NO!!!`, err);
  //   });
  video.play()
}

function paintToCanvas () {
  const width = video.videoWidth
  const height = video.videoHeight
  
  canvas.width = width
  canvas.height = height

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0, 0, width, height)
    //pixels = redEffect(pixels)
    //pixels = rgbSplit(pixels)
    pixels = greenScreen(pixels)
    //ctx.globalAlpha = 0.1

    ctx.putImageData(pixels, 0, 0)
  }, 41)
}

function takePhoto () {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')

  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'test')
  link.innerHTML = `<img src="${data}" alt="Test" />`
  strip.insertBefore(link, strip.firstChild)
}

function redEffect (pixels) {
  for(let i = 0; i < pixels.data.length; i += 4){
    pixels.data[i + 0] = pixels.data[i + 0] + 100 //  RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50  //  GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 //  BLUE
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

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  console.log(levels)

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

getVideo()