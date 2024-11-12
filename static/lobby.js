async function fetchLobby() {
    // ดึง roomId จาก URL query string
    const roomId = new URLSearchParams(window.location.search).get('room_id');
    console.log("Room ID:", roomId);  // ตรวจสอบว่า roomId ที่ได้มาจาก URL ถูกต้องหรือไม่
    
    // ดึงชื่อผู้เล่นจาก localStorage
    const playerName = localStorage.getItem('playerName');  // ต้องใช้ localStorage.getItem เพื่อดึงชื่อผู้เล่น
    
    if (!playerName) {
        console.error("Player name not found in localStorage.");
        return;  // ถ้าไม่พบชื่อผู้เล่น, หยุดการทำงาน
    }

    console.log("Player name from localStorage:", playerName);  // ตรวจสอบว่าได้ค่าชื่อผู้เล่นหรือไม่
    
    try {
        // ดึงข้อมูลห้องจาก API
        const response = await fetch(`http://127.0.0.1:8000/lobby/${roomId}`);
        const data = await response.json();

        if (response.ok) {
            // แสดงรายชื่อผู้เล่นใน lobby
            const playerList = data.players.join(", ");
            document.getElementById("players-list").innerText = playerList;
        } else {
            console.error("Error fetching lobby data:", data);
            alert(data.detail);
        }
    } catch (error) {
        console.error("Error fetching lobby data:", error);
    }
}

// เรียกใช้ฟังก์ชัน fetchLobby เมื่อโหลดหน้า
window.onload = fetchLobby;


// ฟังก์ชัน leaveRoom ที่จัดการการออกจากห้อง
async function leaveRoom() {
    const roomId = new URLSearchParams(window.location.search).get('room_id');
    const playerName = localStorage.getItem('playerName');  // ดึงชื่อผู้เล่นจาก localStorage
    console.log(playerName); // ตรวจสอบค่าของ playerName

    if (!playerName) {
        Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่พบชื่อผู้เล่นในระบบ",
            icon: "error"
        });
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/leave_room/${roomId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ player_name: playerName })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "ไม่สามารถออกจากห้องได้");
        }

        Swal.fire({
            title: "ออกจากห้องสำเร็จ!",
            text: `${playerName} ออกจากห้อง ${roomId} สำเร็จ`,
            icon: "success"
        }).then(() => {
            // หลังจากออกจากห้องสำเร็จ
            localStorage.removeItem('playerName');

            // เปลี่ยนเส้นทางไปหน้า home
            window.location.href = "/home";
        });
    } catch (error) {
        Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: `ไม่สามารถออกจากห้องได้: ${error.message}`,
            icon: "error"
        });
    }
}

