let secretNumber;
let triesLeft;
let minNumber;
let maxNumber;
function startGame()
{
    SoundModule.play("assets/audio/start.mp3");
    minNumber = parseInt(document.getElementById("min").value);
    maxNumber = parseInt(document.getElementById("max").value);
    triesLeft = parseInt(document.getElementById("tries").value);
    secretNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    document.getElementById("guessInput").min = minNumber;
    document.getElementById("guessInput").max = maxNumber;
    document.getElementById("settingsArea").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    setStatus("Game started. Guess a number between " + minNumber + " and " + maxNumber + ". You have " + triesLeft + " tries.");
    const guessBox = document.getElementById("guessInput");
    guessBox.value = "";
    guessBox.focus();
    guessBox.onkeydown = function(event)
    {
        if (event.key === "Enter")
        {
            makeGuess();
        }
    };
}
function endGame()
{
    SoundModule.play("assets/audio/stop.mp3");
    setTimeout(function() {
        let again = confirm("Do you want to play again with the same settings? Press OK for yes. Press Cancel to change settings.");
        if (again)
        {
            startGame();
        }
        else
        {
            document.getElementById("gameArea").style.display = "none";
            document.getElementById("settingsArea").style.display = "block";
            setStatus("You can now change the settings for the game.");
        }
    }, 1500);
}
function makeGuess()
{
    let guessBox = document.getElementById("guessInput");
    let guess = parseInt(guessBox.value);
    if (isNaN(guess))
    {
        setStatus("Please enter a valid number.");
        guessBox.value = "";
        guessBox.focus();
        return;
    }
    if (guess < minNumber || guess > maxNumber)
    {
        setStatus("Your guess must be between " + minNumber + " and " + maxNumber + ".");
        guessBox.value = "";
        guessBox.focus();
        return;
    }
    triesLeft--;
    if (guess === secretNumber)
    {
        setStatus("Correct! The number was " + secretNumber + ".");
        guessBox.value = "";
        endGame();
        return;
    }
    if (triesLeft <= 0)
    {
        setStatus("You ran out of tries. The number was " + secretNumber + ".");
        guessBox.value = "";
        endGame();
        return;
    }
    if (guess < secretNumber)
    {
        SoundModule.play("assets/audio/low.mp3");
        setStatus("Too low. You have " + triesLeft + " tries left.");
    }
    else
    {
        SoundModule.play("assets/audio/high.mp3");
        setStatus("Too high. You have " + triesLeft + " tries left.");
    }
    guessBox.value = "";
    guessBox.focus();
}
