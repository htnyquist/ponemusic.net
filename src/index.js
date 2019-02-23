import './css/index.scss';

document.addEventListener("DOMContentLoaded", function() {
    const leads = [
        "So much pony",
        "Looking for that one forgotten song?",
        "Looking for the top stuff? Check the albums!",
        "3000 artists, 2000 hours of music!",
        "Enough content to survive G5!",
        "Keep making music, we'll keep adding it!",
        "A fresh new release every 6 month",
        "Party like it's 2012 again",
        "Because Youtube only goes so far",
        "Everlasting nostalgia stash",
        "We love FLACs",
        "Way too many Winter Wrap Up remixes",
        "Try a random folder, get hidden gems (or not!)",
        "Now with 20% more covert art!",
        "May contain traces of Bandcamp, pony.fm, and Soundclouds",
        "600 GB of music? That's an academy record!",
        "Find something you like? Support your favorite artists!",
    ];

    let lead = document.getElementById('title-lead');
    lead.innerText = leads[Math.floor(Math.random()*leads.length)];

    setupDownloadEventHandlers();
});

function setupDownloadEventHandlers() {
    const albumSizes = [99.0, 12.0, 8.0];
    const artistsSizes = [503.0, 98.0, 62.6];
    const version = "19.03";
    const qualityNames = ["Raw Quality", "High Quality", "Phone Quality"];

    const downloadForm = document.getElementById("download-form");
    const downloadButton = document.getElementById("download-button");
    const qualitySlider = document.getElementById("quality-slider");
    const artistsCb = document.getElementById("artists");
    const albumsCb = document.getElementById("albums");

    qualitySlider.addEventListener("input", updateDownloadInfo);
    artistsCb.addEventListener("change", updateDownloadInfo);
    albumsCb.addEventListener("change", updateDownloadInfo);

    updateDownloadInfo();

    function updateDownloadInfo() {
        const quality = qualitySlider.value;
        const size = (albumsCb.checked ? albumSizes[quality] : 0)
                     + (artistsCb.checked ? artistsSizes[quality] : 0);

        downloadButton.innerText = "Download ("+size.toFixed(1)+" GB)";
        downloadButton.disabled = !(albumsCb.checked || artistsCb.checked);

        let downloadName = "./assets/Pony Music Archive "+version+" ("+qualityNames[quality];
        if (albumsCb.checked && !artistsCb.checked) {
            downloadName += ", Albums";
        } else if (artistsCb.checked && !albumsCb.checked) {
            downloadName += ", Artists";
        }
        downloadName += ").torrent";
        downloadForm.action = downloadName;
    }
}