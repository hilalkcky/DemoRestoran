import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AREAS = ["Bahçe", "Salon", "Teras"];
const TABLES_PER_AREA = 10;

export default function Tables() {
    const navigate = useNavigate();
    const [selectedArea, setSelectedArea] = useState("Bahçe");
    const [tables, setTables] = useState([]);
    const [reservations, setReservations] = useState([]);

    /* 🔹 İlk açılış */
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("tables")) || [];
        const storedRes = JSON.parse(localStorage.getItem("reservations")) || [];
        setReservations(storedRes);

        let id = stored.length > 0 ? Math.max(...stored.map(t => t.id)) + 1 : 1;
        const updatedTables = [...stored];

        AREAS.forEach(area => {
            const areaTables = stored.filter(t => t.area === area);

            for (let i = areaTables.length + 1; i <= TABLES_PER_AREA; i++) {
                updatedTables.push({
                    id: id++,
                    area,
                    name: `Masa ${i}`,
                    dolu: false,
                    total: 0,
                    startTime: null,
                });
            }
        });

        localStorage.setItem("tables", JSON.stringify(updatedTables));
        setTables(updatedTables);
    }, []);

    /* 🔹 ŞU ANDA REZERVE Mİ? */
    const isReservedNow = (tableId) => {
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        return reservations.some(r =>
            Number(r.tableId) === tableId &&
            r.date === today &&
            r.time <= currentTime
        );
    };

    /* 🔹 Masaya tıkla */
    const openTable = (table) => {
        // 🔴 Masa aktif siparişte doluysa
        if (table.dolu) {
            alert("❌ Bu masa şu anda kullanımda!");
            return;
        }

        // 🔴 Rezervasyon varsa
        if (isReservedNow(table.id)) {
            alert("⏰ Bu masa şu anda rezerve!");
            return;
        }

        localStorage.setItem("activeTable", table.id);
        navigate("/siparis");
    };

    /* 🔹 Süre */
    const getDuration = (startTime) => {
        if (!startTime) return "00:00";
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const min = String(Math.floor(diff / 60)).padStart(2, "0");
        const sec = String(diff % 60).padStart(2, "0");
        return `${min}:${sec}`;
    };

    const filteredTables = tables.filter(t => t.area === selectedArea);

    return (
        <div style={styles.page}>
            <button style={styles.backButton} onClick={() => navigate("/")}>
                ⬅ Anasayfa
            </button>

            <div style={styles.layout}>
                {/* ALANLAR */}
                <div style={styles.areasBox}>
                    <h3 style={styles.title}>Alanlar</h3>
                    {AREAS.map(area => (
                        <button
                            key={area}
                            style={{
                                ...styles.areaButton,
                                backgroundColor:
                                    selectedArea === area ? "#1e3a8a" : "#c7d2fe",
                                color:
                                    selectedArea === area ? "#fff" : "#1e3a8a",
                            }}
                            onClick={() => setSelectedArea(area)}
                        >
                            {area}
                        </button>
                    ))}
                </div>

                {/* MASALAR */}
                <div style={styles.tablesBox}>
                    <h3 style={styles.title}>{selectedArea} Masaları</h3>

                    <div style={styles.tablesGrid}>
                        {filteredTables.map(table => {
                            const reservedNow = isReservedNow(table.id);

                            return (
                                <div
                                    key={table.id}
                                    style={{
                                        ...styles.tableCard,
                                        backgroundColor:
                                            table.dolu || reservedNow
                                                ? "#1e40af"
                                                : "#dbeafe",
                                        color:
                                            table.dolu || reservedNow
                                                ? "#ffffff"
                                                : "#1e3a8a",
                                        opacity: reservedNow ? 0.6 : 1,
                                    }}
                                    onClick={() => openTable(table)}
                                >
                                    <strong>{table.name}</strong>

                                    {table.dolu && (
                                        <>
                                            <span style={styles.info}>₺{table.total}</span>
                                            <span style={styles.info}>
                                                ⏱ {getDuration(table.startTime)}
                                            </span>
                                        </>
                                    )}

                                    {reservedNow && (
                                        <span style={styles.info}>⏰ Rezerve</span>
                                    )}

                                    <span style={styles.status}>
                                        {table.dolu
                                            ? "DOLU"
                                            : reservedNow
                                            ? "REZERVE"
                                            : "BOŞ"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* 🔹 STYLES */
const styles = {
    page: { padding: 20 },
    backButton: {
        padding: "8px 16px",
        marginBottom: "20px",
        cursor: "pointer",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#1e3a8a",
        color: "#fff"
    },
    layout: { display: "flex", gap: 20 },
    areasBox: { width: 200 },
    tablesBox: { flex: 1 },
    title: { marginBottom: 10 },
    areaButton: {
        width: "100%",
        padding: 10,
        marginBottom: 5,
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    tablesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 20,
    },
    tableCard: {
        padding: 20,
        borderRadius: 14,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
        fontWeight: 600,
    },
    info: { fontSize: 12 },
    status: { fontSize: 11, opacity: 0.8 },
};
