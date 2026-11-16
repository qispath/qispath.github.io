/* Post table-of-contents: build from headings, smooth scroll + scrollspy + collapse */
(function () {
    'use strict';

    function esc(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    function attr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    function build() {
        var content = document.querySelector('.article .content');
        var toc = document.getElementById('post-toc');
        if (!content || !toc) return;

        var list = toc.querySelector('.post-toc-list');
        var heads = content.querySelectorAll('h2[id], h3[id], h4[id]');
        if (!heads.length) {
            toc.style.display = 'none';
            return;
        }

        var html = '';
        Array.prototype.forEach.call(heads, function (h) {
            var level = parseInt(h.tagName.substring(1), 10);
            html +=
                '<li class="post-toc-item toc-level-' + level + '">' +
                '<a href="#' + encodeURIComponent(h.id) + '" data-target="' + attr(h.id) + '">' +
                esc(h.textContent.trim()) +
                '</a></li>';
        });
        list.innerHTML = html;

        // smooth scroll with fixed nav offset
        list.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('a[data-target]') : null;
            if (!a) return;
            e.preventDefault();
            var target = document.getElementById(a.getAttribute('data-target'));
            if (!target) return;
            var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: top, behavior: 'smooth' });
            if (history.replaceState) history.replaceState(null, '', '#' + target.id);
        });

        // collapse toggle
        var header = toc.querySelector('.post-toc-header');
        header.addEventListener('click', function () {
            toc.classList.toggle('collapsed');
        });
        if (window.innerWidth < 768) toc.classList.add('collapsed');

        // scrollspy
        var links = Array.prototype.slice.call(list.querySelectorAll('a[data-target]'));
        var map = links.map(function (a) {
            return { a: a, t: document.getElementById(a.getAttribute('data-target')) };
        });
        function onScroll() {
            var pos = window.pageYOffset + 90;
            var cur = null;
            map.forEach(function (m) {
                if (m.t && m.t.offsetTop <= pos) cur = m;
            });
            links.forEach(function (a) {
                a.classList.remove('active');
            });
            if (cur) cur.a.classList.add('active');
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', build);
    } else {
        build();
    }
})();
