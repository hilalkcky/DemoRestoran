import React, { useState, useEffect } from "react"; // ✅ useEffect eklendi
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // oturumdaki kullanıcı

    const [mode, setMode] = useState("add"); // add | update

    // Kullanıcı ekle
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Şifre güncelle
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [error, setError] = useState("");

    // 🔹 Default admin ve erişim kontrolü
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Eğer users yoksa default admin oluştur
        if (users.length === 0) {
            const defaultAdmin = [
                { username: "admin", password: "1234", role: "admin" }
            ];
            localStorage.setItem("users", JSON.stringify(defaultAdmin));
        }

        // Sadece admin erişebilir
        if (!currentUser || currentUser.role !== "admin") {
            alert("Bu sayfaya sadece admin erişebilir");
            navigate("/");
        }
    }, [navigate, currentUser]);

    const handleAddUser = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.some(u => u.username === username)) {
            setError("Bu kullanıcı zaten var");
            return;
        }

        users.push({ username, password, role: "user" }); // role default: user
        localStorage.setItem("users", JSON.stringify(users));

        alert("Kullanıcı eklendi");
        setUsername("");
        setPassword("");
        setError("");
    };

    const handleUpdatePassword = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.username === currentUser.username);

        if (index === -1) {
            setError("Kullanıcı bulunamadı");
            return;
        }

        if (users[index].password !== oldPassword) {
            setError("Mevcut şifre yanlış");
            return;
        }

        users[index].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Şifre güncellendi");
        setOldPassword("");
        setNewPassword("");
        setError("");
    };

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => navigate("/")}>
                ← Anasayfa
            </button>

            <div style={styles.card}>
                <h2>👤 Kullanıcı Yönetimi</h2>

                {/* MODE SEÇİMİ */}
                <div style={styles.switch}>
                    <button
                        style={{
                            ...styles.switchButton,
                            backgroundColor: mode === "add" ? "#2563eb" : "#e5e7eb",
                            color: mode === "add" ? "#fff" : "#000",
                        }}
                        onClick={() => setMode("add")}
                    >
                        ➕ Kullanıcı Ekle
                    </button>

                    <button
                        style={{
                            ...styles.switchButton,
                            backgroundColor: mode === "update" ? "#2563eb" : "#e5e7eb",
                            color: mode === "update" ? "#fff" : "#000",
                        }}
                        onClick={() => setMode("update")}
                    >
                        🔑 Şifre Güncelle
                    </button>
                </div>

                {/* KULLANICI EKLE */}
                {mode === "add" && (
                    <>
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />

                        <button style={styles.mainButton} onClick={handleAddUser}>
                            Kullanıcı Ekle
                        </button>
                    </>
                )}

                {/* ŞİFRE GÜNCELLE */}
                {mode === "update" && (
                    <>
                        <input
                            type="password"
                            placeholder="Mevcut Şifre"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="password"
                            placeholder="Yeni Şifre"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.input}
                        />

                        <button style={styles.mainButton} onClick={handleUpdatePassword}>
                            Şifreyi Güncelle
                        </button>
                    </>
                )}

                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "transparent",
        border: "none",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        color: "#1e3a8a",
    },
    card: {
        background: "#fff",
        padding: "32px",
        borderRadius: "16px",
        width: "360px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        textAlign: "center",
    },
    switch: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
    },
    switchButton: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    mainButton: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "#fff",
        fontSize: "17px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "10px",
        fontSize: "14px",
    },
};
