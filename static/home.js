async function createRoom() {
    console.log("test")
    Swal.fire({
        title: "ใส่ชื่อผู้เล่น",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "สร้างห้อง",
        showLoaderOnConfirm: true,
        preConfirm: async (playerName) => {
            if (!playerName) {
                console.log("test");
                Swal.showValidationMessage(`กรุณาใส่ชื่อผู้เล่น`);
                return;
            }
            // เก็บชื่อผู้เล่นใน localStorage
            localStorage.setItem('playerName', playerName);

            try {
                const response = await fetch("http://127.0.0.1:8000/create_room", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ player_name: playerName })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail);
                }

                const data = await response.json();
                return data;  // ส่งข้อมูลห้องที่สร้างไปยัง then ด้านล่าง
            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error}`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            const roomId = result.value.room_id;
            Swal.fire({
                title: `ห้องถูกสร้างสำเร็จ!`,
                text: `รหัสห้องของคุณคือ: ${roomId}`,
                icon: "success"
            }).then(() => {
                // ย้ายไปหน้า lobby ด้วย room_id
                window.location.href = `lobby?room_id=${roomId}`;
            });
        }
    });
}

async function joinRoom() {
    const roomId = document.getElementById("room-id").value;

    if (!roomId) {
        Swal.fire("กรุณาใส่รหัสห้อง");
        return;
    }

    const { value: playerName } = await Swal.fire({
        title: "กรุณาใส่ชื่อผู้เล่น",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "เข้าร่วมห้อง",
        showLoaderOnConfirm: true,
        preConfirm: async (playerName) => {
            if (!playerName) {
                Swal.showValidationMessage("กรุณาใส่ชื่อผู้เล่น");
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/join_room/${roomId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ player_name: playerName })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.detail || "ไม่สามารถเข้าร่วมห้องได้");
                }
                return data;
            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error}`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    if (playerName) {
        // ตรวจสอบค่าของ playerName ก่อนเก็บลง localStorage
        console.log("Player name from Swal:", playerName); // ดูค่าใน console ก่อน

        // ถ้า playerName เป็น Object, ดึงค่าจาก message
        let playerNameString = playerName.message || playerName;

        // เก็บชื่อผู้เล่นใน localStorage
        localStorage.setItem('playerName', playerNameString);

        Swal.fire({
            title: `เข้าร่วมห้องสำเร็จ!`,
            text: `${playerNameString} เข้าร่วมห้อง ${roomId} สำเร็จ`,
            icon: "success"
        }).then(() => {
            // ย้ายไปหน้า lobby ด้วย room_id
            window.location.href = `lobby?room_id=${roomId}`;
        });
    }
}


