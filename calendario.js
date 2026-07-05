let dataAtual = new Date();
let treinosDia = {};

// Carrega treinos do localStorage
const carregarTreinosDia = () => {
    const dados = localStorage.getItem('treinosDia');
    if (dados) {
        treinosDia = JSON.parse(dados);
    }
};

// Salva treinos no localStorage
const salvarTreinosDia = () => {
    localStorage.setItem('treinosDia', JSON.stringify(treinosDia));
};

// Renderiza o calendário
const renderizarCalendario = () => {
    const mes = dataAtual.getMonth();
    const ano = dataAtual.getFullYear();
    
    // Atualizar título do mês/ano
    const meses =  ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('mes-ano-atual').textContent = `${meses[mes]} ${ano}`;
    
    // Limpar calendário anterior
    const calendarioGrid = document.getElementById('calendario-grid');
    calendarioGrid.innerHTML = '';
    
    // Adicionar headers dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.className = 'dia-semana-header';
        header.textContent = dia;
        calendarioGrid.appendChild(header);
    });
    
    // Obter primeiro dia do mês e quantidade de dias
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasMes = new Date(ano, mes + 1, 0).getDate();
    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    
    // Adicionar dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
        const dia = document.createElement('div');
        dia.className = 'dia-calendario dia-outra-mes';
        dia.innerHTML = `<div class="dia-numero">${diasMesAnterior - i}</div><div class="dia-treinos"></div>`;
        calendarioGrid.appendChild(dia);
    }
    
    // Adicionar dias do mês atual
    for (let dia = 1; dia <= diasMes; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-calendario';
        
        const dataDia = new Date(ano, mes, dia);
        const chave = formatarData(dataDia);
        
        const divNumero = document.createElement('div');
        divNumero.className = 'dia-numero';
        divNumero.textContent = dia;
        
        const divTreinos = document.createElement('div');
        divTreinos.className = 'dia-treinos';
        
        // Adicionar treinos do dia
        if (treinosDia[chave]) {
            treinosDia[chave].forEach(treinoNome => {
                const treino = document.createElement('div');
                treino.className = 'treino-dia';
                treino.textContent = treinoNome;
                divTreinos.appendChild(treino);
            });
        }
        
        diaElement.appendChild(divNumero);
        diaElement.appendChild(divTreinos);
        
        // Adicionar evento de clique
        diaElement.addEventListener('click', () => abrirModalTreino(dataDia));
        
        calendarioGrid.appendChild(diaElement);
    }
    
    // Adicionar dias do próximo mês
    const diasRestantes = 42 - (primeiroDia + diasMes);
    for (let dia = 1; dia <= diasRestantes; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia-calendario dia-outra-mes';
        diaElement.innerHTML = `<div class="dia-numero">${dia}</div><div class="dia-treinos"></div>`;
        calendarioGrid.appendChild(diaElement);
    }
};

// Formatar data para chave (YYYY-MM-DD)
const formatarData = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

// Abrir modal para selecionar treino
const abrirModalTreino = (data) => {
    const treinosArmazenados = JSON.parse(localStorage.getItem('treinos')) || [];
    
    if (treinosArmazenados.length === 0) {
        alert('Nenhum treino montado disponível. Crie um treino primeiro!');
        return;
    }
    
    const chave = formatarData(data);
    const treinosDosDia = treinosDia[chave] || [];
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal-treino';
    
    const conteudo = document.createElement('div');
    conteudo.className = 'modal-conteudo';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.textContent = `Selecione o treino do dia ${data.toLocaleDateString('pt-BR')}`;
    conteudo.appendChild(header);
    
    const listaTreinos = document.createElement('ul');
    listaTreinos.className = 'modal-treinos-lista';
    
    const treinosSelecionados = new Set(treinosDosDia);
    
    treinosArmazenados.forEach(treino => {
        const li = document.createElement('li');
        li.className = 'modal-treino-item';
        if (treinosSelecionados.has(treino.nome)) {
            li.classList.add('ativo');
        }
        li.textContent = treino.nome;
        li.addEventListener('click', () => {
            li.classList.toggle('ativo');
            if (li.classList.contains('ativo')) {
                treinosSelecionados.add(treino.nome);
            } else {
                treinosSelecionados.delete(treino.nome);
            }
        });
        listaTreinos.appendChild(li);
    });
    
    conteudo.appendChild(listaTreinos);
    
    const botoes = document.createElement('div');
    botoes.className = 'modal-botoes';
    
    const btnConfirmar = document.createElement('button');
    btnConfirmar.className = 'modal-btn modal-btn-confirmar';
    btnConfirmar.textContent = 'Confirmar';
    btnConfirmar.addEventListener('click', () => {
        if (treinosSelecionados.size > 0) {
            treinosDia[chave] = Array.from(treinosSelecionados);
        } else {
            delete treinosDia[chave];
        }
        salvarTreinosDia();
        document.body.removeChild(modal);
        renderizarCalendario();
    });
    
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'modal-btn modal-btn-cancelar';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    botoes.appendChild(btnConfirmar);
    botoes.appendChild(btnCancelar);
    conteudo.appendChild(botoes);
    
    modal.appendChild(conteudo);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
};

// Event listeners dos botões de navegação
document.getElementById('btn-mes-anterior').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizarCalendario();
});

document.getElementById('btn-mes-proximo').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizarCalendario();
});

// Inicializar
window.addEventListener('load', () => {
    carregarTreinosDia();
    renderizarCalendario();
});
