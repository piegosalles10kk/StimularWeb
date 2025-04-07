function Box({ titulo, subtitulo }) {
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1 style={{ fontSize: "24px", color: "#000000", fontWeight: "bold", marginLeft: "15%" }}>{titulo}</h1>
            <h2 style={{ fontSize: "18px", color: "#007bff", fontWeight: "bold", textDecoration: "underline", marginLeft: "15%"  }}>{subtitulo}</h2>
        </div>
    );
}

export default Box;
