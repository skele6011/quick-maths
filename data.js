function storeGameData(sessionData) {
    let history = JSON.parse(localStorage.getItem('gameHistory')) || [];
    history.push(sessionData);
    localStorage.setItem('gameHistory', JSON.stringify(history));
}

function getGameHistory() {
    return JSON.parse(localStorage.getItem('gameHistory')) || [];
}
