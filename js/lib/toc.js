/* Post table-of-contents: floating right sidebar, toggle hide/show, smooth scroll + scrollspy */
(function () {
    'use strict';

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function attr(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    }

    function build() {
        var content = document.querySelector('.article .content');
        var toc = document.getElementById('post-toc');
        var toggle = document.getElementById('post-toc-toggle');
        if (!content || !toc || !toggle) return;

        var list = toc.querySelector('.post-toc-list');
        var heads = content.querySelectorAll('h2[id], h3[id], h4[id]');
        if (!heads.length) {
            toc.style.display = 'none';
            toggle.style.display = 'none';
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

        function setOpen(open) {
            toc.classList.toggle('hidden', !open);
            toggle.classList.toggle('show', !open);
        }

        var closeBtn = toc.querySelector('.post-toc-close');
        if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
        toggle.addEventListener('click', function () { setOpen(true); });

        // wide screens: open by default; narrow: collapsed to the floating button
        setOpen(window.innerWidth >= 1320);

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
            links.forEach(function (a) { a.classList.remove('active'); });
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
