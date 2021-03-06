var pad = $('.pad');
var pads = [];
var selectedPadColor = '#878787';

/*
 PAD STUFF
 */
function playSound(index) {
    //If no recorded sample, play default
    try {
        recordedSounds[index].play();
    } catch (e) {
        sounds[index].play()
    }
}

// What to do when a key is pressed. play the sound, light up the button.
function keyHandler(e) {
    if(e.target.tagName != 'INPUT') {  //prevent playing sounds on keyboard entry into text fields
        var key = e.key.toLowerCase();
        var index = keysUsed.indexOf(key);

        //on space bar, toggle sequencer
        if (key == ' ') {
            e.preventDefault();
            toggleSequencer();
        }

        try {
            playSound(index);
            lightUpPad(index);

            if (recording && sequencerOn) {
                toggleSequenced(currentBeat, index);
                showSelectedPads(currentBeat);
            }
            else if (inputMode) {
                toggleSequenced(inputIndex, index);
                showSelectedPads(inputIndex);
            }
        } catch (e) {
        }
    }
}

function lightUpPad(index) {
    var pad = pads[index];

    pad.addEventListener('webkitAnimationEnd', function () {
        this.style.webkitAnimationName = ''
    });

    if (index < 12)
        pad.style.webkitAnimationName = 'light-up-1';
    else if (index < 24)
        pad.style.webkitAnimationName = 'light-up-2';
    else if (index < 35)
        pad.style.webkitAnimationName = 'light-up-3';
    else
        pad.style.webkitAnimationName = 'light-up-4';
}

function clearPadStyles() {
    for (var i = 0; i < pads.length; i++) {
        var currentPad = pads[i];
        var color = $("#row4 .color")[0].style.backgroundColor;
        if (i < 12) {
            color = $("#row1 .color")[0].style.backgroundColor;
        } else if (i < 24) {
            color = $("#row2 .color")[0].style.backgroundColor;

        } else if (i < 35) {
            color = $("#row3 .color")[0].style.backgroundColor;
        }
        currentPad.style.backgroundColor = color;
    }
}

function showSelectedPads(beatIndex) {
    clearPadStyles();
    if (inputMode || recording) {
        for (var i = 0; i < sequencedSounds[beatIndex].length; i++) {
            var currentPad = pads[sequencedSounds[beatIndex][i]];
            currentPad.style.backgroundColor = selectedPadColor;
        }
    }
}

pad.hover(
    //Mouse Enter
    function () {
        if(micAccess) {
            //If there's nothing in the pad, show the mic icon
            if (recordedSounds[pad.index(this)] == undefined && !inputMode) {
                var micImage = this.children[0];
                micImage.style.visibility = 'visible';
            }
        }
    },

    //Mouse leave
    function () {
        if(micAccess) {
            //If there's nothing in the pad, remove the mic icon
            if (recordedSounds[pad.index(this)] == undefined) {
                var micImage = this.children[0];
                micImage.style.visibility = 'hidden';
            }
        }
    }
);

pad.click(function () {
    var index = pad.index(this);    //Index of pad to change
    var image = this.children[0];

    //If in input mode and click on the pad then just toggleSequenced it.
    if (inputMode) {
        toggleSequenced(inputIndex, index);
        showSelectedPads(inputIndex);
    }

    //Not in input mode so record into the pad
    else {
        if(micAccess) {
            //No sample in pad yet, record one.
            if (recordedSounds[index] == undefined) {
                recordedSounds[index] = 'recording';
                $(image).attr("src", "images/mic-recording.svg");
                recordIntoPad(index);
            }
            //Sample in pad, clear it
            else {
                recordedSounds[index] = undefined;
                $(image).attr("src", "images/mic.svg");
            }
        } else {
            console.log("Retrying microphone access...")
            initMic();
        }
    }
});
