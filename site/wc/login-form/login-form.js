class LoginFormWC extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
  }

  async loadContent() {
    const [html, css] = await Promise.all([
      fetch('/wc/login-form/login-form.html').then(res => res.text()),
      fetch('/wc/login-form/login-form.css').then(res => res.text())
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

    const loginBtn = this.shadowRoot.getElementById('login-submit');
    
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = this.shadowRoot.getElementById('login-email').value;
      console.log('in WC login-form input email: ', email);
      const password = this.shadowRoot.getElementById('login-password').value;
      console.log('in WC login-form input password: ', password);

      try {
        const response = await fetch("https://api.amelieroussin.ca/login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          //body: JSON.stringify({ email, password })
          body: JSON.stringify(email)
        });
        console.log(response)
        if (!response.ok) {
            throw new Error(`error: ${response.status}`);
          }
        // const result = await response.json();

        // const data = await response.json();

        // const divLoginForm = this.shadowRoot.querySelector('div');
        // if (data.errorCode == 0) {
        //   data.login.forEach((loginuser, index) => {
        //     this.listUsers(loginuser);
        //   });
        // } else {
        //   throw new Error(`API return: ${data}`);
        // }
      } catch (error) {
        console.log(`WC login-form catch: ${error}`)
      }
    });
 

    
    // should we salt the password before sending it to the api? yes because it exiting the user machine i guess...
    // is user valid? check if input email match an email in the db i guess i dont want to fetch the whole table just to check hmmm...
    //compare password with db password of the same id
    // if (password == dbInfo.password){

    

    // });
  }


    
}
customElements.define('login-form', LoginFormWC);