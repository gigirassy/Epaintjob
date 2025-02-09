// Sync color pickers and text inputs
function syncColorPicker(input, picker) {
    input.addEventListener("input", () => picker.value = input.value);
    picker.addEventListener("input", () => input.value = picker.value);
}

syncColorPicker(document.getElementById("baseColor"), document.getElementById("baseColorPicker"));
syncColorPicker(document.getElementById("extraColor1"), document.getElementById("extraColor1Picker"));
syncColorPicker(document.getElementById("extraColor2"), document.getElementById("extraColor2Picker"));

document.getElementById('generate').addEventListener('click', function () {
    let baseColor = document.getElementById('baseColor').value.trim();
    let extraColor1 = document.getElementById('extraColor1').value.trim();
    let extraColor2 = document.getElementById('extraColor2').value.trim();

    if (!/^#([0-9A-F]{3}){1,2}$/i.test(baseColor)) {
        alert("Please enter a valid base HEX color.");
        return;
    }

    let colors = [baseColor];
    if (/^#([0-9A-F]{3}){1,2}$/i.test(extraColor1)) colors.push(extraColor1);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(extraColor2)) colors.push(extraColor2);

    while (colors.length < 5) {
        colors.push(generateAccessibleColor(baseColor));
    }

    let paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    colors.forEach(color => {
        let colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.textContent = color;
        paletteDiv.appendChild(colorBox);
    });

    let recommendedBG = getRecommendedBackgroundColor(baseColor);
    document.getElementById('bgColorPreview').textContent = recommendedBG;
    document.getElementById('bgColorPreview').style.backgroundColor = recommendedBG;
    document.getElementById('bgColorPreview').style.color = recommendedBG === "#ffffff" ? "#000" : "#fff";
});
