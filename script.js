document.getElementById('generate').addEventListener('click', function () {
    let baseColor = document.getElementById('baseColor').value.trim();
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(baseColor)) {
        alert("Please enter a valid HEX color.");
        return;
    }

    let paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        let newColor = generateAccessibleColor(baseColor);
        let colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = newColor;
        colorBox.textContent = newColor;
        paletteDiv.appendChild(colorBox);
    }
});
