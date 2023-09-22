const palette = document.querySelector('.colorCircle');
const colors = Array.from(document.querySelectorAll('.colorCircle > li'));
const more = document.querySelector('.more');
let rotateTimer = setInterval(autoRotate, 5000);

loadData()
  .then(data => {
    defaultProductList(data.products);
    colorEventListener(data.products);
  });
moreOpen();
moreClose();
stopRotate();

// palette
function colorEventListener (products) {
  colors.forEach(color => {
    color.addEventListener('click', (event) => {
      rotatePalette(event);
      addOnClass(event);
      changeColorName(event);
      changeColorShape(event);
      changeProductImg(event);
      changeBackgroundColor(event);
      changeProductList(event, products);
    });
  });
}

function rotatePalette (event) {
  const index = colors.indexOf(event.target);

  palette.style.transform = `translate(0%, -50%) rotate(${index*-30}deg)`;
};

function addOnClass (event) {
  colors.forEach(color => color.classList.remove('on'));
  event.target.classList.add('on');
}

function changeColorName (event) {
  const onColorName = document.querySelectorAll('.colorName');
  const colorTxt = event.target.innerText;

  onColorName.forEach(name => name.innerText = colorTxt);
}

function changeColorShape (event) {
  const colorShape = document.querySelectorAll('.colorShape');
  const color = event.target.dataset.color;

  colorShape.forEach(shape => shape.style.background = `var(--main-${color})`);
}

function changeProductImg (event) {
  const productImg = document.querySelector('.onProductImg');
  const color = event.target.dataset.color;

  productImg.style.backgroundImage = `url(img/${color}.png)`;
}

function changeBackgroundColor(event) {
  const main = document.querySelector('#main');
  const color = event.target.dataset.color;

  main.style.backgroundColor = `var(--sub-${color})`;
}

function autoRotate () {
  const onColor = document.querySelector('.colorCircle > li.on');
  const currentColorIndex = colors.indexOf(onColor);
  let nextColorIndex = currentColorIndex + 1;
  
  if (nextColorIndex >= colors.length) {
    nextColorIndex = 0;
  }
  colors[nextColorIndex].click();
}

function stopRotate () {
  more.addEventListener('mouseover', () => {clearInterval(rotateTimer)});
  more.addEventListener('mouseout', () => {rotateTimer = setInterval(autoRotate, 5000)});
  colors.forEach(color => {
    color.addEventListener('mouseover', () => {clearInterval(rotateTimer)});
    color.addEventListener('mouseout', () => {rotateTimer = setInterval(autoRotate, 5000)});
  })
}

// more
function moreOpen () {
  const moreBtn = document.querySelector('.moreBtn');
  const onColorName = document.querySelector('#txtArea > .onColorName');

  moreBtn.addEventListener('click', () => {
    more.style.right = '0';
    onColorName.style.opacity = 0;
  });
}

function moreClose () {
  const closeBtn = document.querySelector('.closeBtn');
  const onColorName = document.querySelector('#txtArea > .onColorName');

  closeBtn.addEventListener('click', () => {
    more.style.right = '-99%';
    onColorName.style.opacity = 1;
  });
}

// productList
async function loadData () {
  try {
    const response = await fetch('products.json');
    const data = await response.json();

    return data;
  } catch (error) {
    return console.error(error);
  }
}

function createProductHTML (product) {
  return `
    <li><a href="${product.url}">
      <div class="imgWrap"><img src="${product.img}" alt="${product.name}"></div>
      <p class="productName">${product.name}</p>
      <p class="price">${'₩ ' + product.price.toLocaleString("ko-KR")}</p>
    </a></li>`
}

function createProductElement (products) {
  const productList = document.querySelector('.productList');

  productList.innerHTML = products.map(product => createProductHTML(product)).join('\n');
}

function defaultProductList (products) {
  const defaultColor = palette.firstElementChild.innerText;
  const displayProducts = products.filter(product => product.color == defaultColor);

  createProductElement(displayProducts);
}

function changeProductList (event, products) {
  const colorTxt = event.target.innerText;
  const displayProducts = products.filter(product => product.color == colorTxt);

  createProductElement(displayProducts);
}