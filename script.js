const iframes = document.querySelectorAll('iframe')
const inputs = document.querySelectorAll('input')
const x = '50vw'
const y = '50vh'

iframes[1].style.left = x
iframes[2].style.top  = y
iframes[3].style.left = x
iframes[3].style.top  = y
inputs[1].style.left = x
inputs[2].style.top  = y
inputs[3].style.left = x
inputs[3].style.top  = y

const iframesData = [
  { isHighQuality: false, channel: '', isMuted: false },
  { isHighQuality: false, channel: '', isMuted: true },
  { isHighQuality: false, channel: '', isMuted: true },
  { isHighQuality: false, channel: '', isMuted: true }
]


function updateSrc(index) {
  iframes[index].src = `https://player.twitch.tv/?parent=r0landd.github.io&quality=${
    iframesData[index].isHighQuality ? '720p60' : '480p30'
  }&channel=${iframesData[index].channel}${
    iframesData[index].isMuted ? '&muted=true' : ''
  }`
}

const extractChannel = url => url.slice(22)

let appearedIframesCounter = 0
inputs[4].addEventListener('input', event => {
  const eventTarget = event.target;
  if (eventTarget.value.startsWith('https://www.twitch.tv/')) appearedIframesCounter++
  else return
  if (eventTarget.hasAttribute('placeholder')) eventTarget.removeAttribute('placeholder')
  iframesData[appearedIframesCounter - 1].channel = extractChannel(eventTarget.value)
  eventTarget.value = ''
  updateSrc(appearedIframesCounter - 1)
  if (appearedIframesCounter > 3) {
    eventTarget.remove()
    document.body.requestFullscreen()
  }
})





let mouseDownedInputIndex
inputs.forEach((input, index) => {
  input.addEventListener('mousedown', () => mouseDownedInputIndex = index )
  input.addEventListener('mouseup', () => {
    if (mouseDownedInputIndex == index) return
    const mouseUppedInputLeftCoordinate = iframes[index].style.left
    const mouseUppedInputTopCoordinate  = iframes[index].style.top
    iframes[index].style.left = iframes[mouseDownedInputIndex].style.left
    iframes[index].style.top  = iframes[mouseDownedInputIndex].style.top
    inputs [index].style.left = inputs [mouseDownedInputIndex].style.left
    inputs [index].style.top  = inputs [mouseDownedInputIndex].style.top
    iframes[mouseDownedInputIndex].style.left = mouseUppedInputLeftCoordinate
    iframes[mouseDownedInputIndex].style.top  = mouseUppedInputTopCoordinate
    inputs [mouseDownedInputIndex].style.left = mouseUppedInputLeftCoordinate
    inputs [mouseDownedInputIndex].style.top  = mouseUppedInputTopCoordinate
  })

  input.addEventListener('input', event => {
    const value = event.target.value
    const iframe = iframes[index]
    switch (value.toUpperCase()) {
      case 'M':
        iframesData[input].isMuted = iframesData[input].isMuted ? false : true
        updateSrc(index)
        break
      case 'C':
        window.open(
          `https://www.twitch.tv/popout/${ iframesData[input].channel }/chat`,
          '_blank'
        )
        break
      case 'Q':
        iframesData[input].isHighQuality = iframesData[input].isHighQuality ? false : true
        updateSrc(index)
        break
      case 'R':
        iframe.src = iframe.src
        break
      case 'K':
        iframes.forEach(iframe => iframe.src = iframe.src)
        break
      case 'D':
        iframe.removeAttribute('src')
        break
      default:
        if (value[1]) {
          iframesData[input].channel = extractChannel(value)
          updateSrc(index)
        }
    }
    event.target.value = ''
  })
})


const toggle = event => {
  event.preventDefault()
  document.fullscreenElement
  ? document.exitFullscreen()
  : document.body.requestFullscreen()
}
document.addEventListener('keydown', event => event.key.toUpperCase() == 'F' ? toggle(event) :1)
document.addEventListener('dblclick', toggle)
