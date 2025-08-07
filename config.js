let contador = 0;

// Função para adicionar um item ao carrinho
function adicionarAoCarrinho(titulo = "Produto genérico") {
  contador++;
  document.getElementById('contador-carrinho').textContent = contador;

  const lista = document.getElementById("lista-carrinho");

  if (contador === 1) {
    lista.innerHTML = ""; // Limpa o texto inicial
  }

  const item = document.createElement("li");
  item.textContent = titulo;
  lista.appendChild(item);
}

// Funções para abrir e fechar o menu lateral
function abrirMenu() {
  document.getElementById("menuLateral").classList.add("aberto");
}

function fecharMenu() {
  document.getElementById("menuLateral").classList.remove("aberto");
}

// Funções para abrir e fechar o carrinho lateral
function abrirCarrinho() {
  document.getElementById("carrinhoLateral").classList.add("aberto");
}

function fecharCarrinho() {
  document.getElementById("carrinhoLateral").classList.remove("aberto");
}

// Requisição para a API de produtos
fetch("https://fakestoreapi.com/products")
  .then(resposta => resposta.json())
  .then(produtos => {
    const listaProdutos = document.querySelector(".produtos");

    produtos.forEach(produto => {
      const item = document.createElement("article");
      item.classList.add("produto");

      item.innerHTML = `
        <img src="${produto.image}" alt="${produto.title}" />
        <h4>${produto.title}</h4>
        <p>R$ ${(produto.price * 5).toFixed(2)}</p>
        <button class="btn-adicionar">Adicionar ao carrinho</button>
      `;

      const botao = item.querySelector(".btn-adicionar");
      botao.addEventListener("click", () => {
        adicionarAoCarrinho(produto.title);
      });

      listaProdutos.appendChild(item);
    });
  })
  .catch(erro => {
    console.error("Erro ao carregar os produtos:", erro);
    const listaProdutos = document.querySelector(".produtos");
    listaProdutos.innerHTML = "<p>Erro ao carregar os produtos. Tente novamente mais tarde.</p>";
  });
 