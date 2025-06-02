class HandlingLoginWC extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async loadContent() {
      const [html, css] = await Promise.all([
        fetch('/wc/handling-login/handling-login.html').then(res => res.text()),
        fetch('/wc/handling-login/handling-login.css').then(res => res.text())
      ]);
  
      const style = document.createElement('style');
      style.textContent = css;
  
      const template = document.createElement('template');
      template.innerHTML = html;
  
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async handleLogin() {
      const form = this.shadowRoot.getElementById('login-form');
      const { parseFormToObject } = await import("/script/utilform.js");

      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });

      const loginBtn = this.shadowRoot.getElementById('login-submit');
      loginBtn.innerHTML = 'Créer';
      loginBtn.addEventListener('click', async (e) => {
        const post = parseFormToObject(form);

        const response = await fetch('https://api.amelieroussin.ca/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(post)
        });

        const result = await response.json();
        console.log(result);

        const event = new CustomEvent('post-created', {
          detail: {
            result: result

          },
          bubbles: true,
          composed: true
        });

        this.dispatchEvent(event);
      });
    }
  
    async connectedCallback() {
        await this.loadContent();

        const cancelBtn = this.shadowRoot.getElementById('cancel');
        cancelBtn.addEventListener('click', (e) => {
            const event = new CustomEvent('cancel-action', {
                detail: { },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(event);
        });

        const mode = this.getAttribute('mode');

        if (mode === 'create') {
            this.handleLogin();
        } else if (mode === 'update') {
            const id = this.getAttribute('id');
            if (id !== undefined) {
                this.handleUpdate(id);
            }
            console.log('Ready to update');
        } else {
            throw new Error('Mode invalide');
        }

        }
  }
  
customElements.define('handling-login', HandlingLoginWC);