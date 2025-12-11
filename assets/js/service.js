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
