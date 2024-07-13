const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', ()=>{
        navMenu.classList.add('show__menu')
    })
}
if (navClose) {
    navClose.addEventListener('click', ()=>{
        navMenu.classList.remove('show__menu')
    })
}

/*remove menulist*/

const navLink = document.querySelectorAll('.nav__link');
const linkAction = ()=>{
    navMenu.classList.remove('show__menu');
}

navLink.forEach(n => n.addEventListener('click', linkAction));

// add Shadow header
const shadowHeader = ()=>{
    const header = document.getElementById('header');
this.scrollY>=50 ? header.classList.add('shadow__header')
                : header.classList.remove('shadow__header')
}

window.addEventListener('scroll',shadowHeader);

// show scrollup

const scrollup = () => {
    const scrollup = document.getElementById('scroll-up');
    this.scrollY >= 350 ? scrollup.classList.add('show__scrollup')
                        : scrollup.classList.remove('show__scrollup')
}
window.addEventListener('scroll',scrollup);

// scroll sections active link

const sections = document.querySelectorAll('section[id]');

const scrollActive = () =>{
    const scrollDown = window.scrollY
        sections.forEach(current =>{
            const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop -58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')          /*revise it*/

    if (scrollDown > sectionTop && scrollDown <= sectionTop +sectionHeight) {
        sectionsClass.classList.add('active__link');
    }else{
        sectionsClass.classList.remove('active__link');
    }
    })
}
window.addEventListener('scroll',scrollActive);

/*==============Scroll Reveal===============*/
const sr = ScrollReveal({
    origin :'top',
    distance: '60px',
    duration: 2500,
    delay: 300,

    reset:false
})

sr.reveal('.home__data,.footer')
sr.reveal('.home__dish', {delay:500, distance: '100px', origin:'bottom'})
sr.reveal('.home__burger', {delay:1200, distance: '100px', duration:1500})
sr.reveal('.home__ingredient', {delay:1600, interval:100})
sr.reveal('.recipe__img, .delivery__img,.contact__img',{origin: 'left',distance: '100px'})
sr.reveal('.recipe__data,.delivery__data,.contact__data',{origin: 'right',distance: '100px'})
sr.reveal('.popular__card',{interval:100})