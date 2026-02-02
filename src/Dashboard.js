import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [openTables, setOpenTables] = useState(0);
    const [dailyRevenue, setDailyRevenue] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [user, setUser] = useState("");

  
    useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser?.username || "Kullanıcı");
}, []);

    // 📊 DASHBOARD VERİLERİ
    useEffect(() => {
        const updateData = () => {
            const today = new Date().toLocaleDateString("tr-TR");
            const lastResetDate = localStorage.getItem("lastResetDate");

            if (lastResetDate !== today) {
                localStorage.setItem("dailyRevenue", "0");
                localStorage.setItem("orderCount", "0");
                localStorage.setItem("lastResetDate", today);
            }

            const tables = JSON.parse(localStorage.getItem("tables")) || [];
            const openCount = tables.filter(t => t.dolu).length;

            setOpenTables(openCount > 0 ? openCount - 1 : 0);
            setDailyRevenue(Number(localStorage.getItem("dailyRevenue")) || 0);
            setOrderCount(Number(localStorage.getItem("orderCount")) || 0);
        };

        updateData();
        window.addEventListener("tablesUpdated", updateData);

        return () => {
            window.removeEventListener("tablesUpdated", updateData);
        };
    }, []);

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
                <h1 style={styles.title}>Restoran POS</h1>

                <div style={styles.headerRight}>
                    <span style={styles.user}>👤 {user}</span>

                    <span style={styles.date}>
                        {new Date().toLocaleString("tr-TR")}
                    </span>

                    <button
                        style={styles.logout}
                        onClick={() => {
                            localStorage.removeItem("isAuth");
                            localStorage.removeItem("currentUser");
                            navigate("/login");
                        }}
                    >
                        🚪 Çıkış
                    </button>
                </div>
            </div>

            {/* İSTATİSTİKLER */}
            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <h3>Günlük Ciro</h3>
                    <p style={styles.statValue}>₺{dailyRevenue}</p>
                </div>

                <div style={styles.statCard}>
                    <h3>Sipariş</h3>
                    <p style={styles.statValue}>{orderCount}</p>
                </div>

                <div style={styles.statCard}>
                    <h3>Açık Masa</h3>
                    <p style={styles.statValue}>{openTables}</p>
                </div>
            </div>

            {/* AKSİYON BUTONLARI */}
            <div style={styles.actions}>
                <button style={styles.button} onClick={() => navigate("/siparis")}>
                    🍽️ Sipariş
                </button>

                <button style={styles.button} onClick={() => navigate("/masalar")}>
                    🪑 Masalar
                </button>

                <button style={styles.button} onClick={() => navigate("/urunler")}>
                    📦 Ürünler
                </button>

                <button style={styles.button} onClick={() => navigate("/rezervasyon")}>
                    📅 Rezervasyon
                </button>

                <button
                    style={{
                        ...styles.button,
                        backgroundColor: "#93c5fd",
                        color: "#1e3a8a",
                    }}
                    onClick={() => navigate("/kullanici-ekle")}
                >
                    👤 Kullanıcı Ekle
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial",
        color: "#1f2937",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#1e3a8a",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    user: {
        fontWeight: "bold",
        color: "#1e3a8a",
        fontSize: "16px",
    },
    date: {
        fontSize: "14px",
        color: "#6b7280",
    },
    logout: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    stats: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "40px",
    },
    statCard: {
        backgroundColor: "#b5caf8",
        borderRadius: "18px",
        padding: "24px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    },
    statValue: {
        fontSize: "28px",
        fontWeight: "bold",
        marginTop: "8px",
        color: "#1e3a8a",
    },
    actions: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginTop: "20px",
    },
    button: {
        backgroundColor: "#93c5fd",
        border: "none",
        borderRadius: "22px",
        padding: "30px",
        fontSize: "20px",
        color: "#1e3a8a",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
    },
};

export default Dashboard;
