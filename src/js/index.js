import '../css/index.scss';

document.addEventListener("DOMContentLoaded", function() {
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
    qualitySlider.addEventListener("change", updateDownloadInfo);
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