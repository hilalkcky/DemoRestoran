import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Rezervasyon() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);

    const [form, setForm] = useState({
        name: "",
        tableId: "",
        guests: "",
        date: "",
        time: ""
    });

    useEffect(() => {
        const savedRes = JSON.parse(localStorage.getItem("reservations")) || [];
        const savedTables = JSON.parse(localStorage.getItem("tables")) || [];
        setReservations(savedRes);
        setTables(savedTables);
    }, []);

    const handleAdd = () => {
        const { name, tableId, date, time } = form;

        if (!name || !tableId || !date || !time) {
            alert("❌ Lütfen boş alan bırakmayın!");
            return;
        }

        // 3️⃣ GEÇMİŞ TARİH / SAAT ENGELİ
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        if (selectedDateTime < now) {
            alert("❌ Geçmiş tarih veya saate rezervasyon yapılamaz!");
            return;
        }

        // Seçilen masa
        const selectedTable = tables.find(t => t.id === Number(tableId));

        // 2️⃣ MASA ŞU AN DOLU MU?
        if (selectedTable?.dolu) {
            alert("❌ Bu masa şu anda dolu, rezervasyon alınamaz!");
            return;
        }

        // 1️⃣ AYNI MASA + TARİH + SAAT KONTROLÜ
        const conflict = reservations.some(r =>
            r.tableId === tableId &&
            r.date === date &&
            r.time === time
        );

        if (conflict) {
            alert("❌ Bu masa bu tarih ve saatte zaten rezerve!");
            return;
        }

        const newReservation = {
            id: Date.now(),
            ...form,
            tableName: selectedTable?.name
        };

        const updated = [...reservations, newReservation];
        setReservations(updated);
        localStorage.setItem("reservations", JSON.stringify(updated));

        setForm({
            name: "",
            tableId: "",
            guests: "",
            date: "",
            time: ""
        });
    };

    const deleteRes = (id) => {
        const updated = reservations.filter(r => r.id !== id);
        setReservations(updated);
        localStorage.setItem("reservations", JSON.stringify(updated));
    };

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.backBtn}>
                ⬅ Anasayfa
            </button>

            <h1 style={styles.title}>📅 Rezervasyon Sistemi</h1>

            <div style={styles.formCard}>
                <h3>Yeni Rezervasyon</h3>

                <div style={styles.inputGrid}>
                    <input
                        placeholder="Müşteri Adı"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        style={styles.input}
                    />

                    <input
                        type="number"
                        placeholder="Kişi Sayısı"
                        value={form.guests}
                        onChange={e => setForm({ ...form, guests: e.target.value })}
                        style={styles.input}
                    />

                    <select
                        value={form.tableId}
                        onChange={e => setForm({ ...form, tableId: e.target.value })}
                        style={styles.input}
                    >
                        <option value="">Masa Seçin</option>
                        {tables.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} {t.dolu ? "(Dolu)" : ""}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        style={styles.input}
                    />

                    <input
                        type="time"
                        value={form.time}
                        onChange={e => setForm({ ...form, time: e.target.value })}
                        style={styles.input}
                    />

                    <button onClick={handleAdd} style={styles.addBtn}>
                        ➕ Rezervasyon Ekle
                    </button>
                </div>
            </div>

            <div style={styles.list}>
                <h3>Aktif Rezervasyonlar</h3>

                {reservations.length === 0 ? (
                    <p>Kayıt yok.</p>
                ) : (
                    reservations.map(res => (
                        <div key={res.id} style={styles.resCard}>
                            <div>
                                <strong>{res.name}</strong> ({res.guests} Kişi)
                                <br />
                                <small>
                                    {res.tableName} | {res.date} – {res.time}
                                </small>
                            </div>

                            <button
                                onClick={() => deleteRes(res.id)}
                                style={styles.delBtn}
                            >
                                ❌ İptal
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial"
    },
    backBtn: {
        padding: "8px 16px",
        marginBottom: "20px",
        cursor: "pointer",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#1e3a8a",
        color: "#fff"
    },
    title: {
        color: "#1e3a8a",
        textAlign: "center"
    },
    formCard: {
        backgroundColor: "#f1f5f9",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px"
    },
    inputGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px"
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1"
    },
    addBtn: {
        gridColumn: "span 2",
        padding: "12px",
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    list: {
        marginTop: "20px"
    },
    resCard: {
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        marginBottom: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    },
    delBtn: {
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer"
    }
};
