import { subscribe } from "../../script/auth.js";

/**
 * Changez ce code pour répondre à votre besoins
 */
class authSubs extends HTMLElement {
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
        fetch('/wc/auth-subs/auth-subs.html').then(res => res.text()),
        fetch('/wc/auth-subs/auth-subs.css').then(res => res.text())
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

        // const subscribeButton = this.shadowRoot.querySelector('#subscribeButton');
  
        // subscribeButton.addEventListener('click', (e) => {
 
        //   const emailInp = this.shadowRoot.getElementById('inpEmail').value;
        //   const passwordInp = this.shadowRoot.getElementById('inpPassword').value;
        //   const confirmPasswordInp = this.shadowRoot.getElementById('inpConfirmPassword').value;
        //   const firstNameInp = this.shadowRoot.getElementById('inpFirstName').value;
        //   const lastNameInp = this.shadowRoot.getElementById('inpLastName').value;

        //   console.log(emailInp, passwordInp, confirmPasswordInp, firstNameInp, lastNameInp);

        //   if (passwordInp === confirmPasswordInp) {
              
        //     const user = {
        //       email: emailInp,
        //       password: passwordInp,
        //       firstName: firstNameInp,
        //       lastName: lastNameInp
        //     }
        //     console.log('in auth-login WC user: ', user);

        //     const event = new CustomEvent('subscribed', {
        //       bubbles: true,
        //       composed: true,
        //       detail: { user }
        //     });

        //     this.dispatchEvent(event);

        //   } else {
        //     alert("The 2 password must be the same");
        //   }
        // });

        const form = this.shadowRoot.getElementById('subscribeForm');
        const submitInp = this.shadowRoot.getElementById('subscribeButton');
        const { parseFormToObject } = await import("/script/utilform.js");
  
        form.addEventListener('submit', (e) => {
          e.preventDefault();
        });
  
        submitInp.addEventListener('click', async (e) => {
          const user = parseFormToObject(form);
  
          console.log('in auth-subs WC user: ', user)
          
          user["passHash"] = user.password;
          
          console.log(user)
          
        
          const success = await subscribe(user);

  
          if (!success) {
            alert("Inscription échouée. Vérifiez vos informations.");
          }
        });
        
        const cancelButton = this.shadowRoot.querySelector('#cancelButton');

        cancelButton.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-cancel', {
              bubbles: true,
              composed: true,
              detail: {
                from: 'subscribe'
              }
            });

            this.dispatchEvent(event);
            
        });

    }  
  }

  customElements.define('auth-subs', authSubs);
  