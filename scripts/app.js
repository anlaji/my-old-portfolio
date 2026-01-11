const sections = document.querySelectorAll('section');
const sectBtns = document.querySelectorAll('.controls');
const sectBtn = document.querySelectorAll('.control');
const allSections = document.querySelector('.main-content');

function printSections() {
  const sections_cnt = document.querySelectorAll('.sect_controll');
  const pos = $(document).scrollTop();
  sections_cnt.forEach((sect) => {
    const posSection = sect.offsetTop;
    const heightSection = sect.offsetHeight;
    if (pos >= posSection && pos < posSection + heightSection) {
      sectBtn.forEach((btn) => {
        if (sect.id === btn.getAttribute('data-id')) {
          //console.log(btn.getAttribute('data-id'));
          let currentBtn = document.querySelectorAll('.active-btn');
          if (currentBtn.length !== 0) {
            currentBtn[0].className = currentBtn[0].className.replace(
              'active-btn',
              '',
            );
          }
          btn.className += ' active-btn';
        }
      });
    }
  });
}

function PageTransitions() {
  //Button click active class
  for (let i = 0; i < sectBtn.length; i++) {
    sectBtn[i].addEventListener('click', function () {
      let currentBtn = document.querySelectorAll('.active-btn');
      currentBtn[0].className = currentBtn[0].className.replace(
        'active-btn',
        '',
      );
      this.className += ' active-btn';
    });
  }

  //Sections Active
  allSections.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (id) {
      //resmove selected from the other btns
      sectBtns.forEach((btn) => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');

      //hide other sections
      sections.forEach((section) => {
        section.classList.remove('active');
      });

      const element = document.getElementById(id);
      element.classList.add('active');
    }
  });
}

PageTransitions();

// and then make each element do something on scroll

$(document).ready(function () {
  $(document).on('scroll', printSections);
});
