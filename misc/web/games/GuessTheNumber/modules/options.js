function showMenu()
{
    document.getElementById("menuScreen").style.display = "block";
    document.getElementById("settingsScreen").style.display = "none";
    document.getElementById("gameArea").style.display = "none";
document.getElementById("menuTitle").focus();
}
function openSettings()
{
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("settingsScreen").style.display = "block";
    document.getElementById("gameArea").style.display = "none";
    document.getElementById("settingsTitle").focus();
}
function closeSettings()
{
    showMenu();
}
