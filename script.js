document.getElementById("addItemBtn").addEventListener("click", function() {
    const barcodeInput = document.getElementById("barcode");
    const barcode = barcodeInput.value.trim();
    
    if (barcode) {
        addItemToInventory(barcode);
        barcodeInput.value = ""; // Clear input field
    }
});

document.getElementById("scanBtn").addEventListener("click", function() {
    startScanner();
});

function startScanner() {
    const cameraDiv = document.getElementById("camera");
    cameraDiv.style.display = "block";

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById("preview"),
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
        },
    }, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
        const code = data.codeResult.code;
        addItemToInventory(code);
        Quagga.stop();
        cameraDiv.style.display = "none"; // Hide camera after detection
    });
}

function addItemToInventory(barcode) {
    const inventoryList = document.getElementById("inventoryList");
    
    const listItem = document.createElement("li");
    listItem.textContent = barcode;

    const statusSelect = document.createElement("select");
    statusSelect.innerHTML = `
        <option value="inStock">In Stock</option>
        <option value="almostOut">Almost Out</option>
        <option value="completelyOut">Completely Out</option>
    `;
    statusSelect.addEventListener("change", function() {
        const status = statusSelect.value;
        listItem.style.color = status === "inStock" ? "black" : (status === "almostOut" ? "orange" : "red");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function() {
        inventoryList.removeChild(listItem);
    });

    listItem.appendChild(statusSelect);
    listItem.appendChild(deleteBtn);
    inventoryList.appendChild(listItem);
}
