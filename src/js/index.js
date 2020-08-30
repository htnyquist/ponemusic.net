import '../css/index.scss';

document.addEventListener("DOMContentLoaded", function() {
    setupDownloadEventHandlers();
});

function setupDownloadEventHandlers() {
    const albumSizes = [147.6, 17.1, 11.3];
    const artistsSizes = [732.3, 134.8, 87.3];
    const version = "20.09";
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

        downloadButton.innerText = "Download ("+Math.round(size)+" GB)";
        downloadForm.action = "./assets/Pony Music Archive "+version+" ("+qualityNames[quality]+").torrent";
    }
}
