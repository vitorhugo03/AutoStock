// ================================
// DADOS INICIAIS
// ================================

const veiculosIniciais = [
    {
        id: 1,
        nome: "Honda Civic LXR",
        ano: 2014,
        km: 140000,
        compra: 62000,
        despesas: 1800,
        venda: 72900,
        status: "Disponível"
    },

    {
        id: 2,
        nome: "Volkswagen Gol",
        ano: 2019,
        km: 85000,
        compra: 42000,
        despesas: 1200,
        venda: 48900,
        status: "Negociação"
    },

    {
        id: 3,
        nome: "Toyota Corolla",
        ano: 2020,
        km: 65000,
        compra: 85000,
        despesas: 2300,
        venda: 98900,
        status: "Disponível"
    }
];


// ================================
// LOCAL STORAGE
// ================================

let veiculos = JSON.parse(
    localStorage.getItem("autostock_veiculos")
) || veiculosIniciais;


// ================================
// ELEMENTOS
// ================================

const tabela = document.getElementById("tabelaVeiculos");

const mensagemVazia =
    document.getElementById("mensagemVazia");

const btnAdicionar =
    document.getElementById("btnAdicionar");

const modal =
    document.getElementById("modal");

const fecharModal =
    document.getElementById("fecharModal");

const cancelarModal =
    document.getElementById("cancelarModal");

const form =
    document.getElementById("formVeiculo");

const tituloModal =
    document.getElementById("tituloModal");

const buscarVeiculo =
    document.getElementById("buscarVeiculo");

const filtroStatus =
    document.getElementById("filtroStatus");


// Campos do formulário

const campoNome =
    document.getElementById("nome");

const campoAno =
    document.getElementById("ano");

const campoKm =
    document.getElementById("km");

const campoCompra =
    document.getElementById("compra");

const campoDespesas =
    document.getElementById("despesas");

const campoVenda =
    document.getElementById("venda");


// Preview

const previewCusto =
    document.getElementById("previewCusto");

const previewLucro =
    document.getElementById("previewLucro");


// ID utilizado durante edição

let idEditando = null;


// ================================
// SALVAR
// ================================

function salvarDados() {

    localStorage.setItem(
        "autostock_veiculos",
        JSON.stringify(veiculos)
    );

}


// ================================
// FORMATAÇÃO DE PREÇO
// ================================

function formatarPreco(valor) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(valor);

}


// ================================
// CUSTO TOTAL
// ================================

function calcularCusto(veiculo) {

    return Number(veiculo.compra) +
           Number(veiculo.despesas || 0);

}


// ================================
// LUCRO
// ================================

function calcularLucro(veiculo) {

    return Number(veiculo.venda) -
           calcularCusto(veiculo);

}


// ================================
// RENDERIZAR VEÍCULOS
// ================================

function mostrarVeiculos() {

    const busca =
        buscarVeiculo.value
            .toLowerCase()
            .trim();

    const statusSelecionado =
        filtroStatus.value;


    const filtrados = veiculos.filter((veiculo) => {

        const correspondeBusca =
            veiculo.nome
                .toLowerCase()
                .includes(busca);

        const correspondeStatus =
            statusSelecionado === "Todos" ||
            veiculo.status === statusSelecionado;

        return correspondeBusca &&
               correspondeStatus;

    });


    tabela.innerHTML = "";


    if (filtrados.length === 0) {

        mensagemVazia.style.display = "block";

        return;

    }


    mensagemVazia.style.display = "none";


    filtrados.forEach((veiculo) => {

        let classeStatus = "";

        if (veiculo.status === "Disponível") {
            classeStatus = "status-disponivel";
        }

        if (veiculo.status === "Negociação") {
            classeStatus = "status-negociacao";
        }

        if (veiculo.status === "Vendido") {
            classeStatus = "status-vendido";
        }


        const custo =
            calcularCusto(veiculo);

        const lucro =
            calcularLucro(veiculo);


        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>

                <div class="vehicle-name">

                    ${veiculo.nome}

                    <small>
                        ID #${veiculo.id}
                    </small>

                </div>

            </td>


            <td>
                ${veiculo.ano}
            </td>


            <td>
                ${Number(veiculo.km).toLocaleString("pt-BR")} km
            </td>


            <td>
                ${formatarPreco(custo)}
            </td>


            <td>
                ${formatarPreco(veiculo.venda)}
            </td>


            <td>
                ${formatarPreco(lucro)}
            </td>


            <td>

                <span class="status ${classeStatus}">
                    ${veiculo.status}
                </span>

            </td>


            <td>

                <div class="actions">

                    <button
                        class="action-button"
                        title="Editar"
                        onclick="editarVeiculo(${veiculo.id})"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="action-button"
                        title="Alterar status"
                        onclick="alterarStatus(${veiculo.id})"
                    >

                        <i class="fa-solid fa-arrows-rotate"></i>

                    </button>


                    <button
                        class="action-button delete"
                        title="Excluir"
                        onclick="excluirVeiculo(${veiculo.id})"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


// ================================
// DASHBOARD
// ================================

function atualizarDashboard() {

    const estoque =
        veiculos.filter(
            veiculo => veiculo.status !== "Vendido"
        );


    const negociacao =
        veiculos.filter(
            veiculo => veiculo.status === "Negociação"
        );


    const vendidos =
        veiculos.filter(
            veiculo => veiculo.status === "Vendido"
        );


    const valorEstoque =
        estoque.reduce(
            (total, veiculo) =>
                total + Number(veiculo.venda),
            0
        );


    const lucroPotencial =
        estoque.reduce(
            (total, veiculo) =>
                total + calcularLucro(veiculo),
            0
        );


    document.getElementById("totalEstoque")
        .textContent = estoque.length;


    document.getElementById("valorEstoque")
        .textContent = formatarPreco(valorEstoque);


    document.getElementById("totalNegociacao")
        .textContent = negociacao.length;


    document.getElementById("lucroPotencial")
        .textContent = formatarPreco(lucroPotencial);

}


// ================================
// ABRIR MODAL
// ================================

function abrirModal() {

    modal.classList.add("active");

}


// ================================
// FECHAR MODAL
// ================================

function fecharModalFuncao() {

    modal.classList.remove("active");

    form.reset();

    campoDespesas.value = 0;

    idEditando = null;

    tituloModal.textContent =
        "Adicionar veículo";

    atualizarPreview();

}


// ================================
// ADICIONAR VEÍCULO
// ================================

function adicionarVeiculo() {

    idEditando = null;

    tituloModal.textContent =
        "Adicionar veículo";

    form.reset();

    campoDespesas.value = 0;

    atualizarPreview();

    abrirModal();

}


// ================================
// SALVAR FORMULÁRIO
// ================================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const nome =
        campoNome.value.trim();

    const ano =
        Number(campoAno.value);

    const km =
        Number(campoKm.value);

    const compra =
        Number(campoCompra.value);

    const despesas =
        Number(campoDespesas.value) || 0;

    const venda =
        Number(campoVenda.value);


    if (
        !nome ||
        !ano ||
        !km ||
        compra < 0 ||
        venda < 0
    ) {

        alert("Preencha os campos corretamente.");

        return;

    }


    // EDITAR

    if (idEditando !== null) {

        const veiculo =
            veiculos.find(
                item => item.id === idEditando
            );


        veiculo.nome = nome;
        veiculo.ano = ano;
        veiculo.km = km;
        veiculo.compra = compra;
        veiculo.despesas = despesas;
        veiculo.venda = venda;


        alert("Veículo atualizado com sucesso.");

    }

    // ADICIONAR

    else {

        const novoVeiculo = {

            id: Date.now(),

            nome: nome,

            ano: ano,

            km: km,

            compra: compra,

            despesas: despesas,

            venda: venda,

            status: "Disponível"

        };


        veiculos.push(novoVeiculo);


        alert("Veículo cadastrado com sucesso.");

    }


    salvarDados();

    mostrarVeiculos();

    atualizarDashboard();

    fecharModalFuncao();

});


// ================================
// EDITAR
// ================================

function editarVeiculo(id) {

    const veiculo =
        veiculos.find(
            item => item.id === id
        );


    if (!veiculo) return;


    idEditando = id;


    tituloModal.textContent =
        "Editar veículo";


    campoNome.value =
        veiculo.nome;

    campoAno.value =
        veiculo.ano;

    campoKm.value =
        veiculo.km;

    campoCompra.value =
        veiculo.compra;

    campoDespesas.value =
        veiculo.despesas || 0;

    campoVenda.value =
        veiculo.venda;


    atualizarPreview();

    abrirModal();

}


// ================================
// ALTERAR STATUS
// ================================

function alterarStatus(id) {

    const veiculo =
        veiculos.find(
            item => item.id === id
        );


    if (!veiculo) return;


    const opcao =
        prompt(
            `Status atual: ${veiculo.status}

Escolha o novo status:

1 - Disponível
2 - Negociação
3 - Vendido`
        );


    if (opcao === "1") {

        veiculo.status =
            "Disponível";

    }

    else if (opcao === "2") {

        veiculo.status =
            "Negociação";

    }

    else if (opcao === "3") {

        veiculo.status =
            "Vendido";

    }

    else {

        return;

    }


    salvarDados();

    mostrarVeiculos();

    atualizarDashboard();

}


// ================================
// EXCLUIR
// ================================

function excluirVeiculo(id) {

    const veiculo =
        veiculos.find(
            item => item.id === id
        );


    if (!veiculo) return;


    const confirmar =
        confirm(
            `Deseja realmente excluir ${veiculo.nome}?`
        );


    if (!confirmar) return;


    veiculos =
        veiculos.filter(
            item => item.id !== id
        );


    salvarDados();

    mostrarVeiculos();

    atualizarDashboard();

}


// ================================
// PREVIEW DE CUSTO E LUCRO
// ================================

function atualizarPreview() {

    const compra =
        Number(campoCompra.value) || 0;

    const despesas =
        Number(campoDespesas.value) || 0;

    const venda =
        Number(campoVenda.value) || 0;


    const custo =
        compra + despesas;

    const lucro =
        venda - custo;


    previewCusto.textContent =
        formatarPreco(custo);

    previewLucro.textContent =
        formatarPreco(lucro);

}


// ================================
// EVENTOS DO PREVIEW
// ================================

campoCompra.addEventListener(
    "input",
    atualizarPreview
);

campoDespesas.addEventListener(
    "input",
    atualizarPreview
);

campoVenda.addEventListener(
    "input",
    atualizarPreview
);


// ================================
// FILTROS
// ================================

buscarVeiculo.addEventListener(
    "input",
    mostrarVeiculos
);

filtroStatus.addEventListener(
    "change",
    mostrarVeiculos
);


// ================================
// MODAL
// ================================

btnAdicionar.addEventListener(
    "click",
    adicionarVeiculo
);


fecharModal.addEventListener(
    "click",
    fecharModalFuncao
);


cancelarModal.addEventListener(
    "click",
    fecharModalFuncao
);


// Fechar clicando fora

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            fecharModalFuncao();

        }

    }
);


// ================================
// INICIALIZAÇÃO
// ================================

mostrarVeiculos();

atualizarDashboard();

atualizarPreview();