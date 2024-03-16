import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
    getRandomColorPairs,
    showPlayAgainButton,
    hidePlayAgainButton,
    setTimerText,
    creatTimer
} from './utils.js'
import {
    getColorBackground,
    getColorElementList,
    getPlayAgainButton,
    getTimerElement,
    getColorListElement,
    getInActiceColorList
} from './selectors.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = creatTimer({
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTimerFinsih
})

function handleTimerChange(seconds) {
    // console.log('change:', seconds)
    const fullSeconds = `0${seconds}s`.slice(-3)
    setTimerText(fullSeconds)
};
function handleTimerFinsih() {
   console.log('finish')
   gameStatus = GAME_STATUS.FINISHED;

   setTimerText('YOU LOSE 😭')
   showPlayAgainButton()
};

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
console.log(getRandomColorPairs(PAIRS_COUNT))

function handleColorClick(element) {
    const shouldLocking = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
    if (!element || shouldLocking) return;

    element.classList.add('active')

    // Seve click cell to seclections
    selections.push(element)
    if (selections.length < 2) return;

    // check math
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor === secondColor;

    if (isMatch) {
        // check match
        const isWin = getInActiceColorList().length === 0

        if (isWin) {
            // show replay
            showPlayAgainButton()
            const showButtons = getPlayAgainButton()
            // showButtons.addEventListener('click', hidePlayAgainButton)

            // show You Win
            setTimerText('YOU WIN 🎆')
            timer.clear();
            gameStatus = GAME_STATUS.FINISHED;

        }
        selections = []
        return;
    }

    // in case of not match
    // remove active class for two li
    gameStatus = GAME_STATUS.BLOCKING

    setTimeout(() => {
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')

        selections = [];

        // race-condition check with handleFinish
        if (gameStatus !== GAME_STATUS.FINISHED){
            gameStatus = GAME_STATUS.PLAYING
        }
    }, 400)


    // reset selections for the next turn 
}

function initColor() {
    // random 8 color
    const colorList = getRandomColorPairs(PAIRS_COUNT)

    // bind to li > div.overlay
    const liList = getColorElementList()

    liList.forEach((liElement, idx) => {
        liElement.dataset.color = colorList[idx]

        const overlayElement = liElement.querySelector('.overlay')
        if (overlayElement) overlayElement.style.backgroundColor = colorList[idx]

    })

}


function attchEvenForColorList() {
    // const liLs = document.querySelectorAll('li')
    // for (const li of liLs) {
    //     li.addEventListener('click', () => {
    //         li.classList.add('active')
    //     })
    // }
    const ulElement = getColorListElement();
    if (!ulElement) return;

    ulElement.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') return;

        handleColorClick(event.target)
        console.log(event.target)
    })
}

function resetGame() {
    // reset global vars
    gameStatus = GAME_STATUS.PLAYING;
    selections = []

    // - reset DOM element
    // - remove actice class from li
    const colorList = getColorElementList();
    for (const color of colorList) {
        color.classList.remove('active')
    }
    // - hide replay button
    hidePlayAgainButton()
    // - clear timer text
    setTimerText("")
    // - re-generate now color
    initColor()
    // - start a new game
    startTimer();

}

function attchEvenForAgainButton() {
    const playAgainButton = getPlayAgainButton()
    if (!playAgainButton) return;

    playAgainButton.addEventListener('click', resetGame)

}

function startTimer() {
    timer.start();
}

// main
(() => {
    startTimer();
    initColor();
    attchEvenForColorList();
    attchEvenForAgainButton();
})()