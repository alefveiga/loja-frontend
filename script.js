// Guardar todos os produtos carregados
let todosProdutos = [];

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(produtos => {
    todosProdutos = produtos;
    exibirProdutos(todosProdutos);
  });

// Função para exibir os produtos em lista (não carrossel, mas você pode adaptar)
function exibirProdutos(produtos) {
  const container = document.querySelector(".produtos");
  container.innerHTML = "";

  produtos.forEach(produto => {
    const item = document.createElement("article");
    item.classList.add("produto");

    item.innerHTML = `
      <img src="${produto.image}" alt="${produto.title}" />
      <h4>${produto.title}</h4>
      <p>R$ ${(produto.price * 5).toFixed(2)}</p>
      <button class="btn-adicionar">Adicionar ao carrinho</button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      adicionarAoCarrinho(produto.title);
    });

    container.appendChild(item);
  });
}

// Função para filtrar produtos por busca e categoria
function filtrarProdutos() {
  const busca = document.getElementById('input-busca').value.toLowerCase();
  const categoria = document.getElementById('select-categoria').value;

  const filtrados = todosProdutos.filter(produto => {
    const titulo = produto.title.toLowerCase();
    const categoriaProduto = produto.category;

    const buscaOk = titulo.includes(busca);
    const categoriaOk = categoria === "" || categoriaProduto === categoria;

    return buscaOk && categoriaOk;
  });

  exibirProdutos(filtrados);
}

// Eventos para busca e filtro
document.getElementById('input-busca').addEventListener('input', filtrarProdutos);
document.getElementById('select-categoria').addEventListener('change', filtrarProdutos);


document.addEventListener("DOMContentLoaded", () => {
  let contador = 0;
  let produtos = [];

  // Função para atualizar contador e lista do carrinho
  function adicionarAoCarrinho(titulo = "Produto genérico") {
    contador++;
    document.getElementById('contador-carrinho').textContent = contador;

    const lista = document.getElementById("lista-carrinho");

    if (contador === 1) {
      lista.innerHTML = ""; // limpa texto inicial
    }

    const item = document.createElement("li");
    item.textContent = titulo;
    lista.appendChild(item);
  }

  // Funções menu e carrinho
  window.abrirMenu = () => document.getElementById("menuLateral").classList.add("aberto");
  window.fecharMenu = () => document.getElementById("menuLateral").classList.remove("aberto");
  window.abrirCarrinho = () => document.getElementById("carrinhoLateral").classList.add("aberto");
  window.fecharCarrinho = () => document.getElementById("carrinhoLateral").classList.remove("aberto");

  // Função para criar carrossel com produtos em uma seção específica
  function criarCarrossel(produtos, prefixo) {
    const wrapper = document.getElementById(`${prefixo}-wrapper`);
    wrapper.innerHTML = ""; // limpa slides antigos, se houver

    produtos.forEach(produto => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");

      slide.innerHTML = `
        <article class="produto">
          <img src="${produto.image}" alt="${produto.title}" />
          <h4>${produto.title}</h4>
          <p>R$ ${(produto.price * 5).toFixed(2)}</p>
          <button class="btn-adicionar">Adicionar ao carrinho</button>
        </article>
      `;

      slide.querySelector("button").addEventListener("click", () => {
        adicionarAoCarrinho(produto.title);
      });

      wrapper.appendChild(slide);
    });

    // Inicializa Swiper para a seção
    new Swiper(`.${prefixo}-swiper`, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: `.${prefixo}-pagination`,
        clickable: true
      },
      navigation: {
        nextEl: `.${prefixo}-next`,
        prevEl: `.${prefixo}-prev`
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
        1200: { slidesPerView: 4 }
      }
    });
  }

  // Função principal para buscar produtos e montar carrosséis
  function carregarProdutos() {
    const main = document.querySelector("main");

    // Criar um aviso de carregamento
    const loadingMsg = document.createElement("p");
    loadingMsg.textContent = "Carregando produtos...";
    main.insertBefore(loadingMsg, main.firstChild);

    fetch("https://fakestoreapi.com/products")
      .then(res => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then(data => {
        produtos = data;

        // Remove mensagem de loading
        loadingMsg.remove();

        // Criar carrosséis filtrados por categoria
        criarCarrossel(produtos.slice(0, 5), "novidades"); // primeiros 5
        criarCarrossel(produtos.filter(p => p.category === "electronics"), "eletronicos");
        criarCarrossel(produtos.filter(p => p.category === "jewelery"), "joias");
        criarCarrossel(produtos.filter(p => p.category === "men's clothing"), "moda-masculina");
      })
      .catch(err => {
        console.error("Erro ao carregar os produtos:", err);
        loadingMsg.textContent = "Erro ao carregar os produtos. Tente novamente mais tarde.";
      });
  }

  // Carregar produtos assim que o script rodar
  carregarProdutos();
});
