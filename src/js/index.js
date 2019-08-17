import '../css/index.scss';

document.addEventListener("DOMContentLoaded", function() {
    setupDownloadEventHandlers();
});

function setupDownloadEventHandlers() {
    const albumSizes = [114.4, 13.5, 9];
    const artistsSizes = [611.1, 115.7, 75.0];
    const version = "19.09";
    const qualityNames = ["Raw Quality", "High Quality", "Phone Quality"];

    const downloadForm = document.getElementById("download-form");
    const downloadButton = document.getElementById("download-button");
    const qualitySlider = document.getElementById("quality-slider");

    qualitySlider.addEventListener("input", updateDownloadInfo);
    qualitySlider.addEventListener("change", updateDownloadInfo);

    updateDownloadInfo();

    function updateDownloadInfo() {
        const quality = qualitySlider.value;
        const size = albumSizes[quality] + artistsSizes[quality];

        downloadButton.innerText = "Download ("+size.toFixed(1)+" GB)";
        downloadForm.action = "./assets/Pony Music Archive "+version+" ("+qualityNames[quality]+").torrent";
    }
}