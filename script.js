document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js loaded");

    loadSavedPalettes(); // Load saved palettes from localStorage

    let savePaletteButton = document.getElementById('savePalette');
    let clearPalettesButton = document.getElementById('clearPalettes');
    let generateButton = document.getElementById('generate');
    let paletteDiv = document.getElementById('palette');
    let baseColorInput = document.getElementById('baseColor');

    if (!savePaletteButton || !clearPalettesButton || !generateButton || !paletteDiv || !baseColorInput) {
        console.error("❌ One or more elements are missing!");
        return; // Stop execution if elements are missing
    }

    // Generate palette event
    generateButton.addEventListener('click', function () {
        console.log("🔹 Generate button clicked!");

        let baseColor = baseColorInput.value.trim();
        console.log("🎨 Base color selected:", baseColor);

        if (!isValidHex(baseColor)) {
            console.error("❌ Invalid hex color:", baseColor);
            return;
        }

        let colors = [baseColor];
        while (colors.length < 5) {
            let newColor = generateAccessibleColor(baseColor);
            console.log("✅ Generated color:", newColor);
            colors.push(newColor);
        }

        // Render the new palette
        paletteDiv.innerHTML = '';
        colors.forEach(color => {
            let colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.textContent = color;
            paletteDiv.appendChild(colorBox);
        });

        console.log("✅ Palette generated successfully.");
    });

    // Save palette event
    savePaletteButton.addEventListener('click', function () {
        let colors = Array.from(document.querySelectorAll('.color-box')).map(el => el.textContent);
        if (colors.length === 0) return;

        let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
        savedPalettes.push(colors);
        localStorage.setItem('palettes', JSON.stringify(savedPalettes));

        loadSavedPalettes();
    });

    // Clear palettes event
    clearPalettesButton.addEventListener('click', function () {
        localStorage.removeItem('palettes');
        loadSavedPalettes();
    });

    function loadSavedPalettes() {
        let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
        let savedPalettesDiv = document.getElementById('savedPalettes');
        if (!savedPalettesDiv) return;

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
        paletteDiv.innerHTML = '';

        colors.forEach(color => {
            let colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.textContent = color;
            paletteDiv.appendChild(colorBox);
        });
    }

    function isValidHex(hex) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    }

    function generateAccessibleColor(baseHex) {
        let baseRgb = hexToRgb(baseHex);
        let newRgb = {
            r: Math.min(baseRgb.r + 50, 255),
            g: Math.min(baseRgb.g + 50, 255),
            b: Math.min(baseRgb.b + 50, 255),
        };
        return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
});
