document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js loaded");

    loadSavedPalettes(); // Load saved palettes from localStorage

    let savePaletteButton = document.getElementById('savePalette');
    let clearPalettesButton = document.getElementById('clearPalettes');
    let generateButton = document.getElementById('generate');
    let paletteDiv = document.getElementById('palette');
    let bgColorPreview = document.getElementById('bgColorPreview');
    let imageInput = document.getElementById('imageInput');

    // Check if critical elements exist
    if (!savePaletteButton || !clearPalettesButton || !generateButton || !paletteDiv || !bgColorPreview) {
        console.error("❌ One or more elements are missing!");
        return;
    }

    // Sync color pickers with text inputs
    function syncColorPicker(pickerId, textId) {
        let colorPicker = document.getElementById(pickerId);
        let textInput = document.getElementById(textId);

        if (!colorPicker || !textInput) {
            console.error(`❌ Missing elements: ${pickerId} or ${textId}`);
            return;
        }

        // When user picks a color, update text field
        colorPicker.addEventListener("input", function () {
            textInput.value = colorPicker.value;
        });

        // When user types a valid hex, update color picker
        textInput.addEventListener("input", function () {
            if (isValidHex(textInput.value)) {
                colorPicker.value = textInput.value;
            }
        });
    }

    // Validate hex color
    function isValidHex(hex) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    }

    // Sync all color pickers
    syncColorPicker("baseColorPicker", "baseColor");
    syncColorPicker("extraColor1Picker", "extraColor1");
    syncColorPicker("extraColor2Picker", "extraColor2");

    // Generate an accessible color palette
    generateButton.addEventListener('click', function () {
        console.log("🔹 Generate button clicked!");

        let baseColor = document.getElementById('baseColor').value.trim();
        let extraColor1 = document.getElementById('extraColor1').value.trim();
        let extraColor2 = document.getElementById('extraColor2').value.trim();
        let colors = [];

        if (isValidHex(baseColor)) colors.push(baseColor);
        if (isValidHex(extraColor1)) colors.push(extraColor1);
        if (isValidHex(extraColor2)) colors.push(extraColor2);

        while (colors.length < 5) {
            let newColor = generateAccessibleColor(colors[0] || "#3498db"); // Use base color or fallback
            colors.push(newColor);
        }

        // Set recommended background color
        let bgColor = getRecommendedBackgroundColor(colors);
        bgColorPreview.style.backgroundColor = bgColor;
        bgColorPreview.textContent = bgColor;

        // Render the palette
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

    // Save the current palette to localStorage
    savePaletteButton.addEventListener('click', function () {
        let colors = Array.from(document.querySelectorAll('.color-box')).map(el => el.textContent);
        if (colors.length === 0) return;

        let savedPalettes = JSON.parse(localStorage.getItem('palettes')) || [];
        savedPalettes.push(colors);
        localStorage.setItem('palettes', JSON.stringify(savedPalettes));

        loadSavedPalettes();
    });

    // Clear saved palettes
    clearPalettesButton.addEventListener('click', function () {
        localStorage.removeItem('palettes');
        loadSavedPalettes();
    });

    // Load saved palettes from localStorage
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

    // Generate an accessible color (lighter/darker for contrast)
    function generateAccessibleColor(baseHex) {
        let baseRgb = hexToRgb(baseHex);
        let newRgb = {
            r: Math.min(baseRgb.r + 50, 255),
            g: Math.min(baseRgb.g + 50, 255),
            b: Math.min(baseRgb.b + 50, 255),
        };
        return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    function getRecommendedBackgroundColor(colors) {
        // Return black or white based on contrast
        return "#ffffff"; // Placeholder (could use luminance check)
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

    // Extract colors from an uploaded image
    imageInput.addEventListener("change", function (event) {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = function (e) {
            let img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                let canvas = document.getElementById('imageCanvas');
                let ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                let colors = extractColorsFromImage(ctx, img.width, img.height);
                loadPalette(colors);
            };
        };
        reader.readAsDataURL(file);
    });

    function extractColorsFromImage(ctx, width, height) {
        let imageData = ctx.getImageData(0, 0, width, height).data;
        let colors = new Set();

        for (let i = 0; i < imageData.length; i += 4 * 50) {
            let r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
            let hex = rgbToHex(r, g, b);
            colors.add(hex);
            if (colors.size >= 5) break;
        }

        return Array.from(colors);
    }
});
