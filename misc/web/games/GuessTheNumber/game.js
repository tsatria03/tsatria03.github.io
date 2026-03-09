let secretNumber;
let triesLeft;
let minNumber;
let maxNumber;
function showMenu()
{
    document.getElementById("menuScreen").style.display = "block";
    document.getElementById("settingsScreen").style.display = "none";
    document.getElementById("gameArea").style.display = "none";
    ScreenReaderSpeak("Main menu.");
}
function openSettings()
{
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("settingsScreen").style.display = "block";
    document.getElementById("gameArea").style.display = "none";
    ScreenReaderSpeak("Settings screen.");
}
function closeSettings()
{
    showMenu();
}
function startGame()
{
    SoundModule.play("assets/audio/start.mp3");
    minNumber = parseInt(document.getElementById("min").value);
    maxNumber = parseInt(document.getElementById("max").value);
    triesLeft = parseInt(document.getElementById("tries").value);
    secretNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("settingsScreen").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    const guessBox = document.getElementById("guessInput");
    guessBox.min = minNumber;
    guessBox.max = maxNumber;
    guessBox.value = "";
    guessBox.focus();
    guessBox.onkeydown = function(event)
    {
        if (event.key === "Enter")
        {
            makeGuess();
        }
    };
    setStatus(
        "Game started. Guess a number between " +
        minNumber +
        " and " +
        maxNumber +
        ". You have " +
        triesLeft +
        " tries."
    );
}
function makeGuess()
{
    const guessBox = document.getElementById("guessInput");
    const guess = parseInt(guessBox.value);
    if (isNaN(guess))
    {
        setStatus("Please enter a valid number.");
        resetGuessBox();
        return;
    }
    if (guess < minNumber || guess > maxNumber)
    {
        setStatus("Your guess must be between " + minNumber + " and " + maxNumber + ".");
        resetGuessBox();
        return;
    }
    triesLeft--;
    if (guess === secretNumber)
    {
        setStatus("Correct! The number was " + secretNumber + ".");
        resetGuessBox();
        endGame();
        return;
    }
    if (triesLeft <= 0)
    {
        setStatus("You ran out of tries. The number was " + secretNumber + ".");
        resetGuessBox();
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
    resetGuessBox();
}
function endGame()
{
    SoundModule.play("assets/audio/stop.mp3");
    setTimeout(function()
    {
        const again = confirm(
            "Do you want to play again with the same settings? Press OK to play again, press Cancel to return to the main menu."
        );
        if (again)
        {
            startGame();
        }
        else
        {
            showMenu();
        }
    }, 1500);
}
function resetGuessBox()
{
    const guessBox = document.getElementById("guessInput");
    guessBox.value = "";
    guessBox.focus();
}
