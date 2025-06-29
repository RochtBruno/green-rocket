// Troca de imagem principal ao clicar nas miniaturas
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-image');

thumbnails.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbnails.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // Simulando diferentes imagens mudando cor de fundo
    const imageId = thumb.getAttribute('data-image');
    mainImage.style.backgroundColor = getColorById(imageId);
  });
});

// Troca de cor ao clicar nas variações
const variations = document.querySelectorAll('.variation-box');

variations.forEach(variation => {
  variation.addEventListener('click', () => {
    variations.forEach(v => v.classList.remove('active'));
    variation.classList.add('active');

    // Simulando diferentes variações mudando tom de cinza
    const colorId = variation.getAttribute('data-color');
    mainImage.style.opacity = 0.7 + 0.05 * colorId;
  });
});

function getColorById(id) {
  switch(id) {
    case '1': return '#d9d9d9';
    case '2': return '#cccccc';
    case '3': return '#bbbbbb';
    case '4': return '#aaaaaa';
    default: return '#d9d9d9';
  }
}
