/**
 * Changez ce code pour répondre à votre besoins
 */
class userAccount extends HTMLElement {
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
        fetch('/wc/user-account/user-account.html').then(res => res.text()),
        fetch('/wc/user-account/user-account.css').then(res => res.text())
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
  
        const accountButton = this.shadowRoot.querySelector('#updateUser');

        accountButton.addEventListener('click', (e) => {
            const event = new CustomEvent('update-account', {
              bubbles: true,
              composed: true
            });

            this.dispatchEvent(event);
        });  

        const passwordUpdate = this.shadowRoot.querySelector('#updatePassword');

        passwordUpdate.addEventListener('click', (e) => {
            const event = new CustomEvent('update-password', {
              bubbles: true,
              composed: true
            });

            this.dispatchEvent(event);
        });  

        const deleteAccountButton = this.shadowRoot.querySelector('#deleteAccount');

        deleteAccountButton.addEventListener('click', (e) => {
            const event = new CustomEvent('delete-account', {
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
  customElements.define('user-account', userAccount);
  