function extractColorsFromImage(imageFile, callback) {
    const img = new Image();
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        let colors = new Set();

        for (let i = 0; i < data.length; i += 4 * 50) { 
            let color = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
            colors.add(color);
            if (colors.size >= 5) break;
        }

        callback(Array.from(colors));
    };

    img.src = URL.createObjectURL(imageFile);
}

document.getElementById('imageInput').addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file) {
        extractColorsFromImage(file, (colors) => {
            let hexColors = colors.map(c => rgbToHex(c));
            document.getElementById('baseColor').value = hexColors[0] || "#3498db";
        });
    }
});

function rgbToHex(rgb) {
    let result = rgb.match(/\d+/g);
    return `#${((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1)}`;
}
