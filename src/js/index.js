import '../css/index.scss';

document.addEventListener("DOMContentLoaded", function() {
    setupDownloadEventHandlers();
});

function setupDownloadEventHandlers() {
    const albumSizes = [136.8, 16.3, 10.8];
    const artistsSizes = [705.3, 130.8, 84.7];
    const version = "20.03";
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
