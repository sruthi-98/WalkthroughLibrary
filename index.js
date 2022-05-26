class Popper extends HTMLElement {
  #stepIndex = 0;
  #steps;

  #title;
  #body;
  #back;
  #next;

  constructor(steps) {
    super();
    this.#steps = steps;
    this.#stepIndex = 0;

    this.onClose = this.onClose.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNext = this.onNext.bind(this);

    this.setup();
    this.setContent();
  }

  set stepIndex(index) {
    this.#stepIndex = index;
  }

  setup() {
    const popper = document.createElement("div");
    popper.classList.add("popper");

    const header = document.createElement("header");
    header.classList.add("popper__header");

    const title = document.createElement("h2");
    title.classList.add("popper__title");
    this.#title = title;

    const close = document.createElement("button");
    close.classList.add("popper__close");
    close.innerHTML = "&#10006";
    close.addEventListener("click", this.onClose);

    header.appendChild(title);
    header.appendChild(close);

    const body = document.createElement("p");
    body.classList.add("popper__body");
    this.#body = body;

    const footer = document.createElement("footer");
    footer.classList.add("popper__footer");

    const back = document.createElement("button");
    back.classList.add("popper__back");
    back.addEventListener("click", this.onBack);
    this.#back = back;

    const next = document.createElement("button");
    next.classList.add("popper__next");
    next.addEventListener("click", this.onNext);
    this.#next = next;

    footer.appendChild(back);
    footer.appendChild(next);

    popper.appendChild(header);
    popper.appendChild(body);
    popper.appendChild(footer);

    this.appendChild(popper);
  }

  setContent() {
    const currentStep = this.#steps[this.#stepIndex];
    this.#title.textContent = currentStep.title || "";
    this.#body.textContent = currentStep.body;
    this.#back.textContent = this.#stepIndex === 0 ? "Exit" : "Back";
    this.#next.textContent =
      this.#stepIndex === this.#steps.length - 1 ? "Done" : "Next";
  }

  onClose() {
    this.remove();
  }

  onBack() {
    if (this.#stepIndex === 0) this.onClose();
    else {
      this.#stepIndex = this.#stepIndex - 1;
      this.setContent();
    }
  }

  onNext() {
    if (this.#stepIndex === this.#steps.length - 1) this.onClose();
    else {
      this.#stepIndex = this.#stepIndex + 1;
      this.setContent();
    }
  }
}

window.customElements.define("custom-popper", Popper);

export default class Walkthrough {
  #steps;

  constructor(steps) {
    this.#steps = steps;
  }

  start() {
    const popper = new Popper(this.#steps);
    document.body.appendChild(popper);
  }
}
