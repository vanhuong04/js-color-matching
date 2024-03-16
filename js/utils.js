import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffile(arr) {
  if (!Array.isArray(arr) || arr.length < + 2) return arr

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp

  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors

  const colorsList = []
  const heuList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  // random "count" color
  for (let i = 0; i < count; i++) {
    // randomColor funtion is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: heuList[i % heuList.length],
    })

    colorsList.push(color)
  }

  // double current color list
  const fullColorList = [...colorsList, ...colorsList]

  // shuffle it
  shuffile(fullColorList)

  return fullColorList;
}

export function showPlayAgainButton() {
  const showButton = getPlayAgainButton()
  showButton.classList.add('show')
}
export function hidePlayAgainButton() {
  const showButton = getPlayAgainButton()
  showButton.classList.remove('show')

}
export function setTimerText(text) {
  const timerElement = getTimerElement();
  timerElement.textContent = text
}

export function creatTimer({ seconds, onChange, onFinish }) {
  let intervalId = null;

  function start() {
    clear();

    let currentSecond = seconds;
    intervalId = setInterval(() => {
      if (onChange) onChange(currentSecond)

      currentSecond--;

      if(currentSecond < 0) {
        clear()

        onFinish?.();
      }
    }, 1000) 
  };

  function clear() {
    clearInterval(intervalId)
  };
  return {
    start,
    clear
  }
}