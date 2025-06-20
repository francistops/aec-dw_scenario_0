async function getHeartBeat() {
    const ctrl = new AbortController();

    // créer un `setTimeout` au lieu de faire un alert
    // ctrl.abort();
    const timeoutId = setTimeout(() => ctrl.abort(), 15000);

        const response = await fetch('https://api.amelieroussin.ca/heartbeat', {
            signal: ctrl.signal
        });

        clearTimeout(timeoutId); // annuler le timeout si la requête réussit

        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else if (response.status >= 500) {
            throw new Error('Server error');
        } else if (response.status >= 400) {
            throw new Error('Client error');
        }

        const data = await response.json();
        return data;
}