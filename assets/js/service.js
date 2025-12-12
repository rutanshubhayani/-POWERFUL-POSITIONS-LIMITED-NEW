document.addEventListener('DOMContentLoaded', async () => {
    // Load header and footer components for service page
    async function loadComponent(targetSelector, url) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Failed to fetch ${url} (${resp.status})`);
            let html = await resp.text();

            // Adjust paths for service page location (assets/pages/)
            // The component files have paths for root level, need to adjust for subdirectory
            html = html.replace(/href="index\.html/g, 'href="../../index.html');
            html = html.replace(/href="about\.html/g, 'href="../../about.html');
            html = html.replace(/href="contact\.html/g, 'href="../../contact.html');
            html = html.replace(/href="assets\/pages\/service\.html/g, 'href="service.html');
            html = html.replace(/href="assets\/pages\/terms\.html/g, 'href="terms.html');

            const container = document.querySelector(targetSelector);
            if (container) container.innerHTML = html;
        } catch (err) {
            console.error('Error loading component:', err);
        }
    }

    // Load components with adjusted paths
    await loadComponent('#site-header', '../component/header.html');
    await loadComponent('#site-footer', '../component/footer.html');
});

// Function to navigate to checkout with service/package details
function goToCheckout(type, name, price, period, features) {
    // Create URL parameters with service/package details
    const params = new URLSearchParams({
        type: type,
        name: name,
        price: price,
        period: period,
        features: JSON.stringify(features)
    });
    
    // Navigate to checkout page with parameters
    window.location.href = `checkout.html?${params.toString()}`;
}

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
