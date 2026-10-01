
        const surpriseButton = document.querySelector(".surprise-button");
        const openingCover = document.querySelector(".opening-cover");
        const music = document.querySelector("audio");
        const greetingButton = document.querySelector(".greeting-button");
        const greetingCallout = document.querySelector(".greeting-callout");
        const greetingAudio = document.querySelector(".greeting-audio");
        const hoorayCueTime = 9.5;
        let hoorayConfettiShown = false;

        function launchSideConfetti() {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            const colors = ["#f94144", "#f9c74f", "#43aa8b", "#577590", "#f3722c", "#f15bb5"];
            const confetti = document.createDocumentFragment();

            for (let index = 0; index < 100; index++) {
                const fromRight = index % 2 === 1;
                const distance = 30 + Math.random() * 55;
                const piece = document.createElement("span");
                piece.className = "confetti-piece side-confetti-piece";
                piece.style.left = fromRight ? "100vw" : "0";
                piece.style.setProperty("--burst-top", "100vh");
                piece.style.setProperty("--burst-x", `${fromRight ? -distance : distance}vw`);
                piece.style.setProperty("--burst-y", `${-(45 + Math.random() * 45)}vh`);
                piece.style.setProperty("--burst-duration", `${2 + Math.random() * 1.4}s`);
                piece.style.setProperty("--spin", `${Math.random() * 900 - 450}deg`);
                piece.style.backgroundColor = colors[index % colors.length];
                confetti.appendChild(piece);
            }

            document.body.appendChild(confetti);
            window.setTimeout(() => {
                document.querySelectorAll(".side-confetti-piece").forEach((piece) => piece.remove());
            }, 3000);
        }

        surpriseButton.addEventListener("click", () => {
            openingCover.classList.add("is-opening");
            surpriseButton.classList.add("is-hidden");
            music.play().catch(() => {});
            window.setTimeout(() => {
                const contentDivs = document.querySelectorAll("div:not(.background-scroll):not(.opening-cover)");
                if (!("IntersectionObserver" in window)) {
                    contentDivs.forEach((div) => div.classList.add("is-revealed"));
                    return;
                }

                const observer = new IntersectionObserver((entries, currentObserver) => {
                    const visibleEntries = entries.filter((entry) => entry.isIntersecting);
                    visibleEntries.forEach((entry, index) => {
                        entry.target.style.setProperty("--reveal-delay", `${index * 140}ms`);
                        entry.target.classList.add("is-revealed");
                        currentObserver.unobserve(entry.target);
                    });
                }, { threshold: 0.1 });

                contentDivs.forEach((div) => observer.observe(div));
            }, 1000);

            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                const colors = ["#f94144", "#f9c74f", "#43aa8b", "#577590", "#f3722c", "#f15bb5"];
                const confetti = document.createDocumentFragment();

                for (let index = 0; index < 90; index++) {
                    const piece = document.createElement("span");
                    piece.className = "confetti-piece";
                    piece.style.left = `${Math.random() * 100}vw`;
                    piece.style.backgroundColor = colors[index % colors.length];
                    piece.style.setProperty("--fall-duration", `${2.4 + Math.random() * 2.2}s`);
                    piece.style.setProperty("--fall-delay", `${Math.random() * 0.8}s`);
                    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
                    piece.style.setProperty("--spin", `${Math.random() * 900 - 450}deg`);
                    confetti.appendChild(piece);
                }

                document.body.appendChild(confetti);
                window.setTimeout(() => {
                    document.querySelectorAll(".confetti-piece").forEach((piece) => piece.remove());
                }, 5500);
            }
        });

        greetingButton.addEventListener("click", () => {
            if (greetingAudio.paused) {
                greetingAudio.play().then(() => {
                    greetingButton.textContent = "Pause greeting";
                }).catch(() => {
                    greetingButton.classList.remove("is-playing");
                    greetingButton.textContent = "Greeting audio not found";
                });
                return;
            }

            greetingAudio.pause();
            greetingButton.textContent = "Play greeting";
        });

        greetingAudio.addEventListener("playing", () => {
            greetingButton.classList.add("is-playing");
            greetingCallout.classList.add("is-playing");
        });

        greetingAudio.addEventListener("pause", () => {
            greetingButton.classList.remove("is-playing");
            if (!greetingAudio.ended) {
                greetingButton.textContent = "Play greeting";
            }
        });

        greetingAudio.addEventListener("ended", () => {
            greetingButton.classList.remove("is-playing");
            greetingButton.textContent = "Play greeting";
            hoorayConfettiShown = false;
        });

        greetingAudio.addEventListener("timeupdate", () => {
            if (!hoorayConfettiShown && greetingAudio.currentTime >= hoorayCueTime) {
                hoorayConfettiShown = true;
                launchSideConfetti();
            }
        });
