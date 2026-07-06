// Menu de navegação entre seções
const botoesMenu = document.querySelectorAll('.btn-menu');

botoesMenu.forEach(botao => {
    botao.addEventListener('click', () => {
        const secaoSelecionada = botao.getAttribute('data-secao');
        
        // Remover classe ativa de todos os botões
        botoesMenu.forEach(b => b.classList.remove('ativo'));
        
        // Adicionar classe ativa ao botão clicado
        botao.classList.add('ativo');
        
        // Remover classe secao-ativa de todas as sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('secao-ativa');
        });
        
        // Adicionar classe secao-ativa à section correta
        if (secaoSelecionada === 'musculos') {
            document.querySelector('section.musculos').classList.add('secao-ativa');
        } else if (secaoSelecionada === 'treino-e-historico') {
            document.querySelector('section.treino').classList.add('secao-ativa');
            document.querySelector('section.historico-treinos').classList.add('secao-ativa');
        } else if (secaoSelecionada === 'calendario') {
            document.querySelector('section.calendario-treinos').classList.add('secao-ativa');
        }
    });
});

// Arrays dos agrupamentos musculares e exercícios
const formMusculo = document.querySelector('.form-musculo');
const inputMusculo = document.getElementById('novo-musculo');
const listaMusculos = document.querySelector('.lista-musculos');
const musculosPadrao = [
    { nome: 'Peito', exercicios: ['Supino', 'Crucifixo', 'Fly'] },
    { nome: 'Tríceps', exercicios: ['Tríceps barra', 'Francês', 'Tríceps testa'] },
    { nome: 'Costas', exercicios: ['Puxada alta', 'Puxada baixa', 'Remada'] },
    { nome: 'Bíceps', exercicios: ['Rosca 21', 'Rosca martelo', 'Bíceps barra'] },
    { nome: 'Quadríceps', exercicios: ['Agachamento', 'Leg press', 'Cadeira extensora'] },
];

let musculos = musculosPadrao;
let musculoEmEdicao = null;
let expandidosEstado = [];

const salvarEstadoExpandido = () => {
    expandidosEstado = [];
    const listas = document.querySelectorAll('.exercicios-lista');
    listas.forEach((lista, index) => {
        if (lista.classList.contains('visivel')) {
            expandidosEstado.push(index);
        }
    });
};

const restaurarEstadoExpandido = () => {
    expandidosEstado.forEach((index) => {
        const li = document.querySelector(`li[data-indice="${index}"]`);
        if (li) {
            const lista = li.querySelector('.exercicios-lista');
            const toggle = li.querySelector('.musculo-toggle');
            if (lista && toggle) {
                lista.classList.add('visivel');
                toggle.classList.add('expandido');
            }
        }
    });
};

const renderizarMusculos = () => {
    salvarEstadoExpandido();

    listaMusculos.innerHTML = '';

    musculos.forEach((musculo, index) => {
        const li = document.createElement('li');
        li.dataset.indice = index;

        // Container do item de músculo
        const divMusculo = document.createElement('div');
        divMusculo.className = 'musculo-item';

        // Nome do músculo
        const nome = document.createElement('div');
        nome.className = 'musculo-nome';
        nome.textContent = musculo.nome;
        nome.addEventListener('click', () => {
            const lista = li.querySelector('.exercicios-lista');
            lista.classList.toggle('visivel');
            toggle.classList.toggle('expandido');
        });

        // Container de ações
        const acoes = document.createElement('div');
        acoes.className = 'musculo-acoes';

        // Botão para deletar músculo
        const btnDeletar = document.createElement('button');
        btnDeletar.className = 'btn-deletar-musculo';
        btnDeletar.textContent = 'Deletar';
        btnDeletar.type = 'button';
        btnDeletar.addEventListener('click', (e) => {
            e.stopPropagation();
            musculos.splice(index, 1);
            salvarMusculos();
            renderizarMusculos();
        });

        // Toggle para expandir/colapsar
        const toggle = document.createElement('div');
        toggle.className = 'musculo-toggle';
        toggle.textContent = '^';
        toggle.addEventListener('click', () => {
            const lista = li.querySelector('.exercicios-lista');
            lista.classList.toggle('visivel');
            toggle.classList.toggle('expandido');
        });

        acoes.appendChild(btnDeletar);
        acoes.appendChild(toggle);

        divMusculo.appendChild(nome);
        divMusculo.appendChild(acoes);

        li.appendChild(divMusculo);

        // Lista de exercícios
        const listaExercicios = document.createElement('ul');
        listaExercicios.className = 'exercicios-lista';

        musculo.exercicios.forEach((exercicio, indiceExercicio) => {
            const liExercicio = document.createElement('li');

            const nomeExercicio = document.createElement('div');
            nomeExercicio.className = 'exercicio-nome';
            nomeExercicio.textContent = exercicio;

            const btnDeletarExercicio = document.createElement('button');
            btnDeletarExercicio.className = 'btn-deletar-exercicio';
            btnDeletarExercicio.textContent = 'Deletar';
            btnDeletarExercicio.type = 'button';
            btnDeletarExercicio.addEventListener('click', (e) => {
                e.stopPropagation();
                musculos[index].exercicios.splice(indiceExercicio, 1);
                salvarMusculos();
                renderizarMusculos();
            });

            liExercicio.appendChild(nomeExercicio);
            liExercicio.appendChild(btnDeletarExercicio);
            listaExercicios.appendChild(liExercicio);
        });

        // Botão para adicionar exercício dentro da lista
        const containerBtnAdicionar = document.createElement('div');
        containerBtnAdicionar.className = 'container-btn-adicionar';

        const btnAdicionar = document.createElement('button');
        btnAdicionar.className = 'btn-adicionar-exercicio';
        btnAdicionar.textContent = '+ Exercício';
        btnAdicionar.type = 'button';
        btnAdicionar.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Verifica se já existe um formulário
            let formExistente = li.querySelector('.form-novo-exercicio');
            if (formExistente) {
                formExistente.remove();
                return;
            }
            
            // Cria o formulário inline
            const formNovoExercicio = document.createElement('div');
            formNovoExercicio.className = 'form-novo-exercicio';
            
            const inputNovoExercicio = document.createElement('input');
            inputNovoExercicio.type = 'text';
            inputNovoExercicio.placeholder = 'Nome do exercício';
            inputNovoExercicio.className = 'input-novo-exercicio';
            
            const btnConfirmar = document.createElement('button');
            btnConfirmar.textContent = 'Confirmar';
            btnConfirmar.type = 'button';
            btnConfirmar.className = 'btn-confirmar-exercicio';
            
            const btnCancelarForm = document.createElement('button');
            btnCancelarForm.textContent = 'Cancelar';
            btnCancelarForm.type = 'button';
            btnCancelarForm.className = 'btn-cancelar-form';
            
            btnConfirmar.addEventListener('click', () => {
                const nomeExercicio = inputNovoExercicio.value.trim();
                if (nomeExercicio) {
                    musculos[index].exercicios.push(nomeExercicio);
                    salvarMusculos();
                    renderizarMusculos();
                }
            });
            
            btnCancelarForm.addEventListener('click', () => {
                formNovoExercicio.remove();
            });
            
            inputNovoExercicio.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    btnConfirmar.click();
                }
            });
            
            formNovoExercicio.appendChild(inputNovoExercicio);
            formNovoExercicio.appendChild(btnConfirmar);
            formNovoExercicio.appendChild(btnCancelarForm);
            
            listaExercicios.appendChild(formNovoExercicio);
            inputNovoExercicio.focus();
        });

        containerBtnAdicionar.appendChild(btnAdicionar);
        listaExercicios.appendChild(containerBtnAdicionar);

        li.appendChild(listaExercicios);
        listaMusculos.appendChild(li);
    });
    
    restaurarEstadoExpandido();
}


const musculosSalvos = localStorage.getItem('musculos');

if (musculosSalvos) {
    musculos = JSON.parse(musculosSalvos);
}

const salvarMusculos = () => {
    localStorage.setItem('musculos', JSON.stringify(musculos));
};

formMusculo.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const novoMusculo = inputMusculo.value.trim();

    if (!novoMusculo) {
        return;
    }

    musculos.push({ nome: novoMusculo, exercicios: [] });
    salvarMusculos();
    renderizarMusculos();
    formMusculo.reset();
});

renderizarMusculos();