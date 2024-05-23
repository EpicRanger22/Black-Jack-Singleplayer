let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let tokenCount = 10;
let tokensUsed = 0;

let firstHit = true;
let canHit = true;

window.onload = function() {
    reset();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    tokensUsed = prompt("How many tokens?");
    while(tokensUsed > tokenCount || tokensUsed <= 0) {
        tokensUsed = prompt("How many tokens?");
    }
    
    let seen = deck.pop(Math.floor(Math.random() * deck.length));
    dealerSum += getValue(seen);
    dealerAceCount += checkAce(seen);

    document.getElementById("seen").src = "./cards/" + seen + ".png";

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("next").addEventListener("click", next);
    document.getElementById("tokens").innerText = "";
    document.getElementById("tokens").innerText = "" + tokenCount;
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg;
    let card;
    if (firstHit) {
        cardImg = document.getElementById("first-card");
    }
    else {
        cardImg = document.createElement("img");
    }
    card = deck.pop(Math.floor(Math.random() * deck.length));
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    firstHit = false;

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        stay();
    }

}

function stay() {
    hidden = deck.pop(Math.floor(Math.random() * deck.length));
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop(Math.floor(Math.random() * deck.length));
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        tokenCount -= tokensUsed;
    }
    else if (dealerSum > 21) {
        message = "You win!";
        tokenCount += tokensUsed;
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        tokenCount += tokensUsed;
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        tokenCount -= tokensUsed;
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    document.getElementById("tokens").innerText = "";
    document.getElementById("tokens").innerText = "" + tokenCount;
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function reset() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    hidden = null;
    deck = null;
    firstHit = true;
    canHit = true;
    buildDeck();
    shuffleDeck();
    startGame();
}

function next() {
    document.getElementById("dealer-cards").innerHTML = "";
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/BACK.png";
    cardImg.id = "hidden";
    document.getElementById("dealer-cards").append(cardImg);
    let cardSeenImg = document.createElement("img");
    cardSeenImg.src = "";
    cardSeenImg.id = "seen";
    document.getElementById("dealer-cards").append(cardSeenImg);
    document.getElementById("your-cards").innerHTML = "";
    let yourCardImg = document.createElement("img");
    yourCardImg.src = "./cards/BACK.png";
    yourCardImg.id = "first-card";
    document.getElementById("your-cards").append(yourCardImg);
    
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";
    
    reset();
}   
