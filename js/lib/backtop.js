/* Back-to-top floating button: appears after scrolling down, smooth scroll to top */
(function () {
    'use strict';
    function init() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;
        function onScroll() {
            btn.classList.toggle('show', window.pageYOffset > 400);
        }
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
