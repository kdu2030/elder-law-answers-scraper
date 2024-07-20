"use strict";
class AdminMFE extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log("Admin MFE connected!");
    }
}
customElements.define("hl-admin-mfe", AdminMFE);
