// variable will hold data URL of uploaded background image
let cardBgDataUrl = null;
let cardBgPosX = 50; // percent horizontal position
let cardBgPosY = 50; // percent vertical position
let bgZoom = 100; // percent zoom for background
let cellOpacity = 1; // default opacity for cell backgrounds
let customFontColor = '#2F3A33'; // default font color
let customBgColor = '#ffffff'; // default background color
let customFontFamily = 'Arial'; // default font family
let customStarColor = '#ffffff'; // default star color

// update cell opacity when user moves slider
const cellOpacityInput = document.getElementById("cellOpacity");
if(cellOpacityInput){
    cellOpacityInput.addEventListener("input", e => {
        cellOpacity = parseFloat(e.target.value);
        const display = document.getElementById("cellOpacityDisplay");
        if(display){
            display.textContent = Math.round(cellOpacity * 100) + "%";
        }
    });
}

// theme toggle
const themeToggle = document.getElementById("themeToggle");
if(themeToggle){
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        themeToggle.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
    });
}

// advanced sliders for background position – live update text displays
const posXInput = document.getElementById("bgPosX");
const posYInput = document.getElementById("bgPosY");
const posXDisplay = document.getElementById("bgPosXDisplay");
const posYDisplay = document.getElementById("bgPosYDisplay");
const bgZoomInput = document.getElementById("bgZoom");
const bgZoomDisplay = document.getElementById("bgZoomDisplay");
const bgPreview = document.getElementById("bgPreview");

function updatePreview(){
    if(bgPreview && cardBgDataUrl){
        const previewSize = 200; // px, same as CSS
        const cardResolution = 4096; // we assume export will be 4096x4096
        const scale = previewSize / cardResolution; // factor to shrink
        const zoomFactor = bgZoom / 100;
        bgPreview.style.backgroundImage = `url('${cardBgDataUrl}')`;
        bgPreview.style.backgroundPosition = `${cardBgPosX}% ${cardBgPosY}%`;
        // compute pixel size so 100% zoom corresponds to cardResolution
        bgPreview.style.backgroundSize = `${cardResolution * scale * zoomFactor}px`;
    }
    // apply custom styles to preview
    if(bgPreview){
        bgPreview.style.backgroundColor = customBgColor;
    }
    const previewTitle = document.getElementById("previewTitle");
    if(previewTitle){
        previewTitle.style.color = customFontColor;
    }
}

// Gesture support on preview: drag to reposition, wheel to zoom
if(bgPreview){
    let dragging = false, startX=0, startY=0, startPosX=50, startPosY=50;
    bgPreview.addEventListener('mousedown', e => {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startPosX = cardBgPosX;
        startPosY = cardBgPosY;
        e.preventDefault();
    });
    window.addEventListener('mouseup', () => { dragging=false; });
    window.addEventListener('mousemove', e => {
        if(dragging){
            const rect = bgPreview.getBoundingClientRect();
            const dx = (e.clientX - startX) / rect.width * 100;
            const dy = (e.clientY - startY) / rect.height * 100;
            // move in direction of swipe
            cardBgPosX = Math.min(100, Math.max(0, startPosX + dx));
            cardBgPosY = Math.min(100, Math.max(0, startPosY + dy));
            // update preview immediately for smooth visual feedback
            updatePreview();
            // defer slider updates to avoid performance lag during drag
        }
    });
    // update sliders and display only when drag ends
    window.addEventListener('mouseup', () => {
        if(dragging){
            posXInput.value = cardBgPosX;
            posYInput.value = cardBgPosY;
            posXDisplay.textContent = Math.round(cardBgPosX) + '%';
            posYDisplay.textContent = Math.round(cardBgPosY) + '%';
        }
        dragging = false;
    });

    bgPreview.addEventListener('wheel', e => {
        e.preventDefault();
        if(e.deltaY < 0) bgZoom = Math.min(200, bgZoom + 5);
        else bgZoom = Math.max(50, bgZoom - 5);
        bgZoomInput.value = bgZoom;
        bgZoomDisplay.textContent = bgZoom + '%';
        updatePreview();
    });
    // also touch support
    bgPreview.addEventListener('touchstart', e => {
        if(e.touches.length===1){
            dragging=true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startPosX = cardBgPosX;
            startPosY = cardBgPosY;
        }
    });
    bgPreview.addEventListener('touchmove', e => {
        if(dragging && e.touches.length===1){
            const rect = bgPreview.getBoundingClientRect();
            const dx = (e.touches[0].clientX - startX) / rect.width * 100;
            const dy = (e.touches[0].clientY - startY) / rect.height * 100;
            cardBgPosX = Math.min(100, Math.max(0, startPosX + dx));
            cardBgPosY = Math.min(100, Math.max(0, startPosY + dy));
            // update preview immediately for smooth visual feedback
            updatePreview();
            // defer slider updates to avoid performance lag during drag
        }
    });
    bgPreview.addEventListener('touchend', () => {
        if(dragging){
            // update sliders and display when touch ends
            posXInput.value = cardBgPosX;
            posYInput.value = cardBgPosY;
            posXDisplay.textContent = Math.round(cardBgPosX) + '%';
            posYDisplay.textContent = Math.round(cardBgPosY) + '%';
        }
        dragging=false;
    });
}

if(posXInput && posXDisplay){
    posXInput.addEventListener("input", e => {
        cardBgPosX = parseInt(e.target.value);
        posXDisplay.textContent = cardBgPosX + "%";
        updatePreview();
    });}
if(posYInput && posYDisplay){
    posYInput.addEventListener("input", e => {
        cardBgPosY = parseInt(e.target.value);
        posYDisplay.textContent = cardBgPosY + "%";
        updatePreview();
    });
}
if(bgZoomInput && bgZoomDisplay){
    bgZoomInput.addEventListener("input", e => {
        bgZoom = parseInt(e.target.value);
        bgZoomDisplay.textContent = bgZoom + "%";
        updatePreview();
    });
}

// custom color inputs
const fontColorInput = document.getElementById("fontColor");
const bgColorInput = document.getElementById("bgColor");
if(fontColorInput){
    fontColorInput.addEventListener("input", e => {
        customFontColor = e.target.value;
    });
}
if(bgColorInput){
    bgColorInput.addEventListener("input", e => {
        customBgColor = e.target.value;
    });
}

// custom font family select
const fontFamilySelect = document.getElementById("fontFamily");
if(fontFamilySelect){
    // Function to preload and check if a font is loaded
    function loadFont(fontName) {
        // System fonts don't need preloading
        if (fontName === 'Arial' || fontName === 'Trebuchet MS' || fontName === 'Georgia') {
            return Promise.resolve(); // Instantly resolve for system fonts
        }
        
        // Check if the Google Font is already loaded
        if (document.fonts.check(`12px "${fontName}"`)) {
            return Promise.resolve(); // Font is ready
        } else {
            // Wait for the font to load using the Font Loading API
            return document.fonts.load(`12px "${fontName}"`);
        }
    }
    
    // Listen for changes to the font family dropdown
    fontFamilySelect.addEventListener("change", e => {
        const selectedFont = e.target.value;
        customFontFamily = selectedFont; // Update the global variable
        
        // Preload the font and apply it only after loading to avoid flicker
        loadFont(selectedFont).then(() => {
            // Apply the font to the preview title only after it's loaded
            const previewTitle = document.getElementById("previewTitle");
            if (previewTitle) {
                previewTitle.style.fontFamily = selectedFont;
            }
        }).catch(() => {
            // Fallback: apply the font anyway if loading fails
            const previewTitle = document.getElementById("previewTitle");
            if (previewTitle) {
                previewTitle.style.fontFamily = selectedFont;
            }
        });
    });
}

// Set initial font on page load
loadFont(customFontFamily).then(() => {
    const previewTitle = document.getElementById("previewTitle");
    if (previewTitle) {
        previewTitle.style.fontFamily = customFontFamily;
    }
});

// custom star color
const showStarsCheckbox = document.getElementById("showStars");
const starColorInput = document.getElementById("starColor");
if(showStarsCheckbox && starColorInput){
    // toggle visibility of color input based on checkbox
    function updateStarColorVisibility(){
        starColorInput.style.display = showStarsCheckbox.checked ? 'inline' : 'none';
    }
    showStarsCheckbox.addEventListener("change", updateStarColorVisibility);
    updateStarColorVisibility(); // set initial visibility
    
    // listen for color changes
    starColorInput.addEventListener("input", e => {
        customStarColor = e.target.value;
    });
}

// advanced toggle button behaviour
const advToggle = document.getElementById("advancedToggle");
const advSection = document.getElementById("advancedSettings");
if(advToggle && advSection){
    advToggle.addEventListener("click", () => {
        if(advSection.style.display === "none"){
            advSection.style.display = "block";
            advToggle.textContent = "Hide advanced settings";
        } else {
            advSection.style.display = "none";
            advToggle.textContent = "Advanced settings";
        }
    });
}

// when a file is selected, read it as a data URL so it can be used as a CSS background
const bgInput = document.getElementById("bgImageInput");
const bgNotice = document.getElementById("bgUploadNotice");
if (bgInput) {
    // helper to show/hide notification
    const showNotice = () => {
        if (bgNotice) {
            bgNotice.style.visibility = "visible";
        }
    };

    // handle manual file selection
    const processFile = file => {
        if (!file) return;
        if (file.type !== "image/png") {
            alert("Please select a PNG image.");
            return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            cardBgDataUrl = ev.target.result; // store data URL globally
            showNotice();
            updatePreview(); // refresh preview whenever a new image is loaded
        };
        reader.readAsDataURL(file);
    };

    bgInput.addEventListener("change", e => {
        processFile(e.target.files[0]);
    });

    // allow drag-and-drop onto the input area
    bgInput.addEventListener("dragover", e => {
        e.preventDefault();
        bgInput.classList.add("drag-over");
    });
    bgInput.addEventListener("dragleave", () => {
        bgInput.classList.remove("drag-over");
    });
    bgInput.addEventListener("drop", e => {
        e.preventDefault();
        bgInput.classList.remove("drag-over");
        const file = e.dataTransfer.files[0];
        processFile(file);
    });
}

function shuffle(array) {
    /* Fisher-Yates shuffle algorithm */
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function generateCards(){

const items = document.getElementById("items")
.value
.split("\n")
.filter(x => x.trim() !== "");

const size = parseInt(document.getElementById("gridSize").value);

const cardCount = parseInt(document.getElementById("cardCount").value);

const freeCenter = document.getElementById("freeCenter").checked;

const theme = document.getElementById("cardTheme").value;

const showStars = document.getElementById("showStars").checked;

const cardTitleText = document.getElementById("cardTitle").value.trim();

const container = document.getElementById("cardsContainer");

container.innerHTML = "";

let needed = size * size;

if(size === 5 && freeCenter){
needed = 24;
}

let shuffled = shuffle([...items]).slice(0, Math.min(needed, items.length));

for(let c=0;c<cardCount;c++){

let card = document.createElement("div");
card.className = "card card-" + theme;

// apply custom colors
card.style.color = customFontColor;
card.style.backgroundColor = customBgColor;
card.style.fontFamily = customFontFamily;

// if a custom title was entered, add it atop the card
if(cardTitleText){
    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.innerText = cardTitleText;
    card.appendChild(titleEl);
}

// set cell background opacity
card.style.setProperty('--cell-opacity', cellOpacity);

// if user has uploaded a PNG, use it as the card's background
if(cardBgDataUrl){
    card.style.backgroundImage = `url('${cardBgDataUrl}')`;
    card.style.backgroundSize = `${bgZoom}%`;
    // use position sliders values
    card.style.backgroundPosition = `${cardBgPosX}% ${cardBgPosY}%`;
    // add a helper class so CSS can insert a semi-transparent overlay
    card.classList.add("has-bg");
}

let grid = document.createElement("div");

grid.className = "grid";

grid.style.gridTemplateColumns = `repeat(${size},1fr)`;

// Determine free positions randomly
let allPositions = [];
for(let i=0;i<size;i++){
for(let j=0;j<size;j++){
allPositions.push(`${i}-${j}`);
}
}
shuffle(allPositions);

let freePositions = new Set();
let numFree;
if(size === 5 && freeCenter){
numFree = 1;
} else {
numFree = Math.max(0, size * size - shuffled.length);
}
for(let k=0; k<numFree; k++){
freePositions.add(allPositions[k]);
}

let itemIndex = 0;

for(let i=0;i<size;i++){

for(let j=0;j<size;j++){

let cell = document.createElement("div");
cell.className = "cell";

if(freePositions.has(`${i}-${j}`)){
    cell.innerText = showStars ? "★" : "";
    if(showStars){
        cell.classList.add("free");
        cell.style.color = customStarColor;
    }
} else {
    if(itemIndex < shuffled.length){
        cell.innerText = shuffled[itemIndex];
    } else {
        cell.innerText = "";
    }
    itemIndex++;
}

grid.appendChild(cell);

}

}

card.appendChild(grid);

container.appendChild(card);

}

}


function printCards(){

window.print();

}


async function downloadPNG(){

const cards = document.querySelectorAll(".card");

let i=1;

for(const card of cards){

const canvas = await html2canvas(card, {scale: 2}); // HD resolution

const link = document.createElement("a");

link.download = "bingo-card-"+i+".png";

link.href = canvas.toDataURL();

link.click();

i++;

}

}


async function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

const cards = document.querySelectorAll(".card");

let first = true;

const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm for A4

const cardWidth = 180;

const centerX = (pageWidth - cardWidth) / 2; // center horizontally

for(const card of cards){

const canvas = await html2canvas(card, {scale: 2}); // HD resolution

const img = canvas.toDataURL("image/png");

if(!first){
pdf.addPage();
}

pdf.addImage(img,"PNG", centerX, 10, cardWidth, cardWidth); // centered, same height as width

first = false;

}

pdf.save("bingo-cards.pdf");

}


function loadItems(){

const text = document.getElementById("items").value;

const items = text.split("\n").filter(x => x.trim() !== "");

const list = document.getElementById("itemList");

list.innerHTML = "";

items.forEach(item => {

let li = document.createElement("li");

li.textContent = item;

li.draggable = true;

li.className = "draggable";

list.appendChild(li);

});

enableDrag();

}

function enableDrag(){

const draggables = document.querySelectorAll(".draggable");

const container = document.getElementById("itemList");

draggables.forEach(draggable => {

draggable.addEventListener("dragstart", () => {

draggable.classList.add("dragging");

});

draggable.addEventListener("dragend", () => {

draggable.classList.remove("dragging");

});

});

container.addEventListener("dragover", e => {

e.preventDefault();

const dragging = document.querySelector(".dragging");

const afterElement = getDragAfterElement(container, e.clientY);

if(afterElement == null){

container.appendChild(dragging);

}else{

container.insertBefore(dragging, afterElement);

}

});

}

function getDragAfterElement(container, y){

const elements = [...container.querySelectorAll(".draggable:not(.dragging)")];

return elements.reduce((closest, child) => {

const box = child.getBoundingClientRect();

const offset = y - box.top - box.height / 2;

if(offset < 0 && offset > closest.offset){

return { offset: offset, element: child };

}else{

return closest;

}

},{ offset: Number.NEGATIVE_INFINITY }).element;

}

let callerItems = [];
let calledIndex = 0;

function startCaller(){

const items = document.getElementById("items")
.value
.split("\n")
.filter(x => x.trim() !== "");

callerItems = shuffle([...items]);

calledIndex = 0;

nextCall();

}

function nextCall(){

if(calledIndex >= callerItems.length){

document.getElementById("callerDisplay").innerText = "Finished";

return;

}

document.getElementById("callerDisplay").innerText =
callerItems[calledIndex];

calledIndex++;

}
