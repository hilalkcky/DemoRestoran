import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const navigate = useNavigate();

    // 🔹 State Tanımlamaları
    const [products, setProducts] = useState([]); // Products.js'den gelecek veriler
    const [selectedCategory, setSelectedCategory] = useState("Ana Yemekler");
    const [tables, setTables] = useState([]);
    const [activeTable, setActiveTable] = useState(null);
    const [cart, setCart] = useState([]);
    const [showPayment, setShowPayment] = useState(false);

    const categories = [
        "Menüler",
        "Çorbalar",
        "Mezeler",
        "Ana Yemekler",
        "İçecekler",
        "Tatlılar",
    ];

    // 🔹 Verileri Yükle
    useEffect(() => {
        // Products.js'den eklediğin ürünleri çekiyoruz
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(storedProducts);

        // Masa bilgilerini çekiyoruz
        const storedTables = JSON.parse(localStorage.getItem("tables")) || [];
        const activeTableId = Number(localStorage.getItem("activeTable"));
        const table = storedTables.find(t => t.id === activeTableId);

        setTables(storedTables);
        setActiveTable(table);
        setCart(table?.orders || []);

        // Eğer ürünler varsa ve kategori boşsa, ilk ürünün kategorisini seçebilirsin
        if (storedProducts.length > 0 && !selectedCategory) {
            setSelectedCategory(storedProducts[0].category);
        }
    }, []);

    // 🔹 Masa ve Sepet Güncelleme
    const updateTable = (updatedCart) => {
        const total = updatedCart.reduce((s, i) => s + i.price * i.quantity, 0);
        const updatedTables = tables.map(t =>
            t.id === activeTable.id
                ? { ...t, orders: updatedCart, total }
                : t
        );

        setCart(updatedCart);
        setTables(updatedTables);
        localStorage.setItem("tables", JSON.stringify(updatedTables));
    };

    const addToCart = (product) => {
        const existing = cart.find(i => i.id === product.id);
        const updatedCart = existing
            ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...cart, { ...product, quantity: 1 }];

        const updatedTables = tables.map(t =>
            t.id === activeTable.id
                ? {
                    ...t,
                    orders: updatedCart,
                    total: updatedCart.reduce((s, i) => s + i.price * i.quantity, 0),
                    dolu: true,
                    startTime: t.startTime || Date.now(),
                }
                : t
        );

        setCart(updatedCart);
        setTables(updatedTables);
        localStorage.setItem("tables", JSON.stringify(updatedTables));
    };

    const increaseQty = (id) => updateTable(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    const decreaseQty = (id) => updateTable(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));

    const pay = (method) => {
        if (!activeTable) return;

        const currentRevenue = Number(localStorage.getItem("dailyRevenue")) || 0;
        localStorage.setItem("dailyRevenue", currentRevenue + (activeTable.total || 0));

        const currentOrderCount = Number(localStorage.getItem("orderCount")) || 0;
        localStorage.setItem("orderCount", currentOrderCount + 1);

        const updatedTables = tables.map((t) =>
            t.id === activeTable.id
                ? { ...t, dolu: false, total: 0, orders: [], startTime: null }
                : t
        );

        localStorage.setItem("tables", JSON.stringify(updatedTables));
        window.dispatchEvent(new Event("tablesUpdated"));
        navigate("/masalar");
    };

    const totalCost = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <div style={styles.page}>
            {/* SOL SÜTUN: ADİSYON */}
            <div style={styles.box}>
                <button style={styles.backButton} onClick={() => navigate("/masalar")}>⬅ Masalar</button>
                <button onClick={() => navigate("/")} style={styles.backBtn}>⬅ Anasayfa</button>
                <h3 style={styles.title}>{activeTable?.name || "Masa Seçilmedi"}</h3>
                
                <div style={styles.cartList}>
                    {cart.map(item => (
                        <div key={item.id} style={styles.cartItem}>
                            <div>
                                <div style={{ fontWeight: "bold" }}>{item.name}</div>
                                <small>₺{item.price} x {item.quantity}</small>
                            </div>
                            <div style={styles.cartRight}>
                                <button style={styles.qtyButton} onClick={() => decreaseQty(item.id)}>−</button>
                                <span style={styles.qty}>{item.quantity}</span>
                                <button style={styles.qtyButton} onClick={() => increaseQty(item.id)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.totalArea}>
                    <strong>Toplam: ₺{totalCost}</strong>
                    <button style={styles.payButton} onClick={() => setShowPayment(!showPayment)} disabled={cart.length === 0}>
                        Ödeme Al
                    </button>
                    {showPayment && (
                        <div style={styles.paymentMethods}>
                            <button onClick={() => pay("Nakit")} style={styles.methodBtn}>💵 Nakit</button>
                            <button onClick={() => pay("Kart")} style={styles.methodBtn}>💳 Kart</button>
                        </div>
                    )}
                </div>
            </div>

            {/* ORTA SÜTUN: ÜRÜNLER */}
            <div style={styles.box}>
                <h3 style={styles.title}>{selectedCategory}</h3>
                <div style={styles.productGrid}>
                    {products.filter(p => p.category === selectedCategory).map(product => (
                        <div key={product.id} style={styles.productCard} onClick={() => addToCart(product)}>
                            {product.image ? (
                                <img src={product.image} alt={product.name} style={styles.productImg} />
                            ) : (
                                <div style={styles.noImg}>🍽️</div>
                            )}
                            <div style={styles.productInfo}>
                                <span style={styles.productName}>{product.name}</span>
                                <span style={styles.productPrice}>₺{product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SAĞ SÜTUN: KATEGORİLER */}
            <div style={styles.box}>
                <h3 style={styles.title}>Kategoriler</h3>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)} 
                        style={{
                            ...styles.categoryButton,
                            backgroundColor: selectedCategory === cat ? "#1e3a8a" : "#ffffff",
                            color: selectedCategory === cat ? "#fff" : "#1e3a8a"
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}

const styles = {
    page: { display: "grid", gridTemplateColumns: "350px 1fr 200px", gap: "15px", padding: "15px", height: "100vh", backgroundColor: "#f1f5f9" },
    box: { backgroundColor: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", overflowY: "auto" },
    title: { borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", marginBottom: "15px", color: "#1e3a8a" },
    cartList: { flex: 1, overflowY: "auto" },
    cartItem: { display: "flex", justifyContent: "space-between", marginBottom: "12px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px" },
    cartRight: { display: "flex", alignItems: "center", gap: "8px" },
    qtyButton: { width: "30px", height: "30px", border: "none", backgroundColor: "#1e3a8a", color: "#fff", borderRadius: "5px", cursor: "pointer" },
    qty: { fontWeight: "bold", minWidth: "20px", textAlign: "center" },
    totalArea: { borderTop: "2px solid #eee", paddingTop: "15px", display: "flex", flexDirection: "column", gap: "10px" },
    payButton: { padding: "15px", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
    paymentMethods: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    methodBtn: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", cursor: "pointer" },
    productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px" },
    productCard: { cursor: "pointer", border: "1px solid #f1f5f9", borderRadius: "12px", overflow: "hidden", transition: "0.2s", textAlign: "center", background: "#fff" },
    productImg: { width: "100%", height: "100px", objectFit: "cover" },
    noImg: { height: "100px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", background: "#f8fafc" },
    productInfo: { padding: "10px", display: "flex", flexDirection: "column" },
    productName: { fontSize: "14px", fontWeight: "500" },
    productPrice: { color: "#1e3a8a", fontWeight: "bold" },
    categoryButton: { padding: "15px", marginBottom: "10px", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", textAlign: "left", fontWeight: "bold", transition: "0.3s" },
    backButton: {padding: "8px 16px", marginBottom: "20px", cursor: "pointer", borderRadius: "8px", border: "none", backgroundColor: "#1e3a8a", color: "#fff" },
    backBtn: { padding: "8px 16px", marginBottom: "20px", cursor: "pointer", borderRadius: "8px", border: "none", backgroundColor: "#1e3a8a", color: "#fff" }

};
