const estufas = document.querySelectorAll('.estufa');
const cards = document.querySelectorAll('.process__card');

let activeIndex = 0;

estufas.forEach((estufa, index) => {
  estufa.addEventListener('click', () => {
    if (index === activeIndex) return; // se clicou na já ativa, ignora

    // Remove active da estufa atual
    estufas[activeIndex].classList.remove('active');
    // Remove active do card atual com suavidade
    cards[activeIndex].classList.remove('active');

    // Adiciona active na nova estufa
    estufa.classList.add('active');

    // Pequeno timeout pra deixar o fadeOut acontecer
    setTimeout(() => {
      // Ativa o card correspondente
      cards[index].classList.add('active');
    }, 200); // 50ms ou 100ms: ajusta conforme o tempo de transição do CSS

    activeIndex = index; // atualiza controle
  });
});

// Ativar a primeira estufa e card ao carregar a página
estufas[0].classList.add('active');
cards[0].classList.add('active');
