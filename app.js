document.addEventListener('DOMContentLoaded', () => {
    // Theme toggling
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');

    // Update icons based on initial theme
    const updateIcons = () => {
        if (body.classList.contains('light-theme')) {
            darkIcon.style.display = 'block';
            lightIcon.style.display = 'none';
        } else {
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
        }
    };

    updateIcons();

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        }
        updateIcons();
    });

    // Navigation active state
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Add some playful interactivity to the stats
    const coinCount = document.getElementById('coin-count');
    const gemCount = document.getElementById('gem-count');

    // Small animation effect on initial load
    let coins = 0;
    let targetCoins = 1250;
    const coinInterval = setInterval(() => {
        if (coins < targetCoins) {
            coins += 25;
            if (coins > targetCoins) coins = targetCoins;
            coinCount.textContent = coins;
        } else {
            clearInterval(coinInterval);
        }
    }, 20);

    let gems = 0;
    let targetGems = 45;
    const gemInterval = setInterval(() => {
        if (gems < targetGems) {
            gems += 1;
            gemCount.textContent = gems;
        } else {
            clearInterval(gemInterval);
        }
    }, 50);
});
