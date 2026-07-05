// ========== SEÇÃO DE TREINO ==========
const listaMuscuosTreino = document.querySelector('.lista-musculos-treino');
const listaExerciciosTreino = document.querySelector('.lista-exercicios-treino');
const listaResumoTreino = document.querySelector('.lista-treino');
const btnSalvarTreino = document.querySelector('.btn-salvar-treino');
const inputNomeTreino = document.getElementById('input-nome-treino');
const listaHistoricoTreinos = document.querySelector('.lista-historico-treinos');

let treinoSelecionado = {};

const renderizarMuscuosTreino = () => {
    listaMuscuosTreino.innerHTML = '';

    musculos.forEach((musculo, index) => {
        const li = document.createElement('li');
        
        const div = document.createElement('div');
        div.className = 'checkbox-musculo';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `musculo-treino-${index}`;
        checkbox.dataset.indice = index;
        checkbox.checked = treinoSelecionado[index] !== undefined;
        
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                treinoSelecionado[index] = {};
                musculos[index].exercicios.forEach((exercicio) => {
                    treinoSelecionado[index][exercicio] = false;
                });
            } else {
                delete treinoSelecionado[index];
            }
            renderizarExerciciosTreino();
            atualizarResumoTreino();
        });
        
        const label = document.createElement('label');
        label.htmlFor = `musculo-treino-${index}`;
        label.textContent = musculo.nome;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        li.appendChild(div);
        listaMuscuosTreino.appendChild(li);
    });
};

const renderizarExerciciosTreino = () => {
    listaExerciciosTreino.innerHTML = '';

    Object.keys(treinoSelecionado).forEach((indiceSelecionado) => {
        const index = parseInt(indiceSelecionado);
        const musculo = musculos[index];
        
        const divMusculo = document.createElement('div');
        divMusculo.className = 'exercicio-item';
        
        const h4 = document.createElement('h4');
        h4.textContent = musculo.nome;
        divMusculo.appendChild(h4);
        
        musculo.exercicios.forEach((exercicio) => {
            const div = document.createElement('div');
            div.className = 'checkbox-exercicio';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `exercicio-${index}-${exercicio}`;
            checkbox.checked = treinoSelecionado[index][exercicio] || false;
            
            checkbox.addEventListener('change', () => {
                treinoSelecionado[index][exercicio] = checkbox.checked;
                atualizarResumoTreino();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `exercicio-${index}-${exercicio}`;
            label.textContent = exercicio;
            
            div.appendChild(checkbox);
            div.appendChild(label);
            divMusculo.appendChild(div);
        });
        
        listaExerciciosTreino.appendChild(divMusculo);
    });
};

const atualizarResumoTreino = () => {
    listaResumoTreino.innerHTML = '';
    
    let temExercicios = false;

    Object.keys(treinoSelecionado).forEach((indiceSelecionado) => {
        const index = parseInt(indiceSelecionado);
        const musculo = musculos[index];
        
        const exerciciosSelecionados = Object.keys(treinoSelecionado[index]).filter(
            (exercicio) => treinoSelecionado[index][exercicio]
        );
        
        if (exerciciosSelecionados.length > 0) {
            temExercicios = true;
            const li = document.createElement('li');
            li.textContent = `${musculo.nome}: ${exerciciosSelecionados.join(', ')}`;
            listaResumoTreino.appendChild(li);
        }
    });
    
    if (!temExercicios) {
        const li = document.createElement('li');
        li.textContent = 'Nenhum exercício selecionado';
        listaResumoTreino.appendChild(li);
    }
};

btnSalvarTreino.addEventListener('click', () => {
    // Limpar mensagem anterior
    const mensagemAnterior = document.querySelector('.mensagem-treino');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    // Criar elemento para mensagem
    const criarMensagem = (texto, tipo) => {
        const div = document.createElement('div');
        div.className = `mensagem-treino mensagem-${tipo}`;
        div.textContent = texto;
        btnSalvarTreino.parentElement.insertBefore(div, btnSalvarTreino);
        setTimeout(() => {
            div.remove();
        }, 4000);
    };

    let temExercicios = false;

    Object.keys(treinoSelecionado).forEach((index) => {
        const temSelecionado = Object.values(treinoSelecionado[index]).some((selecionado) => selecionado);
        if (temSelecionado) {
            temExercicios = true;
        }
    });

    if (!temExercicios) {
        criarMensagem('⚠️ Selecione pelo menos um exercício', 'erro');
        return;
    }

    const nomeTreino = inputNomeTreino.value.trim();
    if (!nomeTreino) {
        criarMensagem('⚠️ Digite um nome para o treino', 'erro');
        inputNomeTreino.focus();
        return;
    }

    // Desabilitar botão
    btnSalvarTreino.disabled = true;
    const textoOriginal = btnSalvarTreino.textContent;
    btnSalvarTreino.textContent = '⏳ Salvando...';

    // Simular delay para melhor feedback
    setTimeout(() => {
        const treino = {};
        Object.keys(treinoSelecionado).forEach((index) => {
            const musculo = musculos[index];
            const exerciciosSelecionados = Object.keys(treinoSelecionado[index]).filter(
                (exercicio) => treinoSelecionado[index][exercicio]
            );
            
            if (exerciciosSelecionados.length > 0) {
                treino[musculo.nome] = exerciciosSelecionados;
            }
        });

        const treinosArmazenados = JSON.parse(localStorage.getItem('treinos')) || [];
        treinosArmazenados.push({
            id: Date.now(),
            nome: nomeTreino,
            data: new Date().toLocaleDateString('pt-BR'),
            exercicios: treino
        });

        localStorage.setItem('treinos', JSON.stringify(treinosArmazenados));
        
        // Reabilitar botão
        btnSalvarTreino.disabled = false;
        btnSalvarTreino.textContent = textoOriginal;
        
        criarMensagem('✅ Treino salvo com sucesso!', 'sucesso');
        
        // Limpar seleção
        treinoSelecionado = {};
        inputNomeTreino.value = '';
        renderizarMuscuosTreino();
        renderizarExerciciosTreino();
        atualizarResumoTreino();
        renderizarHistoricoTreinos();
    }, 800);
});

const renderizarHistoricoTreinos = () => {
    const treinosArmazenados = JSON.parse(localStorage.getItem('treinos')) || [];
    listaHistoricoTreinos.innerHTML = '';

    if (treinosArmazenados.length === 0) {
        const div = document.createElement('div');
        div.className = 'empty-state';
        const p = document.createElement('p');
        p.textContent = 'Nenhum treino salvo ainda';
        div.appendChild(p);
        listaHistoricoTreinos.appendChild(div);
        return;
    }

    treinosArmazenados.forEach((treino) => {
        const li = document.createElement('li');
        li.className = 'treino-item';

        const divInfo = document.createElement('div');
        divInfo.className = 'treino-info';

        const divNome = document.createElement('div');
        divNome.className = 'treino-nome';
        divNome.textContent = treino.nome;

        const divData = document.createElement('div');
        divData.className = 'treino-data';
        divData.textContent = `Data: ${treino.data}`;

        divInfo.appendChild(divNome);
        divInfo.appendChild(divData);

        const divAcoes = document.createElement('div');
        divAcoes.className = 'treino-acoes';

        const btnVisualizar = document.createElement('button');
        btnVisualizar.className = 'btn-visualizar-treino';
        btnVisualizar.textContent = '▼ Expandir';
        btnVisualizar.type = 'button';

        const divConteudo = document.createElement('div');
        divConteudo.className = 'treino-conteudo';

        const ulExercicios = document.createElement('ul');
        ulExercicios.className = 'lista-treino-detalhes';

        Object.entries(treino.exercicios).forEach(([musculo, exercicios]) => {
            const liMusculo = document.createElement('li');
            liMusculo.className = 'musculo-treino-item';

            const nomeMusculo = document.createElement('strong');
            nomeMusculo.textContent = musculo;
            liMusculo.appendChild(nomeMusculo);

            const ulExerciciosMusculo = document.createElement('ul');
            ulExerciciosMusculo.className = 'exercicios-musculo-item';

            exercicios.forEach((exercicio) => {
                const liExercicio = document.createElement('li');
                liExercicio.textContent = exercicio;
                ulExerciciosMusculo.appendChild(liExercicio);
            });

            liMusculo.appendChild(ulExerciciosMusculo);
            ulExercicios.appendChild(liMusculo);
        });

        divConteudo.appendChild(ulExercicios);

        btnVisualizar.addEventListener('click', () => {
            const estaVisivel = divConteudo.classList.contains('visivel');
            if (estaVisivel) {
                divConteudo.classList.remove('visivel');
                btnVisualizar.textContent = '▼ Expandir';
            } else {
                divConteudo.classList.add('visivel');
                btnVisualizar.textContent = '▲ Retrair';
            }
        });

        const btnDeletar = document.createElement('button');
        btnDeletar.className = 'btn-deletar-treino';
        btnDeletar.textContent = 'Deletar';
        btnDeletar.type = 'button';
        btnDeletar.addEventListener('click', () => {
            const index = treinosArmazenados.findIndex(t => t.id === treino.id);
            if (index > -1) {
                treinosArmazenados.splice(index, 1);
                localStorage.setItem('treinos', JSON.stringify(treinosArmazenados));
                renderizarHistoricoTreinos();
            }
        });

        divAcoes.appendChild(btnVisualizar);
        divAcoes.appendChild(btnDeletar);

        li.appendChild(divInfo);
        li.appendChild(divAcoes);
        li.appendChild(divConteudo);
        listaHistoricoTreinos.appendChild(li);
    });
};

renderizarMuscuosTreino();
renderizarExerciciosTreino();
atualizarResumoTreino();
renderizarHistoricoTreinos();