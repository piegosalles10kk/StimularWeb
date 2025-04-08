import Grafico from "../componentes/grafico";
import Box from "../componentes/box";
import { tokenMidia } from "../utils/tokenMidia";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

function Home({ token }) {
    const [dadosApp, setDadosApp] = useState([]);

    // Enviar logo
    const [selectedFile, setSelectedFile] = useState(null); // Armazenar a imagem selecionada
    const [previewUrl, setPreviewUrl] = useState(null); // Armazenar a URL do preview

    // Textos dinâmicos
    const [usuariosCadastrados, setUsuariosCadastrados] = useState(0);
    const [usuariosPagantes, setUsuariosPagantes] = useState(0);
    const [receitaEstimada, setReceitaEstimada] = useState(0);

    // Gráficos
    const [dadosGraficoPacienteCadastrados, setDadosGraficoPacienteCadastrados] = useState([]);
    const [dadosGraficoPacientePagantes, setDadosGraficoPacientePagantes] = useState([]);
    const [dadosGraficoReceitaEstimada, setDadosGraficoReceitaEstimada] = useState([]);

    // Dados das atualizações
    const [dadosAtualizacoes, setDadosAtualizacoes] = useState([]);
    const [tarefasAtualizacoes, setTarefasAtualizacoes] = useState([]); // ✅ Agora sempre começa como array

    // Função pra formatar a data
    const formatDate = (data) => {
        const date = new Date(data);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    useEffect(() => {
        const fetchAtualizacoes = async () => {
            try {
                const response = await fetch(`${api}/atualizacoes`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await response.json();
                const totalDeAtualizacoes = data.length - 1;
                setDadosAtualizacoes(data[totalDeAtualizacoes]);
                setTarefasAtualizacoes(data[totalDeAtualizacoes].tarefas);
            } catch (error) {
                console.error("Erro ao buscar dados do aplicativo:", error);
            }
        };

        const fetchDados = async () => {
            try {
                const response = await fetch(`${api}/dadosApp`, { headers: { Authorization: `Bearer ${token}` } });
                const data = await response.json();
                setDadosApp(data.dadosApp);
                const totalDeDados = data.dadosApp.length - 1;
            

                // Atualiza os valores dinâmicos com o último item
                if (totalDeDados >= 0) {
                    setUsuariosCadastrados(data.dadosApp[totalDeDados].usuariosCadastrados);
                    setUsuariosPagantes(data.dadosApp[totalDeDados].usuariosPagantes);
                    setReceitaEstimada(data.dadosApp[totalDeDados].receitaEstimada);
                }

                // Criar arrays auxiliares antes de atualizar o estado
                const novosDadosGraficoPacienteCadastrados = [];
                const novosDadosGraficoPacientePagantes = [];
                const novosDadosGraficoReceitaEstimada = [];

                for (let i = 0; i <= totalDeDados; i++) {
                    const dataCriacaoBanco = data.dadosApp[i].dataCriacao;
                    const dataFormatada = formatDate(dataCriacaoBanco);

                    novosDadosGraficoPacienteCadastrados.push({ date: dataFormatada, valor: data.dadosApp[i].usuariosCadastrados });
                    novosDadosGraficoPacientePagantes.push({ date: dataFormatada, valor: data.dadosApp[i].usuariosPagantes });
                    novosDadosGraficoReceitaEstimada.push({ date: dataFormatada, valor: data.dadosApp[i].receitaEstimada });
                }

                // Atualiza os estados uma única vez
                setDadosGraficoPacienteCadastrados(novosDadosGraficoPacienteCadastrados);
                setDadosGraficoPacientePagantes(novosDadosGraficoPacientePagantes);
                setDadosGraficoReceitaEstimada(novosDadosGraficoReceitaEstimada);

            } catch (error) {
                console.error("Erro ao buscar dados do aplicativo:", error);
            }
        };

        fetchDados();
        fetchAtualizacoes();
    }, [token]);

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Pegue o primeiro arquivo selecionado
        if (file) {
            const supportedTypes = ['image/jpeg', 'image/png']; // Tipos suportados
            if (!supportedTypes.includes(file.type)) {
                console.error('Tipo de arquivo não suportado:', file.type);
                return;
            }
            setSelectedFile(file); // Atualiza a imagem selecionada
            setPreviewUrl(URL.createObjectURL(file)); // Gera uma URL para o preview
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile); // Adiciona o arquivo ao FormData

        try {
            const response = await fetch(`${api}/midia/post/logo.png`, { // Altere o ID para o que você precisa
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Logo alterada com sucesso:', data.url);

                // Recarregando a página para mostrar a nova logo e evitar problemas de cache
                window.location.reload(); // Isso fará com que a página recarregue
            } else {
                console.error('Erro ao enviar o arquivo:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar o arquivo:', error);
        }
    };

    return (
        <div style={{ marginTop: "5%" }}>
            {/* Seção dos gráficos */}
            <div style={{ display: "flex", gap: "5%", justifyContent: "center" }}>
                {[
                    { titulo: "Pacientes cadastrados", valor: usuariosCadastrados, dados: dadosGraficoPacienteCadastrados, descricao: "Valor total de contas de pacientes cadastradas no aplicativo." },
                    { titulo: "Usuários pagantes", valor: usuariosPagantes, dados: dadosGraficoPacientePagantes, descricao: "Quantidade estimável com base em usuários com acesso ao aplicativo." },
                    { titulo: "Receita estimada", valor: `R$${receitaEstimada}`, dados: dadosGraficoReceitaEstimada, descricao: "Valor estimável com base em usuários com acesso ao aplicativo." },
                ].map((item, index) => (
                    <div key={index} style={{ width: "33%", textAlign: "center" }}>
                        <Box titulo={item.titulo} subtitulo={item.valor} />
                        <Grafico data={item.dados} />
                        <p style={{ marginLeft: "10%" }}>{item.descricao}</p>
                    </div>
                ))}
            </div>

            {/* Seção inferior logo e notas de atualização */}
            <div style={{ display: "flex", marginTop: "40px" }}>
                <div>
                    <h1 style={{ textAlign: "center" }}>Logo atual</h1>
                    <img
                        src={`https://stimularmidias.blob.core.windows.net/midias/logo.png${tokenMidia}`} 
                        alt="Logo" 
                        style={{ width: "500px", height: "500px", marginTop: "10px" }} 
                    />
                    <h3 style={{ marginTop: "5%", textAlign: "center" }}>Alterar logo</h3>
                    <input type="file" style ={{ marginLeft: "12%", marginTop: "5%" }} accept="image/*" onChange={handleFileChange} />

                    {previewUrl && (
                        <div style={{ marginTop: "20px" }}>
                            <h2 style={{ textAlign: "center" }}>Pré-visualização da nova logo</h2>
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                style={{ width: "500px", height: "500px" }} 
                            />
                            <div>
                                <a style={{ marginLeft: "20%", marginTop: "5%" }}>Pode levar de 5min-10min pra ser atualizada.</a>
                                <button onClick={handleUploadFile}  type="submit" style={{
                        padding: "10px", borderRadius: "8px", backgroundColor: "#007bff",
                        color: "white", border: "none", fontSize: "16px", cursor: "pointer", marginBottom: "20px", marginLeft: "5%", marginTop: "10%", width: '100%'
                    }}>Alterar logo</button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ borderWidth: "0px", borderColor: "#007bff", borderStyle: "solid", borderRadius: "10%", padding: "5%", marginLeft: "5%", alignItems: "center", marginBottom: "10%" }}>
                <a 
    href={`${window.location.origin}/StimularUpdates/atualiza.html`} 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ float: "right", backgroundColor: "transparent", border: "none", cursor: "pointer", textDecoration: "none" }}
>
    ✅
</a>


                    <h3 style={{ textAlign: "center", marginBottom: "5%", fontWeight: "bold" }}>{dadosAtualizacoes.tituloAtualizacao}</h3>
                    <p style={{ fontWeight: "bold" }}>{dadosAtualizacoes.descricaoAtualizacao}</p>

                    {Array.isArray(tarefasAtualizacoes) && tarefasAtualizacoes.map((tarefa, index) => (
                        <div key={index} style={{ alignItems: "center", gap: "10px" }}>
                            <p>{tarefa.finalizada ? "✅" : ""} ● ({tarefa.tipoDeTarefa}) {tarefa.tituliDaTarefa}: <br /></p>
                            <p style={{ textDecoration: tarefa.finalizada ? "line-through" : "none", marginTop: "-2%" }}>
                                {tarefa.descricaoTarefa}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
