let helpButton = document.getElementById('help-button');
let helpCard = document.getElementById('help-card');
let closeHelp = document.getElementById('close-help');

helpButton.addEventListener('click', function() {
    helpCard.style.display = 'block';
});

closeHelp.addEventListener('click', function() {
    helpCard.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target !== helpCard && event.target !== helpButton && !helpCard.contains(event.target)) {
        helpCard.style.display = 'none';
    }
});