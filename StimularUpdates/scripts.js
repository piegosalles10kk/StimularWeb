const apiUrl = "http://localhost:3001";


let currentEditId = '';

// Inicializa o aplicativo
document.addEventListener('DOMContentLoaded', () => {
    fetchAtualizacoes();
    setupEventListeners();
});

// Configuração dos eventos
function setupEventListeners() {
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('atualizacaoForm').addEventListener('submit', addAtualizacao);
    document.querySelector('.close').addEventListener('click', closeEditModal);
    document.getElementById('editAddTaskBtn').addEventListener('click', addEditTask);
    document.getElementById('confirmDelete').addEventListener('click', deleteAtualizacao);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
}

// Adiciona uma nova tarefa no formulário principal
function addTask() {
    const tarefasContainer = document.getElementById('tarefasContainer');
    tarefasContainer.appendChild(createTaskElement());
}

// Criação do elemento de tarefa
function createTaskElement(title = '', description = '', tipoDeTarefa = '', finalizada = false) {
    const div = document.createElement('div');
    div.classList.add('tarefa');

    if (finalizada) {
        div.classList.add('finalizada');
        div.style.border = "2px solid #28a745"; // Marca como finalizada
    }

    div.innerHTML = `
        <input type="text" class="tituliDaTarefa" placeholder="Título da Tarefa" value="${title}" required>
        <select class="tipoDeTarefa" required>
            <option value="" disabled ${tipoDeTarefa === '' ? 'selected' : ''}></option>
            <option value="Documentação" ${tipoDeTarefa === 'Documentação' ? 'selected' : ''}>Documentação</option>
            <option value="Design" ${tipoDeTarefa === 'Design' ? 'selected' : ''}>Design</option>
            <option value="Front-end" ${tipoDeTarefa === 'Front-end' ? 'selected' : ''}>Front-end</option>
            <option value="Back-end" ${tipoDeTarefa === 'Back-end' ? 'selected' : ''}>Back-end</option>
            <option value="Data" ${tipoDeTarefa === 'Data' ? 'selected' : ''}>Data</option>
            <option value="DevOps" ${tipoDeTarefa === 'DevOps' ? 'selected' : ''}>DevOps</option>
            <option value="Arquitetura" ${tipoDeTarefa === 'Arquitetura' ? 'selected' : ''}>Arquitetura</option>
            <option value="PlayStore/AppStore" ${tipoDeTarefa === 'PlayStore/AppStore' ? 'selected' : ''}>PlayStore/AppStore</option>
        </select>
        <textarea class="descricaoTarefa" placeholder="Descrição da Tarefa" required>${description}</textarea>
        <button type="button" class="removeTarefaBtn" style="background-color: #dc3545; float: right;">Remover</button>
        <button type="button" class="toggleTarefaBtn">${finalizada ? 'Reabrir Tarefa' : 'Finalizar Tarefa'}</button>
        <div class="dataFinalizacao"></div>
    `;

    div.querySelector('.removeTarefaBtn').addEventListener('click', () => {
        div.remove();
    });

    // Evento para finalizar/reabrir a tarefa
    div.querySelector('.toggleTarefaBtn').addEventListener('click', () => {
        toggleTarefa(div);
    });

    return div;
}

// Finaliza ou reabre a tarefa
function toggleTarefa(tarefaElement) {
    const isFinalizada = tarefaElement.classList.toggle('finalizada'); // Muda a classe para indicar estado
    const button = tarefaElement.querySelector('.toggleTarefaBtn');

    // Atualiza o botão e a tarefa com o estado correto
    if (isFinalizada) {
        button.textContent = 'Reabrir Tarefa';
        tarefaElement.style.border = "2px solid #dc3545"; // Verde
        tarefaElement.dataset.finalizada = true; // Atualiza o estado
        tarefaElement.querySelector('.dataFinalizacao').textContent = new Date().toLocaleDateString(); // Exibe a data de finalização
    } else {
        button.textContent = 'Finalizar Tarefa';
        tarefaElement.style.border = ""; // Remove o estilo de finalização
        tarefaElement.dataset.finalizada = false; // Atualiza o estado
        tarefaElement.querySelector('.dataFinalizacao').textContent = ''; // Remove a data de finalização
    }
}

// Adiciona uma nova atualização
function addAtualizacao(event) {
    event.preventDefault();
    const titulo = document.getElementById('tituloAtualizacao').value;
    const descricao = document.getElementById('descricaoAtualizacao').value;
    const tarefas = getTarefas();

    fetch(`${apiUrl}/atualizacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tituloAtualizacao: titulo, descricaoAtualizacao: descricao, tarefas })
    })
    .then(response => response.json())
    .then(() => {
        fetchAtualizacoes();
        document.getElementById('atualizacaoForm').reset();
    });
}

// Pega as tarefas do formulário
function getTarefas() {
    return Array.from(document.querySelectorAll('.tarefa')).map(tarefa => ({
        tituliDaTarefa: tarefa.querySelector('.tituliDaTarefa').value,
        descricaoTarefa: tarefa.querySelector('.descricaoTarefa').value,
        tipoDeTarefa: tarefa.querySelector('.tipoDeTarefa').value,
        finalizada: tarefa.classList.contains('finalizada') // Captura o estado de finalização
    }));
}

// Busca atualizações da API
function fetchAtualizacoes() {
    fetch(`${apiUrl}/atualizacoes`)
        .then(response => response.json())
        .then(data => {
            const atualizacoesList = document.getElementById('atualizacoesList');
            atualizacoesList.innerHTML = '';

            data.forEach(atualizacao => {
                const div = document.createElement('div');
                div.classList.add('atualizacao');
                div.classList.toggle('finalizada', atualizacao.finalizada); // Marca a atualização se estiver finalizada
                div.style.border = "2px solid #ccc"; // Adiciona a borda
                div.style.borderRadius = "var(--border-radius)";
                div.style.margin = "10px 0"; // Adiciona margem para melhor espaçamento

                // Adiciona título e descrição da atualização
                div.innerHTML = `
                    <h3 class="${atualizacao.finalizada ? 'tachado' : ''}">${atualizacao.tituloAtualizacao}</h3>
                    <span class="${atualizacao.finalizada ? 'tachado' : ''}">${atualizacao.dataFinalizacao ? `<span class="dataFinalizacao">${atualizacao.dataFinalizacao}</span>` : ''}</span>
                    <p class="${atualizacao.finalizada ? 'tachado' : ''}">${atualizacao.descricaoAtualizacao}</p>
                    <ul class="tarefasList">
                        ${atualizacao.tarefas.map(task => `
                            <li class="tarefa ${task.finalizada ? 'finalizada' : ''}">
                                <span class="tipoDeTarefa"> (${task.tipoDeTarefa})</span>
                                <span>${task.tituliDaTarefa}: <br> <br> ${task.descricaoTarefa}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="editBtn" style="background-color: #007bff;">Editar</button>
                    <button class="deleteBtn" style="background-color: #dc3545; float: right">Deletar</button>
                    <div class="button-container">
                        <button class="toggleAtualizacaoBtn" style="margin-top: 5%; background-color: ${atualizacao.finalizada ? '#dc3545' : '#28a745'};">${atualizacao.finalizada ? 'Reabrir Atualização' : 'Finalizar Atualização'}</button>
                    </div>
                `;

                atualizacoesList.appendChild(div);

                // Adiciona eventos de botão aos novos botões
                div.querySelector('.editBtn').addEventListener('click', () => openEditModal(atualizacao));
                div.querySelector('.deleteBtn').addEventListener('click', () => openDeleteModal(atualizacao._id));

                // Para finalizar ou reabrir a atualização
                div.querySelector('.toggleAtualizacaoBtn').addEventListener('click', () => {
                    toggleAtualizacao(atualizacao);
                });
            });
        })
        .catch(error => console.error('Erro ao buscar atualizações:', error));
}

// Abre o modal de edição 
function openEditModal(atualizacao) {
    currentEditId = atualizacao._id;
    document.getElementById('editTituloAtualizacao').value = atualizacao.tituloAtualizacao;
    document.getElementById('editDescricaoAtualizacao').value = atualizacao.descricaoAtualizacao;
    const editTarefasContainer = document.getElementById('editTarefasContainer');
    editTarefasContainer.innerHTML = '';

    atualizacao.tarefas.forEach(tarefa => {
        editTarefasContainer.appendChild(createTaskElement(tarefa.tituliDaTarefa, tarefa.descricaoTarefa, tarefa.tipoDeTarefa, tarefa.finalizada));
    });

    document.getElementById('editModal').style.display = 'block';
}

// Adiciona uma nova tarefa no modal de edição
function addEditTask() {
    const editTarefasContainer = document.getElementById('editTarefasContainer');
    editTarefasContainer.appendChild(createTaskElement());
}

// Salva as alterações feitas na atualização
document.getElementById('saveChanges').onclick = function () {
    const titulo = document.getElementById('editTituloAtualizacao').value;
    const descricao = document.getElementById('editDescricaoAtualizacao').value;
    const tarefas = Array.from(document.querySelectorAll('#editTarefasContainer .tarefa')).map(tarefa => ({
        tituliDaTarefa: tarefa.querySelector('.tituliDaTarefa').value,
        descricaoTarefa: tarefa.querySelector('.descricaoTarefa').value,
        tipoDeTarefa: tarefa.querySelector('.tipoDeTarefa').value,
        finalizada: tarefa.classList.contains('finalizada') // Captura o estado de finalização
    }));

    fetch(`${apiUrl}/atualizacoes/${currentEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tituloAtualizacao: titulo, descricaoAtualizacao: descricao, tarefas })
    })
    .then(response => response.json())
    .then(() => {
        fetchAtualizacoes();
        closeEditModal();
    })
    .catch(error => console.error('Erro ao salvar alterações:', error));
};

// Fecha o modal de edição
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Abre o modal de confirmação de deleção
function openDeleteModal(id) {
    currentEditId = id;
    document.getElementById('confirmDeleteModal').style.display = 'block';
}

// Fecha o modal de deleção
function closeDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
}

// Deleta a atualização
function deleteAtualizacao() {
    fetch(`${apiUrl}/atualizacoes/${currentEditId}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchAtualizacoes();
        closeDeleteModal();
    })
    .catch(error => console.error('Erro ao deletar a atualização:', error));
}

// Função para permitir o fechamento de modais ao clicar fora
window.onclick = function (event) {
    if (event.target === document.getElementById('editModal')) {
        closeEditModal();
    }
    if (event.target === document.getElementById('confirmDeleteModal')) {
        closeDeleteModal();
    }
};

// Finaliza ou reabre a atualização
function toggleAtualizacao(atualizacao) {
    const todasTarefasFinalizadas = atualizacao.tarefas.every(tarefa => tarefa.finalizada);
    if (todasTarefasFinalizadas) {
        const dataFinalizacao = new Date().toLocaleDateString(); // Data de finalização
        fetch(`${apiUrl}/atualizacoes/${atualizacao._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...atualizacao,
                finalizada: !atualizacao.finalizada,
                dataFinalizacao: !atualizacao.finalizada ? dataFinalizacao : null // Adiciona a data se estiver finalizando
            })
        })
        .then(response => response.json())
        .then(() => {
            fetchAtualizacoes(); // Atualiza a lista de atualizações
        })
        .catch(error => console.error('Erro ao atualizar a atualização:', error));
    } else {
        alert('Não é possível finalizar a atualização. Existem tarefas não finalizadas.');
    }
}
