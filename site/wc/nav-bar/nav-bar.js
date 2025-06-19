import { isIdentified } from "../../script/auth.js";

/**
 * Changez ce code pour répondre à votre besoins
 */
class navBar extends HTMLElement {
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
        fetch('/wc/nav-bar/nav-bar.html').then(res => res.text()),
        fetch('/wc/nav-bar/nav-bar.css').then(res => res.text())
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

        const article_link = this.shadowRoot.getElementById('articles')
        const account_link = this.shadowRoot.getElementById('account')
      if (isIdentified()) {


        article_link.classList.remove('articles')
        account_link.classList.remove('account')
        
      } else {
        article_link.classList.add('articles')
        account_link.classList.add('account')
      }

        const loginButton = this.shadowRoot.querySelector('#loginButton');

        loginButton.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-login', {
              bubbles: true,
              composed: true
            });

            this.dispatchEvent(event);
        });
    }

    /**
     * Vous aurez peut-être besoins d'ajouter des élément supplémentaires ici
     */
  
  }
  
  /**
   * Changez le nom de manière adéquate
   */
  customElements.define('nav-bar', navBar);
  