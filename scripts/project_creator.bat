@echo off
setlocal EnableDelayedExpansion

:: Create the main projects folder
if not exist projects mkdir projects

:: Define project names and descriptions
set "project0=YoutubeDownloader"
set "desc0=A simple to use program that allows the downloading of entire channels, playlists, and videos to your device."

set "project1=DiceRoler"
set "desc1=A small program that lets users simulate tabletop role playing games."

set "project2=ToyMania"
set "desc2=A fun game that revolves around collecting toys."

set "project3=WheelSpinner"
set "desc3=A small program that lets users add and spin wheels to make various decisions."

set "project4=WeaponSimulator"
set "desc4=A simple program that lets you simulate the use of weapons in your arsenal to perform combat with various types of entities."

set "project5=TileSimulator"
set "desc5=A simple program that lets you simulate walking on various multi tile environments."

set "project6=SixthSenceRemake"
set "desc6=A small prototype of a game that used to exist in the Apple App Store."

set "project7=CookyCraze"
set "desc7=A small game that lets users bake cookies and earn various rewards."

set "project8=InstrumentSimulator"
set "desc8=A simple program that lets users play various instruments with their computer keyboard."

set "project9=SimpleFighter"
set "desc9=A classic spinoff of other popular off-line shooters."

set "project10=MusicPlayerRemake"
set "desc10=A simple program made to demonstrate playing music with ease."

set "project11=EasyCcalculator"
set "desc11=An easy to use math calculator."

set "project12=AnonymousChatClient"
set "desc12=A simple program that lets users chat and have fun."

set "project13=SimpleFighterWeaponsMaker"
set "desc13=A menu-based program that lets users easily create weapons for the game Simple Fighter."

set "project14=DtmfTonesPlayer"
set "desc14=A small program that lets users simulate DTMF tones used in old and new phones."

set "project15=ScenarioGenerator"
set "desc15=A quick time waster that will leave you laughing uncontrollably for hours."

set "project16=ToneGenerator"
set "desc16=A simple to use frequency generator and keyboard synthesizer."

:: Loop through all projects
for /L %%i in (0,1,16) do (
    call set "name=%%project%%i%%"
    call set "desc=%%desc%%i%%"

    mkdir "projects\!name!" >nul 2>&1

    > "projects\!name!\index.html" (
        echo ^<!DOCTYPE html^>
        echo ^<html lang="en"^>
        echo ^<head^>
        echo   ^<meta charset="UTF-8" /^>
        echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"/^>
        echo   ^<title^>!name!^</title^>
        echo ^</head^>
        echo ^<body^>
        echo   ^<h1^>!name!^</h1^>
        echo   ^<p^>!desc!^</p^>
        echo   ^<p^>^<a href="https://github.com/tsatria03/!name!/releases/latest"^>View Latest Repository Release^</a^>^</p^>
        echo   ^<p^>^<a href="https://github.com/tsatria03/!name!"^>View Latest Repository Source^</a^>^</p^>
        echo ^</body^>
        echo ^</html^>
    )
)

echo Project folders and index.html files created successfully.
pause
