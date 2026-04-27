function renderSPY(data) {
    const spy = data.find(d => d.symbol === "SPY");
    if (!spy) return;

    const priceEl = document.getElementById('spy-price');
    const deltaEl = document.getElementById('spy-delta');
    
    // 1. Get old price to determine "Flash" direction
    const oldPrice = parseFloat(priceEl.innerText.replace('$', '')) || 0;
    const newPrice = parseFloat(spy.price);

    // 2. Update Text
    priceEl.innerText = `$${newPrice.toFixed(2)}`;
    deltaEl.innerText = `${spy.delta.includes('-') ? '' : '+'}${spy.delta}`;

    // 3. Institutional Styling & Flash Effect
    const isNegative = spy.delta.includes('-');
    deltaEl.style.color = isNegative ? 'var(--bear-red)' : 'var(--bull-green)';

    if (newPrice > oldPrice) {
        priceEl.style.color = 'var(--bull-green)';
        setTimeout(() => priceEl.style.color = '#fff', 500);
    } else if (newPrice < oldPrice) {
        priceEl.style.color = 'var(--bear-red)';
        setTimeout(() => priceEl.style.color = '#fff', 500);
    }

    // 4. Update the "Last Synced" timestamp for the Silo
    const timeEl = document.getElementById('last-updated');
    if (timeEl) timeEl.innerText = new Date().toLocaleTimeString();
}
