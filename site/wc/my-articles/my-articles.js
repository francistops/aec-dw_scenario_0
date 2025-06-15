class myArticles extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async loadContent() {
        const [html, css] = await Promise.all([
            fetch('/wc/my-articles/my-articles.html').then(res => res.text()),
            fetch('/wc/my-articles/my-articles.css').then(res => res.text())
        ]);

        const style = document.createElement('style');
        style.textContent = css;

        const template = document.createElement('template');
        template.innerHTML = html;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  
    async connectedCallback() {
        console.log('my-articles connecté');
        await this.loadContent();

        const createBtn = this.shadowRoot.getElementById('create-post');
        createBtn.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-create', {
                detail: { mode: 'create' },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(event);
            window.location.hash = '#createPost'
        });

        try {
            const response = await fetch("https://api.amelieroussin.ca/posts", {
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            const tableBodyTag = this.shadowRoot.querySelector('tbody');
            if (data.errorCode == 0) {
                data.rows.forEach((post, index) => {
                    this.addData(post);
                });
            } else {
                throw new Error(`API return non 0 error code`);
            }
        } catch (error) {
            console.log(`Oops: ${error}`);
        }
    }

    updateData(id, post) {
        const row = this.shadowRoot.getElementById(id);
        const columns = row.querySelectorAll('td');
        columns[0].innerHTML = post.title;
        columns[1].innerHTML = post.published != "null" ? '✓' : ' ';
        columns[2].innerHTML = post.created;
        columns[3].innerHTML = post.published != "null" ? post.published : ' ';
        columns[4].innerHTML = post.excert;
    }

    deleteData(id) {
        const row = this.shadowRoot.getElementById(id);
        row.remove();
    }

    addData(post) {
        const tableBodyTag = this.shadowRoot.querySelector('tbody');

        const trTag = document.createElement('tr');
        trTag.id = post.id;

        const tdTitle = document.createElement('td');
        tdTitle.innerHTML = post.title;
        const tdHasBeenPublished = document.createElement('td');
        if (post.published !== null) {
            tdHasBeenPublished.innerHTML = '✓';
        }
        const tdCreated = document.createElement('td');
        tdCreated.innerHTML = post.created;
        const tdPublished = document.createElement('td');
        tdPublished.innerHTML = post.published;
        const tdExcert = document.createElement('td');
        tdExcert.innerHTML = post.excert;

        const tdOperation = document.createElement('td');

        const operationUpdate = document.createElement('button');
        operationUpdate.innerHTML = 'Modifier';
        operationUpdate.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-update', {
                detail: {
                    id: post.id
                },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(event);
        });

        const operationDelete = document.createElement('button');
        operationDelete.innerHTML = 'Supprimer';
        operationDelete.addEventListener('click', (e) => {
            const event = new CustomEvent('ready-delete', {
                detail: {
                    id: post.id
                },
                bubbles: true,
                composed: true
            });

            this.dispatchEvent(event);
        });

        tdOperation.appendChild(operationUpdate);
        tdOperation.appendChild(operationDelete);

        trTag.appendChild(tdTitle);
        trTag.appendChild(tdHasBeenPublished);
        trTag.appendChild(tdCreated);
        trTag.appendChild(tdPublished);
        trTag.appendChild(tdExcert);
        trTag.appendChild(tdOperation);

        tableBodyTag.appendChild(trTag);
    }
}

customElements.define('my-articles', myArticles);
