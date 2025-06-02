const BASE_API = 'https://api.amelieroussin.ca';
const listPostTag = document.querySelector('list-posts');

listPostTag.addEventListener('ready-delete', async (e) => {
    const url = `${BASE_API}/posts/${e.detail.id}`;

    const result = await fetch(url, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
    });

    if (result.ok) {
        const data = await result.json();
        if (data.errorCode == 0) {
            console.log('Suppression réussie');
            listPostTag.deleteData(e.detail.id);
        } else {
            console.log(`Échec de suppression: ${data.errorMessage} (${data.errorCode})`);
        }
    } else {
        console.log(`Échec de communcation: HTTP Status: ${result.status}`);
    }
});

listPostTag.addEventListener('ready-publish', async (e) => {
    const url = `${BASE_API}/posts/${e.detail.id}/publish`;

    const result = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
    });

    if (result.ok) {
        const data = await result.json();
        if (data.errorCode == 0) {
            console.log('Suppression réussie');
            listPostTag.publishData(e.detail.id);
        } else {
            console.log(`Échec de suppression: ${data.errorMessage} (${data.codeError})`);
        }
    } else {
        console.log(`Échec de communcation: HTTP Status: ${result.status}`);
    }
});

listPostTag.addEventListener('ready-create', (e) => {
    const handlingPostTag = document.createElement('handling-post');
    handlingPostTag.setAttribute('mode', 'create');
    handlingPostTag.addEventListener('post-created', (e) => {
        handlingPostTag.remove();
        listPostTag.classList.remove('invisible');
        listPostTag.addData(e.detail.result.data.post);
    });

    handlingPostTag.addEventListener('cancel-action', (e) => {
        handlingPostTag.remove();
        listPostTag.classList.remove('invisible');
    });
    
    listPostTag.classList.add('invisible');

    const mainTag = document.querySelector('main');
    mainTag.appendChild(handlingPostTag);
});

listPostTag.addEventListener('ready-update', (e) => {
    const handlingPostTag = document.createElement('handling-post');
    handlingPostTag.setAttribute('mode', 'update');
    handlingPostTag.setAttribute('id', e.detail.id);
    handlingPostTag.addEventListener('post-updated', (ev) => {
        handlingPostTag.remove();
        listPostTag.classList.remove('invisible');
        listPostTag.updateData(e.detail.id, ev.detail.data.post);
    });

    handlingPostTag.addEventListener('cancel-action', (e) => {
        handlingPostTag.remove();
        listPostTag.classList.remove('invisible');
    });
    
    listPostTag.classList.add('invisible');

    const mainTag = document.querySelector('main');
    mainTag.appendChild(handlingPostTag);
});