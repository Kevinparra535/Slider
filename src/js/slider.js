/* eslint-disable class-methods-use-this */
class Slider {
  constructor(config) {
    this.slideIndex = 0;
    this.navigation = config.navigation;
    this.slideTouch = config.sliderTouch;
    this.dots = config.dots;
    this.auto = config.sliderAuto;
    this.isVisible = null;

    this.threshold = 0.25;
    this.handlerIntersection = this.handlerIntersection.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    this.initService = this.initService.bind(this);
    this.plusSlides = this.plusSlides.bind(this);
    this.currentSlide = this.currentSlide.bind(this);
    this.showSlides = this.showSlides.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);
    this.carouselControls = this.carouselControls.bind(this);
    this.onTouchCarousel = this.onTouchCarousel.bind(this);
    this.autoSlide = this.autoSlide.bind(this);
    this.autoSlideRun = this.autoSlideRun.bind(this);

    // Se inicializa la funcion para mostrar el primer slide
    this.initService();
  }

  initService() {
    // Si el tamaño de la ventana es menor a ... se inicia el slide
    if (window.innerWidth < 767) {
      this.showSlides(this.slideIndex);

      this.dots.active ?
        console.log('%c Dots activados', 'color:green; font-size:18px') :
        console.log();

      this.navigation ?
        console.log('%c Controles activados', 'color:green; font-size:18px') :
        console.log();
      this.onTouchCarousel();

      this.slideTouch ?
        console.log(
          '%c Slider tactil activado',
          'color:green; font-size:18px',
        ) :
        console.log();
      this.carouselControls();

      this.auto.active ?
        console.log('%c Auto scroll activado', 'color:green; font-size:18px') :
        console.log();
      this.autoSlide();
    } else {
      this.resizeWindow();
    }
  }

  // Se puede agregar un dot
  currentSlide(n) {
    this.showSlides((this.slideIndex = n));
  }

  // Cambia el slide item
  plusSlides(n) {
    this.showSlides((this.slideIndex += n));
  }

  // Muestra el slide seleccionado
  showSlides(n) {
    const slideItem = document.querySelectorAll('.slider__item');
    const dots = document.querySelectorAll('.dot');

    if (n > slideItem.length) {
      this.slideIndex = 1;
    }

    if (n < 1) {
      this.slideIndex = slideItem.length;
    }

    for (let i = 0; i < slideItem.length; i++) {
      slideItem[i].style.display = 'none';
    }

    // Dots
    if (this.dots.active) {
      for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
      }
      dots[this.slideIndex - 1].className += ' active';
    } else {
      for (let i = 0; i < dots.length; i++) {
        dots[i].style.display = 'none';
      }
    }

    slideItem[this.slideIndex - 1].style.display = 'block';
  }

  // Al redimensionar la pestaña muestra los elementos de el slide
  // eslint-disable-next-line class-methods-use-this
  resizeWindow() {
    const slideItem = document.querySelectorAll('.slider__item');

    for (let i = 0; i < slideItem.length; i++) {
      slideItem[i].style.display = 'block';
    }
  }

  // Navegación
  carouselControls() {
    const sliderArrows = document.querySelector('.slider__arrows');

    if (this.navigation) {
      const right = document.createElement('img');
      const left = document.createElement('img');

      right.classList.add('slider__arrows--next');
      left.classList.add('slider__arrows--prev');

      right.setAttribute('src', '/assets/images/arrow@2x.png');
      left.setAttribute('src', '/assets/images/arrowprev@2x.png');

      sliderArrows.append(right);
      sliderArrows.append(left);
    }
  }

  // Si el slider esta activado lo inicia
  autoSlide() {
    const { active, delay } = this.auto;
    const slider = document.querySelector('.slider');
    const observer = new IntersectionObserver(this.handlerIntersection, {
      threshold: this.threshold,
    });
    observer.observe(slider);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Si está activo
    if (active) {
      this.autoSlideRun;
    } else {
      this.autoSlideStop();
    }
  }

  // Inicia el slider
  autoSlideRun() {
    const slideItem = document.querySelectorAll('.slider__item');
    const dots = document.querySelectorAll('.dot');

    for (let i = 0; i < slideItem.length; i++) {
      slideItem[i].style.display = 'none';
    }

    // SlideIndex representa el slide que se está mostrando
    this.slideIndex++;

    if (this.slideIndex > slideItem.length) {
      this.slideIndex = 1;
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }

    slideItem[this.slideIndex - 1].style.display = 'block';
    dots[this.slideIndex - 1].className += ' active';

    // Según la configuración la imagen cambia casa n segundos
    // setTimeout(this.autoSlideRun, this.delay);
  }

  // Corre el slider
  autoSlidePlay() {
    const { active, delay } = this.auto;
    if (active) {
      setInterval(this.autoSlideRun, delay);
      console.log('Play');
    }
  }

  // Detiene el slider
  autoSlideStop() {
    const { active, delay } = this.auto;
    if (active) {
      const interval = setInterval(this.autoSlideRun, delay);
      clearInterval(interval);
      console.log('Stop');
    }
  }

  // Intersection observer
  handlerIntersection(entries) {
    const entry = entries[0];
    const isVisible = entry.intersectionRatio > this.threshold;
    if (isVisible) {
      this.autoSlidePlay();
    } else {
      this.autoSlideStop();
    }
    // console.log(entry);
  }

  // Si el usuario cambia de pestaña o sale del navegador
  handleVisibilityChange() {
    const isVisible = document.visibilityState === 'visible';
    if (isVisible) {
      this.autoSlidePlay();
    } else {
      this.autoSlideStop();
    }
  }

  // Slider Touch
  onTouchCarousel() {
    const _this = this;
    const slider = document.querySelector('.slider');

    let x1;
    let x2;

    if (this.slideTouch) {
      slider.addEventListener('touchstart', (event) => {
        event.preventDefault();
        const touchObj = event.changedTouches[0];
        x1 = parseInt(touchObj.clientX);
      });

      slider.addEventListener('touchend', (event) => {
        event.preventDefault();

        const touchObj = event.changedTouches[0];
        x2 = parseInt(touchObj.clientX);
        const dif = x2 - x1;

        if (dif < 0) {
          _this.plusSlides(1);
        } else {
          // retrocede
          _this.plusSlides(-1);
        }
      });
    }
  }
}

export default Slider;
