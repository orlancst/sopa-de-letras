const inputRows = document.getElementById("rows");
const inputColumns = document.getElementById("columns");
const inputText = document.querySelectorAll(".input-control");
const characterBox = document.querySelectorAll(".character-box");

let selectedWord = '';
let rows, columns;
let previousPosR = [[0,0],[0,0]];
let previousPosRs = [
    {
    pointer: 'start',
    column: 0,
    row: 0
    }, {
    pointer: 'end',
    column: 0,
    row: 0
    }
]

let mainPointer = 0;
let secondaryPointer = 0;
let target = '';

window.addEventListener("load", function (event) {
  setTableDimensions(true);
});

inputText.forEach((iField) => {
  iField.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || e.key === "Backspace") {
    } else {
      e.preventDefault();
    }
  });
});

function setTableDimensions(def) {
  

  if (def == true) {
    rows = 8;
    columns = 8;
  } else {
    if (inputRows.value == "" && inputColumns.value == "") {
      console.log("You must set all values.");
      return false;
    }

    rows = parseInt(inputRows.value);
    columns = parseInt(inputColumns.value);

    let diff = Math.abs(rows - columns);

    if (rows < 5 || columns < 5) {
      console.log("Cannot set less than 5 rows or columns.");
      return false;
    }

    if (rows > 11 || columns > 11) {
      console.log("Cannot set more than 11 rows or columns.");
      return false;
    }

    if (diff > 4) {
      console.log(
        "You can set the values with a significant difference (max. 4)"
      );
      return false;
    }
  }

  let str = ``;

  for (let i = 1; i <= columns; i++) {
    str += "<tr>";

    for (let j = 1; j <= rows; j++) {
        let letter = getLetter();

      str += `<td class="character-box unselected-box pos-${j}-${i}" data-row="${j}" data-colum="${i}" data-value="${letter}" onclick="selectLetter(${j}, ${i})">${letter}</td>`;
    }

    str += "</tr>";
  }

  selectedWord = '';
  document.querySelector("#sopa-de-letras table tbody").innerHTML = str;
}

function getLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    return letters.charAt(Math.random() * letters.length)

}

function selectLetter(colPos, rowPos) {
    const selLetter = document.querySelector(`.pos-${colPos}-${rowPos}`);

    

    if (selectedWord.length == 0) {
        
        previousPosR[0][0] = colPos;
        previousPosR[0][1] = rowPos;
        selectedWord += selLetter.innerText;
        mark(selLetter);
        
    } else if (selectedWord.length == 1) {

        const canSelect = validateIfAvailable(selectedWord.length, previousPosR[0], colPos, rowPos);

        if (!canSelect) {
            unmarkAll();
            previousPosR[0][0] = colPos;
            previousPosR[0][1] = rowPos;
            selectedWord = selLetter.innerText;
            mark(selLetter);
            return false;
        }
        previousPosR[1][0] = colPos;
        previousPosR[1][1] = rowPos;
        selectedWord += selLetter.innerText;
        mark(selLetter);

        
    } else {

        const canSelect = validateIfAvailable(selectedWord.length, previousPosR[1], colPos, rowPos);

        if (!canSelect) {
            
            unmarkAll();
            previousPosR[0][0] = colPos;
            previousPosR[0][1] = rowPos;
            selectedWord = selLetter.innerText;
            mark(selLetter);
            return false;
        } else {

            previousPosR[1][0] = colPos;
            previousPosR[1][1] = rowPos;
            selectedWord += selLetter.innerText;
            mark(selLetter);
        }

    }

    
}

function validateIfAvailable(wordLength, previousPos, actualColPos, actualRowPos) {

    if (wordLength == 1) {

        // ESQUINAS

        if (previousPos[0] == 1 && previousPos[1] == 1) {

            if (actualColPos == previousPos[0] + 1 && actualRowPos == previousPos[1]) { //right
                target = 'RIGHT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] + 1) { //down
                target = 'DOWN';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] + 1 && actualRowPos == previousPos[1] + 1) { //diagonal down right
                target = 'DOWN RIGHT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else {
                console.error('#############');
            }
            
        } else if (previousPos[0] == columns && previousPos[1] == 1) {

            if (actualColPos == previousPos[0] - 1 && actualRowPos == previousPos[1]) { //left
                target = 'LEFT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] + 1) { //down
                target = 'DOWN';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] - 1 && actualRowPos == previousPos[1] + 1) { //diagonal down left
                target = 'DOWN LEFT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else {
                console.error('#############');
            }

        } else if (previousPos[0] == 1 && previousPos[1] == rows) {

            if (actualColPos == previousPos[0] + 1 && actualRowPos == previousPos[1]) { //right
                target = 'RIGHT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] - 1) { //up
                target = 'UP';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] + 1 && actualRowPos == previousPos[1] - 1) { //diagonal up right
                target = 'UP RIGHT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else {
                console.error('#############');
            }

        } else if (previousPos[0] == columns && previousPos[1] == rows) {

            if (actualColPos == previousPos[0] - 1 && actualRowPos == previousPos[1]) { //left
                target = 'LEFT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] - 1) { //up
                target = 'UP';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else if (actualColPos == previousPos[0] - 1 && actualRowPos == previousPos[1] - 1) { //diagonal up left
                target = 'UP LEFT';
                mainPointer ++;
                secondaryPointer = null;
                return true;

            } else {
                console.error('#############');
            }

        } else if ((previousPos[0] != 1 && previousPos[0] != columns) && previousPos[1] == 1) { // LATERAL VERTICAL SUPERIOR
            
            if (actualColPos == previousPos[0] -1 &&  actualRowPos == previousPos[1]) { //left
                target = 'LEFT';
                return true;

            } else if (actualColPos == previousPos[0] -1 &&  actualRowPos == previousPos[1] +1) { //diagonal down left
                target = 'DOWN LEFT';
                return true;

            } else if (actualColPos == previousPos[0] &&  actualRowPos == previousPos[1] +1) { // down
                target = 'DOWN';
                return true;

            } else if (actualColPos == previousPos[0] +1 &&  actualRowPos == previousPos[1] +1) { //diagonal down right
                target = 'DOWN RIGHT';
                return true;

            } else if (actualColPos == previousPos[0] +1 &&  actualRowPos == previousPos[1]) { // right
                target = 'RIGHT';
                return true;

            } else {
                console.error('#############');
            }

        } else if ((previousPos[0] != 1 && previousPos[0] != columns) && previousPos[1] == rows) { // LATERAL VERTICAL INFERIOR

            if (actualColPos == previousPos[0] -1 &&  actualRowPos == previousPos[1]) { //left
                target = 'LEFT';
                return true;

            } else if (actualColPos == previousPos[0] -1 && actualRowPos == previousPos[1] -1) { //diagonal up left
                target = 'UP LEFT';
                return true;

            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] -1) { // up
                target = 'UP';
                return true;

            } else if (actualColPos == previousPos[0] +1 && actualRowPos == previousPos[1] -1) { //diagonal up right
                target = 'UP RIGHT';
                return true;

            } else if (actualColPos == previousPos[0] +1 && actualRowPos == previousPos[1]) { // right
                target = 'RIGHT';
                return true;

            } else {
                console.error('#############');
            }
            
        } else if (previousPos[0] == 1 && (previousPos[1] != 1 && previousPos[1] != rows)) { // LATERAL HORIZONTAL IZQUIERDA

            if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] -1) { //up
                target = 'UP';
                return true;

            } else if (actualColPos == previousPos[0] +1 &&  actualRowPos == previousPos[1] -1) { //diagonal up right
                target = 'UP RIGHT';
                return true;

            } else if (actualColPos == previousPos[0] +1 &&  actualRowPos == previousPos[1]) { // right
                target = 'RIGHT';
                return true;

            } else if (actualColPos == previousPos[0] +1 &&  actualRowPos == previousPos[1] +1) { //diagonal down right
                target = 'DOWN RIGHT';
                return true;

            } else if (actualColPos == previousPos[0] &&  actualRowPos == previousPos[1] +1) { // down
                target = 'DOWN';
                return true;

            } else {
                console.error('#############');
            }

        } else if (previousPos[0] == columns && (previousPos[1] != 1 && previousPos[1] != rows)) { // LATERAL HORIZONTAL DERECHA

            if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] -1) { //up
                target = 'UP';
                return true;

            } else if (actualColPos == previousPos[0] -1 &&  actualRowPos == previousPos[1] -1) { //diagonal up left
                target = 'UP LEFT';
                return true;

            } else if (actualColPos == previousPos[0] -1 &&  actualRowPos == previousPos[1]) { // left
                target = 'LEFT';
                return true;

            } else if (actualColPos == previousPos[0] -1 &&  actualRowPos == previousPos[1] +1) { //diagonal down left
                target = 'DOWN LEFT';
                return true;

            } else if (actualColPos == previousPos[0] &&  actualRowPos == previousPos[1] +1) { //diagonal down
                target = 'DOWN';
                return true;

            } else {
                console.error('#############');
            }

        } else { // MEDIO

            if (actualColPos == previousPos[0] -1 && actualRowPos == previousPos[1] -1) { //diagonal up left
                target = 'UP LEFT';
                return true;

            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] -1) { //up
                target = 'UP';
                return true;
                
            } else if (actualColPos == previousPos[0] +1 && actualRowPos == previousPos[1] -1) { //diagonal up right
                target = 'UP RIGHT';
                return true;
                
            } else if (actualColPos == previousPos[0] -1 && actualRowPos == previousPos[1]) { //left 
                target = 'LEFT';
                return true;
                
            } else if (actualColPos == previousPos[0] +1 && actualRowPos == previousPos[1]) { //right 
                target = 'RIGHT';
                return true;
                
            } else if (actualColPos == previousPos[0] -1 && actualRowPos == previousPos[1] +1) { //diagonal down left
                target = 'DOWN LEFT';
                return true;
                
            } else if (actualColPos == previousPos[0] && actualRowPos == previousPos[1] +1) { //down 
                target = 'DOWN';
                return true;
                
            } else if (actualColPos == previousPos[0] +1 && actualRowPos == previousPos[1] +1) { //diagonal down right
                target = 'DOWN RIGHT';
                return true;

            } else {
                console.error('#############');
            }

        }

    } else {

        console.log(actualColPos, actualRowPos);

        if (target == 'UP' || target == 'DOWN') {

        } else if (target == 'LEFT' || target == 'RIGHT') {

            if ((previousPosR[0][0] +1 == actualColPos) || (previousPosR[1][0] -1 == actualColPos)) {
                console.log('match!');
            }

        } else if (target == 'UP LEFT' || target == 'DOWN RIGHT') {
            
        } else if (target == 'DOWN LEFT' || target == 'UP RIGHT') {
            
        }

    }

}

function mark(selectedMark) {
    selectedMark.classList.toggle("unselected-box");
    selectedMark.classList.toggle("selected-box");
}

function unmarkAll() {
    const selLetter = document.querySelectorAll(`.selected-box`);

    selLetter.forEach((sel) => {
        sel.classList.toggle('selected-box');
        sel.classList.toggle('unselected-box');
    })
}