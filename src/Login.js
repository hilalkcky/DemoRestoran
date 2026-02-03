import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // 🔹 İlk açılışta admin yoksa oluştur
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users"));

        if (!users || users.length === 0) {
            const defaultAdmin = [
                { username: "admin", password: "1234", role: "admin" },
                { username: "user", password: "123456", role: "user" },
            

            ];
            localStorage.setItem("users", JSON.stringify(defaultAdmin));
        }
    }, []);

    const handleLogin = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const foundUser = users.find(
            u => u.username === username && u.password === password
        );

        if (!foundUser) {
            setError("Kullanıcı adı veya şifre yanlış");
            return;
        }

        // ✅ Auth bilgileri
        localStorage.setItem("isAuth", "true");
        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                username: foundUser.username,
                role: foundUser.role || "user",
            })
        );

        navigate("/");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>🔐 Giriş Yap</h2>

                <input
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

                <button style={styles.button} onClick={handleLogin}>
                    Giriş Yap
                </button>

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
    },
    card: {
        background: "#fff",
        padding: "32px",
        borderRadius: "16px",
        width: "360px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    button: {
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
