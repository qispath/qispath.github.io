const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
            originalTitle: "",
            titleTimer: null,
            toastTimer: null,
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        this.originalTitle = document.title;
        window.addEventListener("scroll", this.handleScroll, true);
        window.addEventListener("focus", this.handleWindowFocus);
        window.addEventListener("blur", this.handleWindowBlur);
        document.addEventListener("pointerdown", this.handlePointerRipple, {
            passive: true,
        });
        this.render();
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll, true);
        window.removeEventListener("focus", this.handleWindowFocus);
        window.removeEventListener("blur", this.handleWindowBlur);
        document.removeEventListener("pointerdown", this.handlePointerRipple);
        if (this.titleTimer) {
            window.clearTimeout(this.titleTimer);
        }
        if (this.toastTimer) {
            window.clearTimeout(this.toastTimer);
        }
    },
    methods: {
        showToast(text) {
            let toast = document.getElementById("site-toast");
            if (!toast) {
                toast = document.createElement("div");
                toast.id = "site-toast";
                toast.className = "site-toast";
                document.body.appendChild(toast);
            }

            toast.textContent = text;
            toast.classList.add("show");
            if (this.toastTimer) {
                window.clearTimeout(this.toastTimer);
            }
            this.toastTimer = window.setTimeout(() => {
                toast.classList.remove("show");
                this.toastTimer = null;
            }, 1600);
        },
        async copyText(text) {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const input = document.createElement("textarea");
                    input.value = text;
                    input.setAttribute("readonly", "");
                    input.style.position = "absolute";
                    input.style.left = "-9999px";
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand("copy");
                    document.body.removeChild(input);
                }
                this.showToast("邮箱已复制");
            } catch (error) {
                this.showToast("复制失败，请手动复制：" + text);
            }
        },
        setPageTitle(text, duration = 0) {
            if (this.titleTimer) {
                window.clearTimeout(this.titleTimer);
                this.titleTimer = null;
            }
            document.title = text;
            if (duration > 0) {
                this.titleTimer = window.setTimeout(() => {
                    document.title = this.originalTitle;
                    this.titleTimer = null;
                }, duration);
            }
        },
        handleWindowFocus() {
            this.setPageTitle("哈喽哈喽(๑•̀ㅂ•́)و", 1800);
        },
        handleWindowBlur() {
            this.setPageTitle("加纳~");
        },
        handlePointerRipple(event) {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }
            if (event.button !== undefined && event.button !== 0 && event.pointerType !== "touch") {
                return;
            }
            if (event.clientX === 0 && event.clientY === 0) {
                return;
            }

            const ripple = document.createElement("span");
            ripple.className = "site-click-ripple";
            ripple.style.left = `${event.clientX}px`;
            ripple.style.top = `${event.clientY}px`;
            document.body.appendChild(ripple);
            ripple.addEventListener(
                "animationend",
                () => {
                    ripple.remove();
                },
                { once: true }
            );
        },
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
    },
});

app.mount("#layout");
