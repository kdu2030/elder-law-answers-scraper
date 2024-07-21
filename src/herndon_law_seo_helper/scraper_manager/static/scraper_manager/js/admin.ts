class AdminMFE extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    console.log("Admin MFE connected!");
  }
}

customElements.define("hl-admin-mfe", AdminMFE);
