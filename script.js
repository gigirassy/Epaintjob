document.getElementById('savePalette').addEventListener('click', function () {
    let colors = Array.from(document.querySelectorAll('.color-box')).map(el => el.textContent);
    if (colors.length === 0) return;

    let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
    savedPalettes.push(colors);
    localStorage.setItem('palettes', JSON.stringify(savedPalettes));

    loadSavedPalettes();
});

function loadSavedPalettes() {
    let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
    let savedPalettesDiv = document.getElementById('savedPalettes');
    savedPalettesDiv.innerHTML = '';

    savedPalettes.forEach((palette, index) => {
        let paletteDiv = document.createElement('div');
        paletteDiv.className = 'saved-palette';
        paletteDiv.innerHTML = palette.map(color => `<div style="background: ${color}; width: 20px; height: 20px;"></div>`).join('');
        paletteDiv.addEventListener('click', () => loadPalette(palette));
        savedPalettesDiv.appendChild(paletteDiv);
    });
}

function loadPalette(colors) {
    let paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    colors.forEach(color => {
        let colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.textContent = color;
        paletteDiv.appendChild(colorBox);
    });
}

document.getElementById('clearPalettes').addEventListener('click', function () {
    localStorage.removeItem('palettes');
    loadSavedPalettes();
});

loadSavedPalettes();
