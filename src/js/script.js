'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const wrapper = document.querySelector('.wrapper');
  const headerLinks = document.querySelectorAll('.header__link');
  const scrollWidth = window.innerWidth - wrapper.offsetWidth + 'px';
  const menuAnimation = gsap.timeline({ paused: true });
  const startAnimation = gsap.timeline();
  let isOpen = false;

  //Start Animation
  startAnimation.from('.wrapper', {
    opacity: 0,
    duration: 1,
  }).from('.header', {
    opacity: 0,
    duration: 1,
  }).from('.hero__title', {
    opacity: 0,
    duration: 1,
  }, '-=0.5').from('.hero__column', {
    opacity: 0,
    duration: 1,
    y: 150,
    stagger: 0.3,
  }, '-=0.5');

  //Menu Animation
  gsap.matchMedia().add('(max-width: 992px)', () => {
    menuAnimation.to('.overlay', {
      opacity: 1,
      visibility: 'visible',
    }).to('.overlay__block', {
      duration: 1,
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      stagger: 0.07,
      ease: 'power3.inOut'
    }).to('.header__menu', {
      opacity: 1,
      visibility: 'visible',
      duration: 0.4
    }).from('.header__item', {
      opacity: 0,
      stagger: 0.2,
      duration: 0.5
    }, '-=0.3');
  });

  burger.addEventListener('click', () => {
    let ariaLabel = burger.getAttribute('aria-label');
    burger.classList.toggle('active');

    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      if (burger.classList.contains('active')) {
        setTimeout(function () {
          document.body.style.paddingRight = scrollWidth;
          header.style.paddingRight = scrollWidth;
          document.body.classList.add('hidden');
        }, 600);
      } else {
        setTimeout(function () {
          document.body.classList.remove('hidden');
          document.body.style.paddingRight = '';
          header.style.paddingRight = '';
        }, 2200);
      }
    } else {
      if (burger.classList.contains('active')) {
        setTimeout(function () {
          document.body.classList.add('hidden');
        }, 600);
      } else {
        setTimeout(function () {
          document.body.classList.remove('hidden');
        }, 2200);
      }
    }

    if (ariaLabel === 'Open menu') {
      burger.setAttribute('aria-label', 'Close menu');
    } else {
      burger.setAttribute('aria-label', 'Open menu');
    }

    if (isOpen) {
      menuAnimation.reverse();
    } else {
      menuAnimation.play();
    }
    isOpen = !isOpen;
  });

  if (!isOpen) {
    headerLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuAnimation.reverse();
        burger.setAttribute('aria-label', 'Open menu');
        burger.classList.remove('active');
        isOpen = !isOpen;
      })
    });
  }

  //Prices Logic
  const currencyBtns = document.querySelectorAll('.hero-column__currency-btn');
  const periodBtns = document.querySelectorAll('.hero-column__period');
  const currency = [{ symbol: '$', value: 1 }, { symbol: '₽', value: 89 }, { symbol: '€', value: 0.92 }];
  let currentIndex = 0;
  let newValue = 1;

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentIndex++;

      if (currentIndex > (currency.length - 1)) {
        currentIndex = 0;
      }

      currencyBtns.forEach(el => {
        const currentValue = el.closest('.hero-column__price').querySelector('.hero-column__value');
        const currentPeriod = el.closest('.hero-column__price').querySelector('.hero-column__period');
        const defaultPrice = currentValue.getAttribute('data-default');

        if (currentPeriod.textContent === '/Months') {
          newValue = defaultPrice * currency[currentIndex].value;
        } else {
          if (el.textContent === '$') {
            newValue = currentValue.textContent * currency[1].value;
          } else if (el.textContent === '₽') {
            newValue = currentValue.textContent / currency[1].value * currency[2].value;
          } else {
            newValue = currentValue.textContent / currency[2].value;
          }
        }

        currentValue.textContent = Math.round(newValue);
        el.textContent = currency[currentIndex].symbol;
      });
    });
  });

  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(el => {
        let currentValue = el.closest('.hero-column__price').querySelector('.hero-column__value');

        if (el.textContent === '/Months') {
          el.textContent = '/Day';
          currentValue.textContent = Math.round(currentValue.textContent / 30);
        } else {
          el.textContent = '/Months';
          currentValue.textContent = Math.round(currentValue.textContent * 30);
        }
        currentValue.setAttribute('data-current', currentValue.textContent);
      });
    });
  });

});


