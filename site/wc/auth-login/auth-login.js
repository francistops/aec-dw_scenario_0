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

        const cancelButton = this.shadowRoot.querySelector('#cancelButton');

        cancelButton.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-cancel', {
              bubbles: true,
              composed: true,
              detail: {
                from: 'login'
              }
            });

            this.dispatchEvent(event);
        });


      const readySubsButton = this.shadowRoot.querySelector('#readySubsButton');

      readySubsButton.addEventListener('click', (e) => {
        const event = new CustomEvent('go-to-auth-subs', {
          bubbles: true,
          composed: true
        });

        this.dispatchEvent(event);
      });
    
      const submitInp = this.shadowRoot.getElementById('inpSubmit');

      submitInp.addEventListener('click', (e) => {
        const emailInp = this.shadowRoot.getElementById('inpEmail').value;
        const passwordInp = this.shadowRoot.getElementById('inpPassword').value;
        console.log(emailInp, passwordInp)

        const user = {
        email: emailInp,
        password: passwordInp
        }
        console.log('in auth-login WC user: ', user)
        login(user);
      });
    }
  }
  
  customElements.define('auth-login', authLogin);
  