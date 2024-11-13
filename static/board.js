let myNum = []; // เริ่มต้นกระเป๋าว่างเปล่า
let limitedNum = myNum.slice(0, 10);
let selectedCoins = [];
let targetCardValue = 0;
let cardPoint = 0;
let cardColor = ""; // ตัวแปรสำหรับเก็บสีของการ์ด

// ฟังก์ชันเพื่อดึงข้อมูลของการ์ด
function getCardInfo(cardElement) {
    const value = parseInt(cardElement.querySelector(".card-number").innerText, 10);
    const point = parseInt(cardElement.querySelector(".card-small-number").innerText, 10);
    return { value, point };
}

function updateBackpack() {
    let backpackHTML = "";
    limitedNum.forEach((num, index) => {
        // เพิ่มไฮไลท์สีเขียวที่เหรียญที่ถูกเลือก
        backpackHTML += `<button onclick="selectCoin(${index})" class="backpack-button" style="border: 2px solid green;">
                            <img src="${num}" alt="item">
                         </button>`;
    });
    document.getElementById("mybackpack").innerHTML = backpackHTML;
}

function showCardPopup(cardInfo, color) {
    targetCardValue = cardInfo.value;
    cardPoint = cardInfo.point;
    cardColor = color; // เก็บสีของการ์ด
    selectedCoins = []; // ล้างเหรียญที่เลือกก่อนหน้า

    const coinButtonsHTML = limitedNum.map((num, index) => {
        return `<button onclick="addToSelectedCoins(${index})" class="backpack-button">
                    <img src="${num}" alt="item">
                </button>`;
    }).join('');

    Swal.fire({
        title: 'ใส่เหรียญเพื่อแลกขยะ',
        html: `
            <div>เลือกเหรียญที่ต้องการ:</div>
            <div class="coin-selection">
                ${coinButtonsHTML}
            </div>
            <div>เหรียญที่เลือก: <span id="selected-coins">${selectedCoins.join(', ') || 'ไม่มี'}</span></div>
            <button onclick="clearSelectedCoins()" class="clear-selection">ล้างการเลือก</button>
        `,
        showCancelButton: true,
        confirmButtonText: 'ซื้อ',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
            return confirmPurchase();
        }
    });
}

function addToSelectedCoins(index) {
    const coinValue = Number(limitedNum[index].split('/').pop().split('.')[0]);
    selectedCoins.push(coinValue);
    document.getElementById("selected-coins").innerText = selectedCoins.join(', ') || 'ไม่มี';
}

function clearSelectedCoins() {
    selectedCoins = [];
    document.getElementById("selected-coins").innerText = 'ไม่มี';
}

function confirmPurchase() {
    const product = selectedCoins.reduce((acc, num) => acc * num, 1);
    
    if (product === targetCardValue) {
        let scoreElement;
        let scoreGoal;
        if (cardColor === "green") {
            scoreElement = document.getElementById("score-green");
        } else if (cardColor === "blue") {
            scoreElement = document.getElementById("score-blue");
        } else if (cardColor === "red") {
            scoreElement = document.getElementById("score-red");
        }

        scoreElement.innerText = Number(scoreElement.innerText) + 1;
        scoreGoal = document.getElementById("score-goal");
        scoreGoal.innerText = Number(scoreGoal.innerText) + cardPoint;


        selectedCoins.forEach(coinValue => {
            const index = myNum.indexOf(`static/pics/${coinValue}.png`);
            if (index !== -1) {
                myNum.splice(index, 1);
            }
        });

        limitedNum = myNum.slice(0, 10);
        updateBackpack();

        Swal.fire("สำเร็จ! คุณได้รับการ์ด!");
    } else {
        Swal.fire("เหรียญที่เลือกไม่ตรงกับแต้มของการ์ด");
    }
}

function addCoin(coinValue) {
    if (myNum.length >= 10) {
        Swal.fire("กระเป๋าเต็มแล้ว!");
        return;
    }
    

    // เช็คว่ามีเหรียญอยู่แล้วหรือไม่ใน selectedCoins
    const isDuplicate = selectedCoins.includes(coinValue);
    selectedCoins.push(coinValue);


    if (isDuplicate) {
        Swal.fire({
            title: "เลือกเหรียญซ้ำ",
            text: "คุณต้องการหยิบ 2 เหรียญนี้ใช้ไหม?",
            showCancelButton: true,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่"
        }).then((result) => {
            if (result.isConfirmed) {
                // เพิ่มเหรียญเข้ากระเป๋าและอัพเดท backpack
                myNum.push(`static/pics/${coinValue}.png`);
                myNum.push(`static/pics/${coinValue}.png`);
                limitedNum = myNum.slice(0, 10);
                updateBackpack();
            }

            // ล้างการเลือกและไฮไลท์
            selectedCoins = [];
            clearHighlights();
        });
    } else if (selectedCoins.length === 3) {
        Swal.fire({
            title: "เลือก 3 เหรียญที่ต่างกัน",
            text: "คุณต้องการเก็บเหรียญเหล่านี้หรือไม่?",
            showCancelButton: true,
            confirmButtonText: "ใช่",
            cancelButtonText: "ไม่"
        }).then((result) => {
            if (result.isConfirmed) {
                selectedCoins.forEach((value) => {
                    myNum.push(`static/pics/${value}.png`);
                });
                limitedNum = myNum.slice(0, 10);
                updateBackpack();
            }

            // ล้างการเลือกและไฮไลท์
            selectedCoins = [];
            clearHighlights();
        });
    }
}

// ฟังก์ชันเพิ่มไฮไลท์
function highlightSelectedCoins() {
    selectedCoins.forEach((coinValue) => {
        const buttons = document.querySelectorAll(`.number-button img[alt="${coinValue}"]`);
        buttons.forEach((button) => {
            button.parentElement.classList.add("highlight");
        });
    });
}

// ฟังก์ชันลบไฮไลท์ทั้งหมด
function clearHighlights() {
    const highlightedButtons = document.querySelectorAll(".number-button.highlight");
    highlightedButtons.forEach((button) => {
        button.classList.remove("highlight");
    });
}

updateBackpack();
