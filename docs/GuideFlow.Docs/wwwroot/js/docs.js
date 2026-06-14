/* ============================================
   GuideFlow Docs - Interactive Features
   ============================================ */

(function () {
    'use strict';

    // ---- Copy buttons ----
    function initCopyButtons() {
        document.querySelectorAll('.docs-code-block__copy').forEach(function (btn) {
            if (btn._bound) return;
            btn._bound = true;
            btn.addEventListener('click', function () {
                var code = btn.closest('.docs-code-block').querySelector('.docs-code-block__code');
                if (!code) return;
                navigator.clipboard.writeText(code.textContent).then(function () {
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    setTimeout(function () {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                });
            });
        });
    }

    // ---- Mobile sidebar toggle ----
    function initSidebar() {
        var toggle = document.querySelector('.docs-sidebar-toggle');
        var sidebar = document.querySelector('.docs-sidebar');
        var overlay = document.querySelector('.docs-sidebar-overlay');
        if (!toggle || !sidebar) return;

        function openSidebar() {
            sidebar.classList.add('open');
            if (overlay) overlay.classList.add('visible');
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('visible');
        }

        toggle.addEventListener('click', function () {
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });

        if (overlay) overlay.addEventListener('click', closeSidebar);

        sidebar.querySelectorAll('.docs-sidebar__link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 860) closeSidebar();
            });
        });
    }

    // ---- Right-side Table of Contents ----
    function initTOC() {
        var content = document.querySelector('.docs-content');
        var tocContainer = document.querySelector('.docs-toc');
        if (!content || !tocContainer) return;

        var headings = content.querySelectorAll('h2[id], h3[id]');
        if (headings.length === 0) {
            tocContainer.style.display = 'none';
            var main = document.querySelector('.docs-main');
            if (main) main.style.marginRight = '0';
            return;
        }

        // Show TOC and restore margin
        tocContainer.style.display = '';
        var main = document.querySelector('.docs-main');
        if (main) main.style.marginRight = '';

        var list = tocContainer.querySelector('.docs-toc__list');
        if (!list) return;
        list.innerHTML = '';

        headings.forEach(function (h) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + h.id;
            a.className = 'docs-toc__link' + (h.tagName === 'H3' ? ' docs-toc__link--h3' : '');
            a.textContent = h.textContent.replace(/#$/, '').trim();
            a.dataset.target = h.id;
            li.appendChild(a);
            list.appendChild(li);
        });

        var tocLinks = list.querySelectorAll('.docs-toc__link');

        // IntersectionObserver for active state
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    tocLinks.forEach(function (link) {
                        link.classList.toggle('active', link.dataset.target === entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

        headings.forEach(function (h) { observer.observe(h); });

        // Smooth scroll on TOC click
        tocLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var target = document.getElementById(link.dataset.target);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', '#' + link.dataset.target);
                }
            });
        });
    }

    // ---- Theme toggle (global, called from onclick) ----
    window.toggleDocsTheme = function () {
        var html = document.documentElement;
        var current = html.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('docs-theme', next);
    };

    // ---- Fetch GitHub stars ----
    function fetchGitHubStars() {
        var countEl = document.getElementById('github-stars-count');
        if (!countEl) return;

        // Try cache first (1 hour)
        var cached = null;
        try {
            cached = JSON.parse(localStorage.getItem('github-stars-cache'));
        } catch (e) {}
        if (cached && Date.now() - cached.ts < 3600000) {
            countEl.textContent = formatStars(cached.count);
            return;
        }

        fetch('https://api.github.com/repos/MiracleFoundation/GuideFlow')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.stargazers_count != null) {
                    countEl.textContent = formatStars(data.stargazers_count);
                    try {
                        localStorage.setItem('github-stars-cache', JSON.stringify({
                            count: data.stargazers_count,
                            ts: Date.now()
                        }));
                    } catch (e) {}
                }
            })
            .catch(function () {
                countEl.textContent = '';
            });
    }

    function formatStars(n) {
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    }

    // ---- Expose for Blazor JS interop ----
    window.GuideFlowDocs = {
        copyToClipboard: function (text) {
            return navigator.clipboard.writeText(text)
                .then(function () { return true; })
                .catch(function () { return false; });
        },
        initTOC: initTOC,
        initCopyButtons: initCopyButtons,
        highlightAll: function () {
            if (typeof Prism !== 'undefined') Prism.highlightAll();
        },
        highlightBlock: function (element) {
            if (typeof Prism === 'undefined' || !element) return;
            // Ensure grammar is loaded before highlighting
            var lang = element.className.match(/language-(\w+)/);
            var grammar = lang && Prism.languages[lang[1]];
            if (grammar) {
                Prism.highlightElement(element);
            } else {
                // Fallback: try with markup if requested grammar not found
                element.className = element.className.replace(/language-\w+/, 'language-markup');
                Prism.highlightElement(element);
            }
        }
    };

    // ---- Init on DOM ready ----
    function init() {
        initCopyButtons();
        initSidebar();
        initTOC();
        fetchGitHubStars();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-init after Blazor enhanced navigation
    document.addEventListener('blazorenhancedload', function () {
        setTimeout(function () {
            init();
            if (typeof Prism !== 'undefined') Prism.highlightAll();
        }, 100);
    });
})();
