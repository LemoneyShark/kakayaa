let myNum = []; // เริ่มต้นกระเป๋าว่างเปล่า
let limitedNum = myNum.slice(0, 10);
let selectedCoins = [];
let targetCardValue = 0;
let cardPoint = 0;
let cardColor = ""; // ตัวแปรสำหรับเก็บสีของการ์ด

function updateBackpack() {
    let backpackHTML = "";
    limitedNum.forEach((num, index) => {
        backpackHTML += `<button onclick="selectCoin(${index})" class="backpack-button">
                            <img src="${num}" alt="item">
                         </button>`;
    });
    document.getElementById("mybackpack").innerHTML = backpackHTML;
}

function showCardPopup(value, point, color) {
    targetCardValue = value;
    cardPoint = point;
    cardColor = color; // เก็บสีของการ์ด
    selectedCoins = []; // ล้างเหรียญที่เลือกก่อนหน้า

    const coinButtonsHTML = limitedNum.map((num, index) => {
        return `<button onclick="addToSelectedCoins(${index})" class="backpack-button">
                    <img src="${num}" alt="item">
                </button>`;
    }).join('');

    Swal.fire({
        title: 'ใส่เหรียญเพื่อแลกการ์ด',
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
    const coinValue = Number(limitedNum[index].split('/').pop().split('.')[0]); // ดึงเลขเหรียญจากชื่อไฟล์
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
        
        if (cardColor === "green") {
            scoreElement = document.getElementById("score-green");
        } else if (cardColor === "blue") {
            scoreElement = document.getElementById("score-blue");
        } else if (cardColor === "red") {
            scoreElement = document.getElementById("score-red");
        }

        // ตรวจสอบว่ามี scoreElement หรือไม่
        if (!scoreElement) {
            console.error("ไม่พบ scoreElement สำหรับสีการ์ด:", cardColor);
            Swal.fire("เกิดข้อผิดพลาด: ไม่พบคะแนนสำหรับการ์ดสีที่เลือก");
            return;
        }

        // เพิ่มแต้มในคะแนนตามสีการ์ด
        scoreElement.innerText = Number(scoreElement.innerText) + cardPoint;

        // ลบเหรียญที่เลือกจากกระเป๋า
        selectedCoins.forEach(coinValue => {
            const index = myNum.indexOf(`static/pics/${coinValue}.png`);
            if (index !== -1) {
                myNum.splice(index, 1); // ลบเหรียญจากกระเป๋า
            }
        });

        // อัปเดตกระเป๋าและแสดงผล
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
    } else {
        myNum.push(`static/pics/${coinValue}.png`);
        limitedNum = myNum.slice(0, 10);
        updateBackpack();
    }
}

updateBackpack();