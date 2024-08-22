class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  _updateStyle() {
    this._style.textContent = `
    :host {
      display: block;
      width: 100%;
      color: white;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
    }

    .app-contain {
      display: flex;
      justify-content: space-between; /* Menempatkan elemen di kiri dan kanan */
      align-items: center; /* Vertikal alignment ke tengah */
      padding: 24px 20px;
    }

    .title {
      margin: 0;
      font-size: 1.7em;
    }
    
    .app-button button {
      margin-left: 10px; /* Jarak antar tombol */
    }
  `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = '';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="app-contain">
        </h1 class="title">WMS Infinitigroup 4.0</h1>

        <div class="app-button">
          <button id="inbound-button">Inbound Page</button>
          <button id="outbound-button">Outbound Page</button>
        </div>
      </div>
    `;
  }
}

customElements.define('app-bar', AppBar);