document.getElementById('captureBtn').addEventListener('click', function () {
    const scene = document.querySelector('a-scene').components.screenshot.getCanvas('perspective');
    const imgData = scene.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'capture.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
