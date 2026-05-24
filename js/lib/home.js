mixins.home = {
    data() {
        return {
            homeTypewriterContext: null,
            homeTypewriterTimer: null,
        };
    },
    mounted() {
        let background = this.$refs.homeBackground;
        let images = background.dataset.images.split(",");
        let id = Math.floor(Math.random() * images.length);
        background.style.backgroundImage = `url('${images[id]}')`;
        this.menuColor = true;
        this.initHomeTypewriter();
    },
    beforeUnmount() {
        this.clearHomeTypewriterTimer();
    },
    methods: {
        homeClick() {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        },
        clearHomeTypewriterTimer() {
            if (this.homeTypewriterTimer) {
                window.clearTimeout(this.homeTypewriterTimer);
                this.homeTypewriterTimer = null;
            }
        },
        scheduleHomeTypewriter(delay) {
            this.clearHomeTypewriterTimer();
            this.homeTypewriterTimer = window.setTimeout(() => {
                this.tickHomeTypewriter();
            }, delay);
        },
        parseHomeTypewriterData(rawValue, fallback) {
            if (!rawValue) return fallback;
            try {
                return JSON.parse(decodeURIComponent(rawValue));
            } catch (error) {
                return fallback;
            }
        },
        updateHomeTypewriterText(element, text) {
            const target = element.querySelector(".typed-text");
            if (target) target.textContent = text;
        },
        initHomeTypewriter() {
            const element = this.$refs.homeTypedLine;
            if (!element) return;

            const texts = this.parseHomeTypewriterData(element.dataset.typewriterTexts, []);
            const options = Object.assign(
                {
                    enable: true,
                    typeSpeed: 120,
                    backSpeed: 46,
                    startDelay: 300,
                    backDelay: 1400,
                    loop: true,
                },
                this.parseHomeTypewriterData(element.dataset.typewriterOptions, {}),
            );

            element.classList.add("typewriter-ready");
            if (!Array.isArray(texts) || texts.length === 0) return;

            this.updateHomeTypewriterText(element, options.enable ? "" : texts[0]);
            if (!options.enable) return;

            this.homeTypewriterContext = {
                element,
                options,
                texts,
                state: {
                    charIndex: 0,
                    deleting: false,
                    textIndex: 0,
                },
            };
            this.scheduleHomeTypewriter(options.startDelay);
        },
        tickHomeTypewriter() {
            const context = this.homeTypewriterContext;
            if (!context) return;

            const { element, options, state, texts } = context;
            const currentText = texts[state.textIndex] || "";
            if (!currentText) return;

            if (!state.deleting) {
                state.charIndex = Math.min(currentText.length, state.charIndex + 1);
                this.updateHomeTypewriterText(element, currentText.slice(0, state.charIndex));

                if (state.charIndex >= currentText.length) {
                    const hasNext = options.loop || state.textIndex < texts.length - 1;
                    if (!hasNext) return;
                    state.deleting = true;
                    this.scheduleHomeTypewriter(options.backDelay);
                    return;
                }

                this.scheduleHomeTypewriter(options.typeSpeed);
                return;
            }

            state.charIndex = Math.max(0, state.charIndex - 1);
            this.updateHomeTypewriterText(element, currentText.slice(0, state.charIndex));

            if (state.charIndex <= 0) {
                state.deleting = false;
                if (state.textIndex < texts.length - 1) state.textIndex += 1;
                else if (options.loop) state.textIndex = 0;
                else return;

                this.scheduleHomeTypewriter(Math.max(80, Math.round(options.typeSpeed * 0.75)));
                return;
            }

            this.scheduleHomeTypewriter(options.backSpeed);
        },
    },
};
