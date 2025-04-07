import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { tokenMidia } from "../utils/tokenMidia";


function Mural({ token }) {
    const [data, setData] = useState("");
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [autor, setAutor] = useState("");
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // ✅ Estado do modal

    // ✅ Buscar murais (GET /mural)
    const fetchMurais = async () => {
        try {
            const response = await fetch(`${api}/mural`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await response.json();
            if (data.murais.length > 0) {
                const mural = data.murais[0];

                setData(mural.dataCriacao);
                setTitulo(mural.titulo);
                setConteudo(mural.conteudo);
                setAutor(mural.autor || "Equipe Stimular");

                if (mural.midia?.url && mural.midia?.tipoDeMidia) {
                    setFileType(mural.midia.tipoDeMidia);
                    setFilePreview(`${mural.midia.url}${tokenMidia}`);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar murais:", error);
        }
    };

    useEffect(() => {
        fetchMurais();
    }, []);

    // ✅ Enviar mural (POST /mural)
    const uploadMural = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("conteudo", conteudo);
        formData.append("autor", autor ? autor : "Equipe Stimular");
        formData.append("file", file);

        try {
            const response = await fetch(`${api}/mural`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
            await response.json();
            fetchMurais();
            setModalVisible(true); // ✅ Exibir modal após envio
        } catch (error) {
            console.error("Erro ao enviar mural:", error);
        }
    };

    return (
        <div style={{ display: "flex", gap: "20px", fontFamily: "Arial, sans-serif", padding: "0 5%", marginTop: "5%" }}>
            {/* ✅ MODAL DE CONFIRMAÇÃO */}
            {modalVisible && (
                <div style={{
                    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff", padding: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    borderRadius: "10px", textAlign: "center"
                }}>
                    <h3 style={{ color: "#333" }}>✅ Mural atualizado com sucesso!</h3>
                    <button onClick={() => {
                                            setModalVisible(false);
                                            window.location.reload();
                                        }} style={{
                        marginTop: "15px", padding: "8px 15px", backgroundColor: "#007bff", color: "white",
                        border: "none", borderRadius: "5px", cursor: "pointer"
                    }}>OK</button>
                </div>
            )}

            {/* FORMULÁRIO - 65% da largura */}
            <div style={{ flex: "65%" }}>
                <h1 style={{ fontWeight: "bold" }}>Editar mural</h1>
                <form onSubmit={uploadMural}>
                    <label htmlFor="titulo">Título:</label>
                    <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                        required style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
                    <br /><br />

                    <label htmlFor="autor">Autor:</label>
                    <input type="text" id="autor" value={autor} onChange={(e) => setAutor(e.target.value)}
                        placeholder="Equipe Stimular (padrão)" style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
                    <br /><br />

                    <label htmlFor="file">Escolha uma mídia:</label>
                    <input type="file" id="file" onChange={(event) => setFile(event.target.files[0])} />
                    <br /><br />

                    <label htmlFor="conteudo">Conteúdo:</label>
                    <textarea id="conteudo" value={conteudo} onChange={(e) => setConteudo(e.target.value)}
                        required style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "350px" }} />
                    <br /><br />

                    <button type="submit" style={{
                        padding: "10px", borderRadius: "8px", backgroundColor: "#007bff",
                        color: "white", border: "none", fontSize: "16px", cursor: "pointer", marginBottom: "20px", alignContent: "center"
                    }}>
                        Atualizar Mural
                    </button>
                </form>
            </div>

            {/* ✅ PREVIEW - 35% da largura (Mantido) */}
            <div style={{
                flex: "35%", background: "#F9EFF7", borderRadius: "20px", padding: "20px", textAlign: "center", borderWidth: "20px", borderColor: "#0000",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#000", marginBottom: "30px" }}>{titulo}</h2>

                {/* ✅ Retângulo de mídia (Mantido) */}
                <div style={{
                    width: "100%", height: "200px", borderRadius: "18px", backgroundColor: "#D9D9D9",
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
                }}>
                    {filePreview && fileType?.startsWith("image") && <img src={filePreview} alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "18px", borderWidth: "3px", borderColor: "#D9D9D9" }} />}
                    {filePreview && fileType?.startsWith("video") && <video src={filePreview} controls
                        style={{ width: "100%", height: "auto", borderRadius: "18px", borderWidth: "3px", borderColor: "#D9D9D9" }} />}
                </div>

                <p style={{ fontSize: "12px", color: "#555", marginTop: "10px" }}>Postado por: {autor} | {data}</p>
                <p style={{ fontSize: "14px", color: "#000", marginTop: "25px", textAlign: "start" }}>{conteudo}</p>
            </div>
        </div>
    );
}

export default Mural;
