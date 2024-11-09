let myNum = ["pics/2.png","static/pics/3.png", "static/pics/5.png", "static/pics/7.png","static/pics/11.png","static/pics/jong.png"];
// จำกัดให้แสดงสูงสุด 10 รูปภาพ
let limitedNum = myNum.slice(0, 10);

function updateBackpack() {
    let backpackHTML = ""; // รีเซ็ต HTML

    // สร้าง HTML สำหรับแต่ละรูปใน array
    limitedNum.forEach((num, index) => {
        backpackHTML += `<button onclick="handleImageClick(${index})" class="backpack-button">
                            <img src="${num}" alt="item">
                         </button>`;
    });

    // อัปเดต HTML ใน mybackpack
    document.getElementById("mybackpack").innerHTML = backpackHTML;
}

// ฟังก์ชันเรียกใช้เมื่อกดที่รูปภาพ
function handleImageClick(index) {
    alert("คุณกดที่รูปภาพที่ตำแหน่ง " + index); // ตัวอย่างการใช้งาน
    // สามารถเพิ่มฟังก์ชันอื่นๆ ต่อที่นี่ได้
}

updateBackpack(); // เรียกใช้ครั้งแรกเพื่อแสดงภาพในกระเป๋า

function get_2() {
    if (myNum.length >= 10) {
        Swal.fire("กระเป๋าเต็มเด้อ!");
    } else {
        // เพิ่มเลข 2 ลงในอาร์เรย์
        myNum.push("static/pics/2.png");

        // จำกัดให้แสดงสูงสุด 10 รูปภาพ
        limitedNum = myNum.slice(0, 10); // อัปเดต limitedNum
        updateBackpack(); // อัปเดต HTML ใน mybackpack
    }
}