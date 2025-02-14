document.addEventListener("DOMContentLoaded", function () {
    // Now all elements exist before running the script
    loadSavedPalettes();

    document.getElementById('savePalette').addEventListener('click', function () {
        let colors = Array.from(document.querySelectorAll('.color-box')).map(el => el.textContent);
        if (colors.length === 0) return;

        let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
        savedPalettes.push(colors);
        localStorage.setItem('palettes', JSON.stringify(savedPalettes));

        loadSavedPalettes();
    });

    document.getElementById('clearPalettes').addEventListener('click', function () {
        localStorage.removeItem('palettes');
        loadSavedPalettes();
    });

    function loadSavedPalettes() {
        let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
        let savedPalettesDiv = document.getElementById('savedPalettes');
        if (!savedPalettesDiv) return; // Prevents errors if the element isn't found

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
        if (!paletteDiv) return; // Prevents errors if the element isn't found

        paletteDiv.innerHTML = '';

        colors.forEach(color => {
            let colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.textContent = color;
            paletteDiv.appendChild(colorBox);
        });
    }
});
