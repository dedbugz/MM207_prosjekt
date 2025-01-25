document.addEventListener('DOMContentLoaded', () => {
    const createDeckButton = document.getElementById('create-deck');
    const shuffleDeckButton = document.getElementById('shuffle-deck');
    const drawCardButton = document.getElementById('draw-card');
    const cardResult = document.getElementById('card-result');

    let deckId = null;

    createDeckButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/temp/deck', { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            deckId = data.deck_id;
            shuffleDeckButton.disabled = false;
            drawCardButton.disabled = false;
            cardResult.textContent = '';
        } catch (error) {
            console.error(error);
        }
    });
    
    shuffleDeckButton.addEventListener('click', async () => {
    if (!deckId) return;
    const response = await fetch(`/temp/deck/shuffle/${deckId}`, { method: 'PATCH' });
    const data = await response.json();
    alert(data.message);
    });

    const cardSuit = document.getElementById('card-suit');
    const cardValue = document.getElementById('card-value');

    drawCardButton.addEventListener('click', async () => {
        if (!deckId) return;
    
        try {
            const response = await fetch(`/temp/deck/${deckId}/card`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const { suit, value } = data.card;
    
            // Bygg filsti for bildet
            const cardImagePath = `imgs/cards/${suit}_${value}.png`;
    
            // Vis bildet
            cardResult.innerHTML = `<img src="${cardImagePath}" alt="${value} of ${suit}" />`;
        } catch (error) {
            console.error('Error drawing card:', error);
        }
    });
    
});