'use strict';
const nav = document.getElementById('mainNav');
const toggle = nav.querySelector('button');
const menu = document.getElementById('navbarResponsive');
toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('show', open);
});
function closeMenu() {
    menu.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
}
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
nav.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); toggle.focus(); } });
const links = Array.from(nav.querySelectorAll('.nav-link'));
const topButton = document.querySelector('.scroll-to-top');
function updateNavigation() {
    nav.classList.toggle('navbar-shrink', window.scrollY > 100);
    topButton.style.display = window.scrollY > 100 ? 'block' : 'none';
    let current = 'maranti';
    ['maranti', 'contacto', 'delicius-dax', 'ballon-land'].forEach(id => {
        if (document.getElementById(id).getBoundingClientRect().top <= 130) current = id;
    });
    links.forEach(link => {
        const active = link.hash === '#' + current;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
}
window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();


// Native modal dialogs provide keyboard focus containment and Escape support.
document.querySelectorAll('[data-product-dialog]').forEach(button => {
    const dialog = document.getElementById(button.dataset.productDialog);
    button.addEventListener('click', () => {
        dialog.showModal();
        document.body.classList.add('product-dialog-open');
    });
    dialog.querySelectorAll('[data-close-dialog]').forEach(close => {
        close.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', event => {
        const bounds = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('product-dialog-open');
        button.focus({ preventScroll: true });
    });
});

