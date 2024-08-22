import inbound from './inbound.js';
import outbound from './outbound.js';

class home {
  constructor() {
    this.mainContainer = document.querySelector('main .container');
    this._init();
  }

  _init() {
    const appBar = document.querySelector('app-bar').shadowRoot;

    const inboundButton = appBar.querySelector('#inbound-button');
    const outboundButton = appBar.querySelector('#outbound-button');

    if (inboundButton && outboundButton) {
      inboundButton.addEventListener('click', () => {
        this._loadPage('inbound');
      });

      outboundButton.addEventListener('click', () => {
        this._loadPage('outbound');
      });
    } else {
      console.error('Buttons not found in the DOM.');
    }
  }

  _loadPage(page) {
    this.mainContainer.innerHTML = ''; // Clear the container before loading new content
    if (page === 'inbound') {
      inbound();
    } else if (page === 'outbound') {
      outbound();
    }
  }
}

export default home;
