const JOKE_ENDPOINT = "https://icanhazdadjoke.com/";
const JOKE_TIMEOUT_MS = 8000;

// Part 1 sample items. Dad jokes fetched in Part 2 are added to this list.
const SAMPLE_FACTS = [
    {
        text: "I can juggle, and I built an app that analyzes juggling videos to give feedback.",
        detail: "Fact about Thomas · Hobbies",
    },
    {
        text: "I'm a 4th year computer science student at UC San Diego.",
        detail: "Fact about Thomas · School",
    },
    {
        text: "When I'm not coding, I'm usually playing video games, reading, or traveling.",
        detail: "Fact about Thomas · Free time",
    },
];

class FactPanel extends HTMLElement {
    static observedAttributes = ["compact"];

    items = SAMPLE_FACTS.map((fact) => ({ ...fact }));
    index = 0;
    els = null;

    connectedCallback() {
        if (this.els) return; // already rendered
        this.render();
        this.showItem();
        this.showCompact();
    }

    attributeChangedCallback(name) {
        if (name !== "compact" || !this.els) return;
        this.showCompact();
        this.dispatchEvent(new CustomEvent("compactchange", {
            detail: { compact: this.hasAttribute("compact") },
        }));
    }

    render() {
        const heading = document.createElement("h3");
        heading.textContent = "Fun facts & dad jokes";

        const card = document.createElement("figure");
        card.className = "fact-card";
        const text = document.createElement("blockquote");
        text.className = "fact-text";
        const detail = document.createElement("figcaption");
        detail.className = "fact-detail";
        card.appendChild(text);
        card.appendChild(detail);

        const controls = document.createElement("div");
        controls.className = "fact-controls";
        const prev = this.makeButton("Previous", () => this.move(-1));
        const next = this.makeButton("Next", () => this.move(1));
        const groan = this.makeButton("Make me groan", () => this.loadJoke());
        groan.classList.add("fact-groan");
        controls.appendChild(prev);
        controls.appendChild(next);
        controls.appendChild(groan);

        const status = document.createElement("p");
        status.className = "fact-status";
        status.setAttribute("role", "status");

        this.replaceChildren(heading, card, controls, status);
        this.els = { text, detail, prev, next, groan, status };
    }

    makeButton(label, onClick) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "fact-button";
        button.textContent = label;
        button.addEventListener("click", onClick);
        return button;
    }

    move(step) {
        const count = this.items.length;
        this.index = (this.index + step + count) % count;
        this.showItem();
    }

    showItem(message = "") {
        const item = this.items[this.index];
        const { text, detail, status } = this.els;
        text.textContent = item.text;
        detail.textContent = item.detail;
        status.classList.remove("is-error");
        status.textContent = `${message}Item ${this.index + 1} of ${this.items.length}`;
    }

    showCompact() {
        this.els.detail.hidden = this.hasAttribute("compact");
    }

    async loadJoke() {
        const { groan, status } = this.els;

        if (groan.getAttribute("aria-disabled") === "true") return;

        groan.setAttribute("aria-disabled", "true");
        this.setAttribute("aria-busy", "true");
        status.classList.remove("is-error");
        status.textContent = "Loading a dad joke…";

        try {
            const response = await fetch(JOKE_ENDPOINT, {
                headers: { Accept: "application/json" },
                signal: AbortSignal.timeout(JOKE_TIMEOUT_MS),
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();

            if (typeof data?.joke !== "string" || data.joke.trim() === "") {
                throw new Error("Expected a joke in the response.");
            }

            const id = typeof data.id === "string" ? ` ${data.id}` : "";
            this.items.push({
                text: data.joke.trim(),
                detail: `Dad joke${id} · icanhazdadjoke.com`,
            });
            this.index = this.items.length - 1;
            this.showItem("New dad joke added. ");
            groan.textContent = "Make me groan";
        } catch (error) {
            console.error("Could not load a dad joke.", error);
            status.classList.add("is-error");
            status.textContent = error.name === "TimeoutError"
                ? "The joke server took too long to answer. Try again."
                : "Couldn't load a dad joke. Check your connection and try again.";
            groan.textContent = "Try again";
        } finally {
            groan.removeAttribute("aria-disabled");
            this.removeAttribute("aria-busy");
        }
    }
}

customElements.define("fact-panel", FactPanel);

const MODE_KEY = "hw5-fact-panel-mode";
const MODES = ["expanded", "compact"];
const DEFAULT_MODE = "expanded";

function readSavedMode() {
    try {
        const saved = localStorage.getItem(MODE_KEY);
        return MODES.includes(saved) ? saved : DEFAULT_MODE;
    } catch (error) {
        console.warn("Could not read the fact panel preference.", error);
        return DEFAULT_MODE;
    }
}

function saveMode(mode) {
    try {
        localStorage.setItem(MODE_KEY, mode);
    } catch (error) {
        console.warn("Could not save the fact panel preference.", error);
    }
}

const factPanel = document.querySelector("fact-panel");
const compactButton = document.querySelector("#toggle-fact-compact");

if (factPanel && compactButton) {
    const syncButton = () => {
        const compact = factPanel.hasAttribute("compact");
        compactButton.textContent = compact ? "Show item details" : "Hide item details";
    };

    const applyMode = (mode) => {
        factPanel.toggleAttribute("compact", mode === "compact");
    };

    compactButton.addEventListener("click", () => {
        const mode = factPanel.hasAttribute("compact") ? "expanded" : "compact";
        applyMode(mode);
        saveMode(mode);
    });
    factPanel.addEventListener("compactchange", syncButton);

    applyMode(readSavedMode());
    syncButton();
    compactButton.hidden = false; // only useful once JavaScript is running
}
