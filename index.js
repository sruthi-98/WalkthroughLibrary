class Popper extends HTMLElement {
  #stepIndex = 0;
  #steps;

  #popper;
  #title;
  #body;
  #back;
  #next;
  #target;

  constructor(steps) {
    super();
    this.#steps = steps;
    this.#stepIndex = 0;

    this.onClose = this.onClose.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onNext = this.onNext.bind(this);
    this.highlightTargetElement = this.highlightTargetElement.bind(this);
    this.positionPopper = this.positionPopper.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);

    this.setup();
    this.setContent();
    this.highlightTargetElement();
    this.positionPopper();
  }

  connectedCallback() {
    window.addEventListener("scroll", this.positionPopper);
    window.addEventListener("resize", this.resizeHandler);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.positionPopper);
    window.removeEventListener("resize", this.resizeHandler);
  }

  set stepIndex(index) {
    this.#stepIndex = index;
  }

  getCurrentElement() {
    return this.#steps[this.#stepIndex].element;
  }

  resizeHandler() {
    this.highlightTargetElement();
    this.positionPopper();
  }

  highlightTargetElement() {
    const currentElement = this.getCurrentElement();

    if (!currentElement) return;

    // Posiitoning the target element with a mirror element
    currentElement.scrollIntoView({ behaviour: "smooth" });
    const currentElementRect = currentElement.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    this.#target.style = `
        top: ${scrollTop + currentElementRect.top}px;
        right: ${currentElementRect.right}px;
        bottom: ${currentElementRect.bottom}px;
        left: ${currentElementRect.left}px;
        width: ${currentElementRect.width}px;
        height: ${currentElementRect.height}px;
      `;
    document.body.appendChild(this.#target);
  }

  positionPopper() {
    const currentElement = this.getCurrentElement();

    // Center fixed position when element is not defined
    if (!currentElement) {
      this.#popper.style = "";
      this.#popper.classList.add("center");
      return;
    }

    const currentElementRect = currentElement.getBoundingClientRect();
    const popperRect = this.#popper.getBoundingClientRect();
    const windowHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop;
    const popperPlacement =
      currentElementRect.bottom + popperRect.height > windowHeight
        ? "top"
        : "bottom";

    this.#popper.style = `
    top: ${
      scrollTop +
      (popperPlacement === "top"
        ? currentElementRect.top - popperRect.height
        : currentElementRect.bottom)
    }px;
      left: ${
        currentElementRect.left +
        (currentElementRect.width - popperRect.width) / 2
      }px;
    `;
  }

  setup() {
    const popper = document.createElement("div");
    popper.classList.add("popper");
    this.#popper = popper;

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

    const target = document.createElement("div");
    target.classList.add("popper__target");
    this.#target = target;
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
    this.#target.remove();
    this.remove();
  }

  onBack() {
    if (this.#stepIndex === 0) {
      this.onClose();
      return;
    }

    const currentElement = this.getCurrentElement();
    if (currentElement) this.#target.remove();
    else this.#popper.classList.remove("center");
    this.#stepIndex = this.#stepIndex - 1;
    this.setContent();
    this.highlightTargetElement();
    this.positionPopper();
  }

  onNext() {
    if (this.#stepIndex === this.#steps.length - 1) {
      this.onClose();
      return;
    }

    const currentElement = this.getCurrentElement();
    if (currentElement) this.#target.remove();
    else this.#popper.classList.remove("center");
    this.#stepIndex = this.#stepIndex + 1;
    this.setContent();
    this.highlightTargetElement();
    this.positionPopper();
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
