document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const header = document.querySelector('header');

    // Reveal sections as they scroll into view.
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    sections.forEach(section => revealObserver.observe(section));

    // Add a shadow to the header once the page is scrolled.
    if (header) {
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Scrollspy: highlight the nav link for the section currently in view.
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { root: null, rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => {
        if (section.id) spyObserver.observe(section);
    });

    // Booking widget: open the availability.mendelg.tech booking page in a popup.
    const bookBadge = document.getElementById('book-badge');
    const bookModal = document.getElementById('book-modal');
    if (bookBadge && bookModal) {
        const frame = bookModal.querySelector('iframe');
        const openBook = () => {
            if (frame && !frame.src) frame.src = frame.dataset.src; // lazy-load on first open
            bookModal.hidden = false;
            document.body.style.overflow = 'hidden';
        };
        const closeBook = () => {
            bookModal.hidden = true;
            document.body.style.overflow = '';
        };
        bookBadge.addEventListener('click', openBook);
        bookModal.querySelectorAll('[data-book-close]').forEach(el => el.addEventListener('click', closeBook));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !bookModal.hidden) closeBook();
        });
    }
});
