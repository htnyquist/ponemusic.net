import '../css/browse.scss';
import contentsRoot from '../../dist/assets/contents.json';

let parentDirs = [];
let curDir = contentsRoot;
let curPath = [];
let songTitle = "";

document.addEventListener("DOMContentLoaded", function() {
    const dirList = document.getElementById('dirlist');
    const curPathNode = document.getElementById('curpath');
    const audioTag = document.getElementById('audioTag');
    const audioName = document.getElementById('audioName');
    const audioModal = document.getElementById('audioModal');
    const audioModalClose = document.getElementsByClassName("modal-close")[0];

    audioModalClose.onclick = closeAudioModal;
    window.onclick = function(event) {
        if (event.target === audioModal) {
            closeAudioModal();
        }
    };
    audioTag.onloadedmetadata = function() {
        audioTag.style.display = "initial";
        audioName.innerText = 'Playing "'+songTitle+'"';
    };

    printContents();

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
        const streamBase = 'https://f001.backblazeb2.com/file/music-archive-storage/';
        const filePath = curPath.map(encodeURIComponent).join('/') + '/' + encodeURIComponent(entry['id']) + '.opus';
        if (curPath[0] === 'Artists' && curPath[1] !== undefined) {
            songTitle = curPath[1] + ' - ' + entry['id'];
        } else {
            songTitle = entry['id'];
        }
        audioName.innerText = 'Loading...';
        audioTag.style.display = "none";
        audioTag.src = streamBase + filePath;
        audioModal.style.display = "flex";
        audioTag.play();
    }

    function closeAudioModal() {
        audioModal.style.display = "none";
        audioTag.pause();
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
