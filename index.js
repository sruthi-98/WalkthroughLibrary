class Popper extends HTMLElement {
  #element;
  #body;
  #title;

  constructor(title, body, element) {
    super();
    this.#element = element;
    this.#body = body;
    this.#title = title;

    this.#setup();
  }

  #setup() {
    const popper = document.createElement("div");
    popper.classList.add("popper");

    const header = document.createElement("header");
    header.classList.add("popper__header");

    const title = document.createElement("h2");
    title.classList.add("popper__title");
    title.textContent = this.#title;

    const close = document.createElement("button");
    close.classList.add("popper__close");
    close.innerHTML = "&#10006";

    header.appendChild(title);
    header.appendChild(close);

    const body = document.createElement("p");
    body.classList.add("popper__body");
    body.textContent = this.#body;

    const footer = document.createElement("footer");
    footer.classList.add("popper__footer");

    const back = document.createElement("button");
    back.classList.add("popper__back");
    back.textContent = "Back";

    const next = document.createElement("button");
    next.classList.add("popper__next");
    next.textContent = "Next";

    footer.appendChild(back);
    footer.appendChild(next);

    popper.appendChild(header);
    popper.appendChild(body);
    popper.appendChild(footer);

    this.appendChild(popper);
  }
}

window.customElements.define("custom-popper", Popper);

export default class Walkthrough {
  #steps;

  constructor(steps) {
    this.#steps = steps;
  }

  start() {
    this.#steps.forEach(({ title = "", body, element }) => {
      const popper = new Popper(title, body, element);
      document.body.appendChild(popper);
    });
  }
}
