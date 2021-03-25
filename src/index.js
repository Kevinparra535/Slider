import Slider from '/src/js/slider.js';

const sliderConfig = {
  dots: { active: true, interactive: false },
  navigation: false,
  sliderTouch: false,
  sliderAuto: { active: false, delay: 3000 },
};

const slider = new Slider(sliderConfig);
const screen = window.matchMedia('(max-width: 767px)');
const next = document.querySelector('.slider__arrows--next');
const prev = document.querySelector('.slider__arrows--prev');

next.addEventListener('click', () => slider.plusSlides(1));
prev.addEventListener('click', () => slider.plusSlides(-1));

screen.addListener((screen) => {
  if (screen.matches) {
    slider.initService();
  } else {
    slider.resizeWindow();
  }
});