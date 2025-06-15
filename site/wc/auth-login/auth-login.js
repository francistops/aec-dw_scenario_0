import { login } from "../../script/auth.js";

class authLogin extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      /**
       * Initialiser vos propriétés nécesaire
       */
    }

    async loadContent() {
        /**
         * Renommez vos fichiers selon votre composant à vous
         */
      const [html, css] = await Promise.all([
        fetch('/wc/auth-login/auth-login.html').then(res => res.text()),
        fetch('/wc/auth-login/auth-login.css').then(res => res.text())
      ]);
  
      const style = document.createElement('style');
      style.textContent = css;
  
      const template = document.createElement('template');
      template.innerHTML = html;
  
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  
    async connectedCallback() {
      await this.loadContent();

        const loginButton = this.shadowRoot.querySelector('#subsButton');

        loginButton.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-subscribe', {
              bubbles: true,
              composed: true
            });

            this.dispatchEvent(event);
            // Il manque à faire apparaitre le #subscribe dans la bar pour réussir à afficher la page
        });
      const form = this.shadowRoot.getElementById('action-post');
      const submitInp = this.shadowRoot.getElementById('inpSubmit');
      const { parseFormToObject } = await import("/script/utilform.js");

      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });

        submitInp.addEventListener('click', async (e) => {
          const user = parseFormToObject(form);
          // const emailInp = this.shadowRoot.getElementById('inpEmail').value;
          // const passwordInp = this.shadowRoot.getElementById('inpPassword').value;
          // console.log(emailInp, passwordInp)

        // const user = {
        // email: emailInp,
        // passHash: passwordInp
        // }
        console.log('in auth-login WC user: ', user)
        login(user)
      });
    }
  }
  
  customElements.define('auth-login', authLogin);
  