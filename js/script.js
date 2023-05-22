// add html elements
let body = document.querySelector("body").innerHTML = `
    <h1>Mines: <span id="mines-count">0</span></h1>
    <input type="radio" id="beginner" value="Beginner" name="level" checked>
    <label for="beginner">Beginner</label>
    <input type="radio" id="middle" value="Middle" name="level">
    <label for="middle">Middle</label>
    <input type="radio" id="hard" value="Hard" name="level">
    <label for="hard">Hard</label><br><br>
    <button class="mew_btn">New Game</button>
    <h2>Click right mouse button to set flag</h2>
    <div id="board"></div>`; 

var board = [];
var rows = 10;
var columns = 10;
let middleLevel;    
let hardleLevel;    
let buttonMiddle = document.querySelector("#middle");
let buttonHard = document.querySelector("#hard");
let bodyElement = document.querySelector("body");
buttonMiddle.addEventListener("click", () => {
     middleLevel = true;
});    
buttonHard.addEventListener("click", () => {
    hardLevel = true;
});    

var minesCount = 10;
var minesLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; //goal to click all tiles except the ones containing mines
var flagEnabled = false;

var gameOver = false;
let newGameBtn = document.querySelector(".mew_btn");
let titleHader = document.querySelector("h1");

// window.onload = function() {
//     startGame();
// }
newGameBtn.addEventListener ("click", () => {
    document.getElementById("board").innerHTML = "";
    if(middleLevel) {
        rows = 15;
        columns = 15;
        minesCount = 15;
        document.querySelector("#board").classList.add("middle");
    }
    startGame();
    
});

function setMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
    console.log(minesLocation);
}


function startGame() {
 document.getElementById("mines-count").innerText = minesCount;
    // populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", () => {
                blockContext();
                if (tile.innerText == "") {
                    tile.innerText = "🏴";
                }
                else if (tile.innerText == "🏴") {
                    tile.innerText = "";
                }
                return;
            });
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    setMines();
}
function blockContext () {
    document.oncontextmenu = function(e){
        stopEvent(e);
       }
       function stopEvent(event){
        if(event.preventDefault != undefined)
         event.preventDefault();
        if(event.stopPropagation != undefined)
         event.stopPropagation();
       }
}

function clickTile() {
    // setMines();
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        titleHader.innerText = "Game Over";
        titleHader.style.color = "black";
        bodyElement.classList.add("active_body");
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);      //top left
    minesFound += checkTile(r-1, c);        //top 
    minesFound += checkTile(r-1, c+1);      //top right

    //left and right
    minesFound += checkTile(r, c-1);        //left
    minesFound += checkTile(r, c+1);        //right

    //bottom 3
    minesFound += checkTile(r+1, c-1);      //bottom left
    minesFound += checkTile(r+1, c);        //bottom 
    minesFound += checkTile(r+1, c+1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top 3
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top right

        //left and right
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right

        //bottom 3
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        // document.getElementById("mines-count").innerText = "Cleared";
        titleHader.innerText = "Hooray! You found all mines";
        gameOver = true;
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}