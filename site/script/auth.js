// recevoir le token and le storer in the client 

let currentUser = null



const BASE_URL =  "https://www.amelieroussin.com"

async function hashPassword(password) {
        let hashHex = '';
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.log(`error: ${error}`)
        }
        return hashHex;
    }

export async function subscribe(user) {
    let result = false;

    const subscribeResponse = await fetch(`${BASE_URL}/subscribe`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const subscribeJson = await subscribeResponse.json();

    if (subscribeResponse.ok) {
        if (subscribeResponse.errorCode == 0) {
            result = subscribeJson.subscribed;
        }
    } else {
        // TODO
        console.error('unhandle error in auth.js subscribeResponse')
    }
    
    return result;
}

export async function login(user) {
    console.log('in auth.js login')
    // currentUser = loginJson.user;
}

export async function logout() {
    console.log('in auth.js logout')
    let result = false;

    const logoutResponse = await fetch(`${BASE_URL}/logout`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(user)
    });

    return result
}

export async function getAllPosts() {
    console.log('in auth.js getAllPosts')
    let result = []
}