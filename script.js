const iframes        = document.querySelectorAll('iframe')
const is768          = window.screen.height == 768
const leftCoordinate = `calc(${ is768 ? '32000vw/683' : '50vw' })`
const topCoordinate  = `calc(${ is768 ? '18000vw/683' : '28.125vw' })`
const inputs         = document.querySelectorAll('input')

iframes.forEach(iframe => {
  iframe.style.width  = leftCoordinate
  iframe.style.height = topCoordinate
})
iframes[1].style.left = leftCoordinate
iframes[2].style.top  = topCoordinate
iframes[3].style.left = leftCoordinate
iframes[3].style.top  = topCoordinate
inputs [1].style.left = leftCoordinate
inputs [2].style.top  = topCoordinate
inputs [3].style.left = leftCoordinate
inputs [3].style.top  = topCoordinate

const start          = 'https://player.twitch.tv/?'
const muted          = 'muted=true&'
const low            = `quality=${ is768 ? '360p30' : '720p60' }&`
const high           = `quality=${ is768 ? '720p60' : 'chunked' }&`
const middle         = 'parent=r0landd.github.io&channel='
const extractChannel = url => url.slice(22)

let appearedIframesCounter = 0
inputs[4].addEventListener('input', event => {
  if (appearedIframesCounter > 1) !document.fullscreenElement ? document.body.requestFullscreen() :1
  if (appearedIframesCounter < 1) event.target.removeAttribute('placeholder')
  iframes[++appearedIframesCounter - 1].src =
    start + muted + high + middle + extractChannel(event.target.value)
  event.target.value = ''
  if (appearedIframesCounter > iframes.length - 1)
    event.target.remove()
})

let mouseDownedInputIndex
inputs.forEach((input, index) => {
  if (index > 3) return
  input.style.width  = leftCoordinate
  input.style.height = topCoordinate
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
    const src = iframe.src
    const isMuted = src[26] == 'm'
    const isQualityLow = src[ isMuted ? 45 : 34 ] == low[8]
    const isQualityChunked = !is768 && !isQualityLow
    const channel = src.slice(
      isQualityChunked
        ? isMuted
          ? 92
          : 81
        : isMuted
          ? 91
          : 80
    )
    switch (value.toUpperCase()) {
      case 'M':
        iframe.src =
            start
          + (isMuted ? '' : muted)
          + src.slice( isMuted ? 37 : 26 )
        break
      case 'C':
        window.open(
          `https://www.twitch.tv/popout/${ channel }/chat`,
          '_blank'
        )
        break
      case 'Q':
        iframe.src =
            start
          + (isMuted ? muted : '')
          + (isQualityLow ? high : low)
          + middle
          + channel
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
        if (value[1])
          iframe.src = start + muted + high + middle + extractChannel(value)
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
