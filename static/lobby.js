// ดึงข้อมูลผู้เล่นจากห้อง
async function fetchLobby() {
    const roomId = new URLSearchParams(window.location.search).get('room_id');
    console.log(roomId);  // ตรวจสอบว่า roomId ที่ได้มาจาก URL ถูกต้องหรือไม่
    const response = await fetch(`http://127.0.0.1:8000/lobby/${roomId}`);
    const data = await response.json();

    if (response.ok) {
      const playerList = data.players.join(", ");
      document.getElementById("players-list").innerText = playerList;
    } else {
      alert(data.detail);
    }
  }

  // เมื่อโหลดหน้า
  window.onload = fetchLobby;

// ฟังก์ชัน leaveRoom ที่จัดการการออกจากห้อง
async function leaveRoom() {
    const roomId = new URLSearchParams(window.location.search).get('room_id');
    const playerName = "PlayerName";  // ตัวอย่าง: ดึงชื่อผู้เล่นจากที่เก็บข้อมูล

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

        // แจ้งเตือนว่าผู้เล่นออกจากห้องสำเร็จ
        Swal.fire({
            title: "ออกจากห้องสำเร็จ!",
            text: `${playerName} ออกจากห้อง ${roomId} สำเร็จ`,
            icon: "success"
        }).then(() => {
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

