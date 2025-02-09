// Convert HEX to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(h => h + h).join('');
    }
    let num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Calculate relative luminance
function luminance(r, g, b) {
    let a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio
function contrastRatio(hex1, hex2) {
    let lum1 = luminance(...hexToRgb(hex1)) + 0.05;
    let lum2 = luminance(...hexToRgb(hex2)) + 0.05;
    return lum1 > lum2 ? lum1 / lum2 : lum2 / lum1;
}

// Generate a color with sufficient contrast
function generateAccessibleColor(baseColor) {
    let newColor;
    do {
        newColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (contrastRatio(baseColor, newColor) < 4.5);
    return newColor;
}

// Find a good background color with sufficient contrast
function getRecommendedBackgroundColor(textColor) {
    return contrastRatio(textColor, "#ffffff") >= 4.5 ? "#ffffff" : "#333333";
}
