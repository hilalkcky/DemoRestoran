import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("Ana Yemekler");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(""); // 🔥 base64 image

    const categories = ["Menüler", "Çorbalar", "Mezeler", "Ana Yemekler", "İçecekler", "Tatlılar"];

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(saved);
    }, []);

    // 📸 RESİM SEÇME (Base64)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Boyut kontrolü (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Resim boyutu 2MB'dan büyük olamaz!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAdd = () => {
        if (!name || !price || !image) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        const newProduct = {
            id: Date.now(),
            category,
            name,
            price: parseFloat(price),
            image, // ✅ base64
        };

        const updated = [...products, newProduct];
        setProducts(updated);
        localStorage.setItem("products", JSON.stringify(updated));

        // form temizle
        setName("");
        setPrice("");
        setImage("");
    };

    const deleteProduct = (id) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem("products", JSON.stringify(updated));
    };

    return (
        <div style={{ padding: "30px", fontFamily: "Segoe UI", maxWidth: "900px", margin: "0 auto" }}>
            <button onClick={() => navigate("/")} style={styles.backBtn}>⬅ Anasayfa</button>

            <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>📦 Ürün Yönetimi</h1>

            <div style={styles.card}>
                <h3>Yeni Ürün Ekle</h3>

                <label>Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    placeholder="Ürün Adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Fiyat (₺)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.input}
                />

                {/* 🔍 ÖNİZLEME */}
                {image && (
                    <img
                        src={image}
                        alt="Önizleme"
                        style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }}
                    />
                )}

                <button onClick={handleAdd} style={styles.addBtn}>Ürünü Kaydet</button>
            </div>

            <div style={styles.listSection}>
                <h3>Mevcut Ürünler</h3>

                <div style={styles.grid}>
                    {products.map(p => (
                        <div key={p.id} style={styles.productCard}>
                            <img src={p.image} alt={p.name} style={styles.productImg} />
                            <div style={styles.productInfo}>
                                <small>{p.category}</small>
                                <h4>{p.name}</h4>
                                <strong>₺{p.price}</strong>
                            </div>
                            <button onClick={() => deleteProduct(p.id)} style={styles.deleteBtn}>
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    backBtn: {
        marginBottom: "20px",
        cursor: "pointer",
        padding: "8px 15px",
        borderRadius: "8px",
        backgroundColor: "#1e3a8a",
        color: "#fff",
        border: "none"
    },
    card: {
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "16px"
    },
    addBtn: {
        padding: "14px",
        backgroundColor: "#1e3a8a",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    listSection: { marginTop: "20px" },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px"
    },
    productCard: {
        border: "1px solid #eee",
        borderRadius: "12px",
        overflow: "hidden",
        textAlign: "center",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    },
    productImg: {
        width: "100%",
        height: "120px",
        objectFit: "cover"
    },
    productInfo: { padding: "10px" },
    deleteBtn: {
        width: "100%",
        padding: "8px",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        cursor: "pointer"
    }
};

export default Products;
