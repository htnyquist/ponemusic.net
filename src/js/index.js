import '../css/index.scss';

document.addEventListener("DOMContentLoaded", function() {
    setupDownloadEventHandlers();
});

function setupDownloadEventHandlers() {
    const albumSizes = [157.6, 18.0, 11.9];
    const artistsSizes = [777.6, 138.6, 89.8];
    const version = "21.03";
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
