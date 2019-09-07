import '../css/browse.scss';

// We wait for all scripts to be loaded before continuing
let contentsRootLoaded = false;
let audioPlayerLoaded = false;

let parentDirs = [];
let curDir = null;
let curPath = [];
let songTitle = "";

// Either a real <audio> tag or an OGV player and container
let audioPlayer;
let audioContainer;

document.addEventListener("DOMContentLoaded", function() {
    const dirList = document.getElementById('dirlist');
    const curPathNode = document.getElementById('curpath');
    const audioName = document.getElementById('audioName');
    const audioModal = document.getElementById('audioModal');
    const audioModalClose = document.getElementsByClassName("modal-close")[0];
    const audioTag = document.getElementById('audioTag');
    const playRandomButton = document.getElementById('randomSong');

    audioModalClose.addEventListener('click', closeAudioModal);
    window.addEventListener('click', function(event) {
        if (event.target === audioModal) {
            closeAudioModal();
        }
    });

    const contentsReq = new XMLHttpRequest();
    contentsReq.addEventListener("load", function() {
        contentsRootLoaded = true;
        curDir = JSON.parse(this.responseText);
        tryFinishSetup();
    });
    contentsReq.open("GET", "./assets/contents.json");
    contentsReq.send();

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        audioTag.style.display = 'none';
        const ogvScript = document.createElement('script');
        ogvScript.onload = function () {
            setupOgvPlayer();
            audioPlayerLoaded = true;
            tryFinishSetup();
        };
        ogvScript.src = "./assets/ogvjs/ogv.js";
        document.head.appendChild(ogvScript);
    } else {
        document.getElementById('ogvContainer').style.display = 'none';
        audioPlayer = audioTag;
        audioContainer = audioTag;
        audioPlayerLoaded = true;
        tryFinishSetup();
    }

    playRandomButton.addEventListener('click', function() {
        if (!contentsRootLoaded || !audioPlayerLoaded)
            return;

        if (parentDirs.length) {
            curPath = [];
            curDir = parentDirs[0];
            parentDirs = [];
        }

        let curEntry = curDir;
        let isDir = true;
        while (isDir) {
            const randomIndex = Math.floor(Math.random() * Math.floor(curEntry['list'].length));
            curEntry = curEntry['list'][randomIndex];

            isDir = curEntry['list'] !== undefined;
            if (isDir) {
                curPath.push(curEntry['id']);
                parentDirs.push(curDir);
                curDir = curEntry;
            }
        }
        printContents();
        fileClicked(curEntry);
    });

    function tryFinishSetup() {
        if (!contentsRootLoaded || !audioPlayerLoaded)
            return;

        audioPlayer.addEventListener('loadedmetadata', function() {
            audioContainer.classList.remove('visibilityHidden');
            audioName.innerText = 'Playing "'+songTitle+'"';
        });

        printContents();
    }

    function printContents() {
        dirList.innerHTML = "";

        if (curDir['id'] !== '.') {
            const backItem = document.createElement('li');
            backItem.appendChild(document.createTextNode('..'));
            backItem.onclick = parentClicked;
            dirList.appendChild(backItem);
            curPathNode.innerText = curPath.join('/') + '/';
        } else {
            curPathNode.innerText = "";
        }

        for (const entry of curDir['list']) {
            const item = document.createElement('li');
            const isDir = entry['list'] !== undefined;
            if (isDir) {
                item.appendChild(document.createTextNode(entry['id'] + '/'));
                item.onclick = function() { dirClicked(entry) };
            } else {
                item.appendChild(document.createTextNode(entry['id']));
                item.onclick = function() { fileClicked(entry) };
            }

            dirList.appendChild(item);
        }
    }

    function fileClicked(entry) {
        const streamBase = 'https://storage.ponemusic.net/stream/';
        const filePath = curPath.map(encodeURIComponent).join('/') + '/' + encodeURIComponent(entry['id']) + '.opus';
        if (curPath[0] === 'Artists' && curPath[1] !== undefined) {
            songTitle = curPath[1] + ' - ' + entry['id'];
        } else {
            songTitle = entry['id'];
        }
        audioPlayer.src = streamBase + filePath;
        audioPlayer.play();
        audioName.innerText = 'Loading song...';
        audioContainer.classList.add('visibilityHidden');
        audioModal.style.visibility = "visible";
    }

    function closeAudioModal() {
        audioModal.style.visibility = "hidden";
        audioPlayer.pause();
    }

    function dirClicked(entry) {
        curPath.push(entry['id']);
        parentDirs.push(curDir);
        curDir = entry;
        printContents();
    }

    function parentClicked() {
        curPath.pop();
        curDir = parentDirs.pop();
        printContents();
    }
});

function setupOgvPlayer() {
    const ogvContainer = document.getElementById('ogvContainer');
    const ogvElapsed = document.getElementById('ogvElapsed');
    const ogvRemaining = document.getElementById('ogvRemaining');
    const ogvPlayPause = document.getElementById('ogvPlay');
    const ogvTrack = document.getElementById('ogvTrack');
    const ogvTrackPlayed = document.getElementById('ogvTrackPlayed');
    const ogvSeekZone = document.getElementById('ogvSeekZone');
    const ogvScrubber = document.getElementById('ogvScrubber');
    const ogvPlayer = new OGVPlayer();
    ogvContainer.appendChild(ogvPlayer);

    audioPlayer = ogvPlayer;
    audioContainer = ogvContainer;

    const scrubberStartPos = parseInt(window.getComputedStyle(ogvScrubber).left);
    const trackWidth = parseInt(window.getComputedStyle(ogvTrack).getPropertyValue('width'));
    let pausedBeforeSeeking = true;
    let wasHiddenDuringTimeUpdate = false;

    ogvSeekZone.addEventListener('mousedown', function(e) {
        const duration = ogvPlayer.duration;
        if (!duration)
            return;

        pausedBeforeSeeking = ogvPlayer.paused;
        ogvPlayer.pause();
        window.addEventListener('mousemove', ogvOnSeekEvent);
        window.addEventListener('mouseup', ogvOnSeekEnd);
        ogvOnSeekEvent(e);
    });

    ogvPlayPause.addEventListener('click', function() {
        if (ogvPlayer.paused) {
            ogvPlayer.play();
            ogvPlayPause.className = 'ogvPause';
        } else {
            ogvPlayer.pause();
            ogvPlayPause.className = '';
        }
    });

    document.addEventListener('visibilitychange', ogvOnTimeUpdate, true);

    ogvPlayer.addEventListener('loadedmetadata', ogvOnReadyToPlay);
    ogvPlayer.addEventListener('ended', ogvOnReadyToPlay);
    ogvPlayer.addEventListener('timeupdate', ogvOnTimeUpdate);
    ogvPlayer.addEventListener('play', function () {
        ogvPlayPause.className = 'ogvPause';
    });

    function ogvOnReadyToPlay() {
        ogvPlayPause.className = '';
        ogvElapsed.innerText = '0:00';
        ogvRemaining.innerText = '-'+formatDuration(ogvPlayer.duration);
        ogvDisableTransition();
        ogvScrubber.style.left = scrubberStartPos+'px';
        ogvTrackPlayed.style.width = '0';
        ogvEnableTransition();
    }

    function ogvOnSeekEvent(e) {
        const xpos = clamp(e.clientX - ogvSeekZone.getBoundingClientRect().left, 0, trackWidth);
        const scrubberRatio = xpos / trackWidth;

        ogvElapsed.innerText = formatDuration(ogvPlayer.duration*scrubberRatio);
        ogvRemaining.innerText = '-'+formatDuration(ogvPlayer.duration - ogvPlayer.duration*scrubberRatio);

        ogvDisableTransition();
        ogvScrubber.style.left = Math.round(scrubberStartPos+scrubberRatio*trackWidth)+'px';
        ogvTrackPlayed.style.width = scrubberRatio*100+'%';
        ogvEnableTransition();
    }

    function ogvOnSeekEnd(e) {
        const xpos = clamp(e.clientX - ogvSeekZone.getBoundingClientRect().left, 0, trackWidth);
        ogvPlayer.fastSeek(xpos / trackWidth * ogvPlayer.duration);
        window.removeEventListener('mouseup', ogvOnSeekEnd);
        window.removeEventListener('mousemove', ogvOnSeekEvent);
        if (!pausedBeforeSeeking)
            ogvPlayer.play();
    }

    function ogvDisableTransition() {
        ogvScrubber.classList.add('ogvNoTransition');
        ogvTrackPlayed.classList.add('ogvNoTransition');
    }

    function ogvEnableTransition() {
        ogvScrubber.offsetHeight;
        ogvTrackPlayed.offsetHeight;
        ogvScrubber.classList.remove('ogvNoTransition');
        ogvTrackPlayed.classList.remove('ogvNoTransition');
    }

    function ogvOnTimeUpdate() {
        if (document.hidden) {
            wasHiddenDuringTimeUpdate = true;
            return;
        }
        const currentTime = ogvPlayer.currentTime;
        ogvElapsed.innerText = formatDuration(currentTime);
        ogvRemaining.innerText = '-'+formatDuration(ogvPlayer.duration - currentTime);
        const scrubberRatio = currentTime / ogvPlayer.duration;

        if (wasHiddenDuringTimeUpdate)
            ogvDisableTransition();
        ogvScrubber.style.left = Math.round(scrubberStartPos+scrubberRatio*trackWidth)+'px';
        ogvTrackPlayed.style.width = scrubberRatio*100+'%';
        if (wasHiddenDuringTimeUpdate)
            ogvEnableTransition();
        wasHiddenDuringTimeUpdate = false;
    }
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

function formatDuration(duration) {
    let secs = duration;
    let minutes = Math.round(secs / 60);
    secs = Math.round(secs % 60);
    let str = ''+minutes;
    str += secs < 10 ? ':0' : ':';
    return str+secs;
}