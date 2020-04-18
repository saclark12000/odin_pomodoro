
let sessionStartSelect = document.querySelector("#session-start");
let breakStartSelect = document.querySelector("#break-start");
let timerSelect = document.querySelector('#timer');
let modeSelect = document.querySelector('#mode');

let settings = {
    'sessionStart': 25,
    'breakStart': 5,
    'timerResume': 25,
    'breakResume': 5,
    'clockMode': "Session", // Break
    'clockState': "Stopped", // Running, Paused
}


// Timer functions

function settingsInit(type){
    if (type == 'reset'){
        settings = {
            'sessionStart': 25,
            'breakStart': 5,
            'timerResume': 25,
            'breakResume': 5,
            'clockMode': "Session",
            'clockState': "Stopped",
        }

        sessionStartSelect.textContent = settings.sessionStart;
        breakStartSelect.textContent = settings.breakStart;
        timerSelect.textContent = settings.sessionStart + ":00"
        modeSelect.textContent = settings.clockMode;

    } else if (type == 'hard'){
        settings = {
            ...settings,
            'timerResume': settings.sessionStart,
            'breakResume': settings.breakStart,
            'clockMode': "Session",
            'clockState': "Stopped",
        }

        sessionStartSelect.textContent = settings.sessionStart;
        breakStartSelect.textContent = settings.breakStart;
        timerSelect.textContent = settings.sessionStart + ":00"
        modeSelect.textContent = settings.clockMode;

    } else if (type == 'soft'){
        sessionStartSelect.textContent = settings.sessionStart;
        breakStartSelect.textContent = settings.breakStart;
    }
}

var countdown, minutes, seconds, timer;

function startTimer(duration) {
    clearInterval(pauseAlert);
    timer = (settings.clockState != "Paused")
         ? (duration*60) -1
         : settings.timerResume;

    if (settings.clockState != "Running"){
        settings.clockState = "Running"
        modeSelect.textContent = settings.clockMode;
        timerInterval();
        countdown = setInterval(timerInterval, 1000);
    }
}

function timerInterval(){
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    settings.timerResume = minutes + ":" + seconds;
    timerSelect.textContent = settings.timerResume;

    if (--timer < 0) {
        if (settings.clockMode == "Session"){
            settings.clockMode = "Break";
            timer = settings.breakStart*60;
        } else if (settings.clockMode == "Break"){
            settings.clockMode = "Session";
            timer = settings.sessionStart*60;
        }

        modeSelect.textContent = settings.clockMode;
    } else {
        settings.timerResume = timer;
    }
}

var pauseAlert;

function startPause(){
    pauseAlert = setInterval(function (){
        modeSelect.textContent = modeSelect.textContent === settings.clockState
            ? settings.clockMode : settings.clockState;
    }, 1000);
}

// Controls

function pauseTimer() {
    if (settings.clockState == "Running"){
        settings["clockState"]="Paused";
        clearInterval(countdown);
        startPause();
    } else if (settings.clockState == "Paused"){
        startTimer(settings.sessionStart)
    }
}

function stopTimer() {
    settings.clockState="Stopped";
    settings.clockMode= "Session";
    timerSelect.textContent = settings.sessionStart + ":00";
    modeSelect.textContent = settings.clockMode;
    clearInterval(countdown);
    clearInterval(pauseAlert);
}

function resetTimer() {
    clearInterval(countdown);
    clearInterval(pauseAlert);
    settingsInit('reset');
}

function adjustUp(target){
    if (settings.clockState == "Stopped" || settings.clockState == "Paused"){
        settings[target] = settings[target] < 60 ? settings[target]+1 : 60;
    }
    if (settings.clockState == "Stopped"){
        settingsInit('hard');
    } else {
        settingsInit('soft');
    }
}

function adjustDown(target){
    if (settings.clockState == "Stopped" || settings.clockState == "Paused"){
        settings[target] = settings[target] > 1 ? settings[target]-1 : 1;
    }
    if (settings.clockState == "Stopped"){
        settingsInit('hard');
    } else {
        settingsInit('soft');
    }
}

settingsInit('reset');
