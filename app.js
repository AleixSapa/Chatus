document.addEventListener('DOMContentLoaded', () => {

    // Configurar connexió a Supabase
    const supabaseUrl = 'https://uleazvxwslhpgneriipt.supabase.co';
    const supabaseKey = 'sb_publishable_gRs0QcH_VlnwhK2vvNNrIg_lPCzYENf';
    let supabaseClient = null;
    try {
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.error("No es pot connectar a Supabase. Mira l'enllaç de la llibreria.");
    }

    async function loadRealRanking() {
        if(!supabaseClient) return;
        
        try {
            const { data: users, error } = await supabaseClient
                .from('users')
                .select('*')
                .order('xp', { ascending: false })
                .limit(3);
                
            if (error) throw error;
            
            if (users && users.length > 0) {
                const rankingContainer = document.querySelector('#view-ranking .friends-list');
                rankingContainer.innerHTML = ''; // Eliminar els falsos
                const medals = ['Or', 'Plata', 'Bronze'];
                const colors = ['#FBBF24', '#cbd5e1', '#b45309'];
                
                users.forEach((user, idx) => {
                    rankingContainer.innerHTML += `
                        <li style="background: rgba(0,0,0,0.15); border: 1px solid ${colors[idx]}; padding: 15px;">
                            <strong style="color: ${colors[idx]}; font-size: 24px; min-width: 40px;">#${idx + 1}</strong>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}" alt="Top ${idx + 1}" style="width: 50px; height: 50px; background: ${colors[idx]}; border-radius: 50%;">
                            <div class="friend-info" style="flex: 1;">
                                <span style="font-size: 20px;">${user.username}</span>
                                <small>Nivell: ${user.level_name} (${user.xp} XP)</small>
                            </div>
                            <div class="score"><i class="fa-solid fa-${idx === 0 ? 'trophy' : 'medal'}" style="color: ${colors[idx]};"></i> ${medals[idx]}</div>
                        </li>
                    `;
                });
            }
        } catch(e) {
            console.warn("⚠️ ERROR 400: La connexió de Supabase ha fallat. Això normalment passa perquè la clau (anon key) proporcionada no és vàlida per defecte. Hauria de començar per eyJ... Pots canviar-la a l'arxiu app.js a la línia 5:", e);
        }
    }

    // Cridar-ho al començar
    loadRealRanking();

    // Lògica d'Autenticació
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authSection = document.getElementById('auth-section');
    const appDashboard = document.getElementById('app-dashboard');
    const displayUsername = document.getElementById('display-username');
    const welcomeName = document.getElementById('welcome-name');
    const avatarImg = document.getElementById('user-avatar-img');
    const authError = document.getElementById('auth-error');

    // Alterna entre login i registre
    document.getElementById('go-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        registerForm.style.flexDirection = 'column';
    });
    document.getElementById('go-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
        loginForm.style.flexDirection = 'column';
    });

    // Funció que mostra l'aplicació un cop autenticat
    function enterApp(username) {
        displayUsername.textContent = username;
        welcomeName.textContent = username;
        avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        document.getElementById('profile-avatar').src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        document.getElementById('profile-username').textContent = username;
        authSection.style.display = 'none';
        appDashboard.style.display = 'flex';
        localStorage.setItem('chatus_user', username);
        setTimeout(() => window.showToast && window.showToast(`Benvingut/da, ${username}! Som-hi! 🚀`), 500);
    }

    // Recuperar sessió guardada
    const savedUser = localStorage.getItem('chatus_user');
    if (savedUser) enterApp(savedUser);

    // Login
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        if (!username || !password) {
            authError.textContent = "Omple tots els camps!";
            authError.style.display = 'block';
            return;
        }
        authError.style.display = 'none';
        enterApp(username);
    });

    // Registre
    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const pass1 = document.getElementById('reg-password').value;
        const pass2 = document.getElementById('reg-password2').value;
        if (!username) {
            authError.textContent = "Has d'escriure un nom d'usuari!";
            authError.style.display = 'block'; return;
        }
        if (pass1 !== pass2) {
            authError.textContent = "Les contrasenyes no coincideixen!";
            authError.style.display = 'block'; return;
        }
        if (pass1.length < 4) {
            authError.textContent = "La contrasenya ha de tenir almenys 4 caràcters!";
            authError.style.display = 'block'; return;
        }
        authError.style.display = 'none';
        enterApp(username);
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('chatus_user');
        appDashboard.style.display = 'none';
        authSection.style.display = 'flex';
        loginForm.style.display = 'flex';
        loginForm.style.flexDirection = 'column';
        registerForm.style.display = 'none';
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    });

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

    // Navigation active state and view switching
    const navItems = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update sidebar active class
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch view content
            const targetSection = item.querySelector('a').getAttribute('data-section');
            
            views.forEach(view => {
                view.style.display = 'none';
                view.classList.remove('active');
            });

            const targetView = document.getElementById('view-' + targetSection);
            if (targetView) {
                targetView.style.display = 'flex';
                targetView.classList.add('active');
            }
        });
    });

    // Add some playful interactivity to the stats
    const coinCount = document.getElementById('coin-count');
    const gemCount = document.getElementById('gem-count');

    // Small animation effect on initial load
    let coins = 0;
    let targetCoins = 0;
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
    let targetGems = 0;
    const gemInterval = setInterval(() => {
        if (gems < targetGems) {
            gems += 1;
            gemCount.textContent = gems;
        } else {
            clearInterval(gemInterval);
        }
    }, 50);

    // Toast Notification System
    window.showToast = (message) => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-gamepad" style="color: var(--neon-pink);"></i> ${message}`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // Botó de multijugador del club
    document.querySelectorAll('.btn-multiplayer').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast("Convidant membres del Club... 🚀");
        });
    });

    // AI Chat interactive implementation
    const chatInput = document.querySelector('.chat-input-area input');
    const btnSend = document.querySelector('.btn-send');
    const chatMessages = document.querySelector('.chat-messages');

    if(btnSend && chatInput && chatMessages) {
        const sendMsg = () => {
            const text = chatInput.value.trim();
            if(!text) return;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user-message';
            userMsg.innerHTML = `
                <div class="msg-bubble">${text}</div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aleix" alt="User">
            `;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'message ai-message';
                aiMsg.innerHTML = `
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Chatu" alt="Chatu">
                    <div class="msg-bubble">Processant... Aquest és un prototip de la plataforma! Més endavant aquí em podré connectar amb ChatGPT per generar-te nivells reals! Sóc la Chatu! 🤖</div>
                `;
                chatMessages.appendChild(aiMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 800);
        };

        btnSend.addEventListener('click', sendMsg);
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMsg();
        });
    }

    // --- SNAKE GAME LOGIC ---
    const modal = document.getElementById('game-modal');
    const closeBtn = document.getElementById('close-game');
    const startBtn = document.getElementById('start-game-btn');
    const canvas = document.getElementById('snake-game');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('snake-score');

    let snake = [];
    let food = {};
    let d = "RIGHT";
    let score = 0;
    let gameLoop;
    const box = 20;

    // Botó Snake directe per ID
    document.getElementById('btn-snake')?.addEventListener('click', () => {
        modal.style.display = 'flex';
        initGame();
        gameLoop = setInterval(drawGame, 100);
    });

    // Pac-Man i Space Invaders: avisen que aviat estaran disponibles
    document.getElementById('btn-pacman')?.addEventListener('click', () => {
        showToast('🕹️ Pac-Man s\'implementarà aviat. Prova el Snake mentre!');
    });
    document.getElementById('btn-space')?.addEventListener('click', () => {
        showToast('🚀 Space Invaders s\'implementarà aviat. Prova el Snake mentre!');
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        clearInterval(gameLoop);
    });

    startBtn.addEventListener('click', () => {
        clearInterval(gameLoop);
        initGame();
        gameLoop = setInterval(drawGame, 100);
    });

    document.addEventListener("keydown", direction);

    function direction(event){
        if(event.keyCode == 37 && d != "RIGHT"){ d = "LEFT"; }
        else if(event.keyCode == 38 && d != "DOWN"){ d = "UP"; }
        else if(event.keyCode == 39 && d != "LEFT"){ d = "RIGHT"; }
        else if(event.keyCode == 40 && d != "UP"){ d = "DOWN"; }
    }

    function initGame() {
        snake = [{x: 9 * box, y: 10 * box}];
        food = {
            x: Math.floor(Math.random()*19+1) * box,
            y: Math.floor(Math.random()*19+1) * box
        };
        score = 0;
        d = "RIGHT";
        scoreEl.textContent = score;
        drawInitialState();
    }

    function drawInitialState() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = "#10B981";
        ctx.fillRect(snake[0].x, snake[0].y, box, box);
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);
    }

    function drawGame(){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 400, 400);
        
        for(let i = 0; i < snake.length; i++){
            ctx.fillStyle = (i == 0) ? "#10B981" : "white";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "black";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);
        
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        
        if(d == "LEFT") snakeX -= box;
        if(d == "UP") snakeY -= box;
        if(d == "RIGHT") snakeX += box;
        if(d == "DOWN") snakeY += box;
        
        if(snakeX == food.x && snakeY == food.y){
            score++;
            scoreEl.textContent = score;
            food = {
                x: Math.floor(Math.random()*19+1) * box,
                y: Math.floor(Math.random()*19+1) * box
            }
        } else {
            snake.pop();
        }
        
        let newHead = {x: snakeX, y: snakeY};
        
        // Game Over
        if(snakeX < 0 || snakeX >= 400 || snakeY < 0 || snakeY >= 400 || collision(newHead, snake)){
            clearInterval(gameLoop);
            alert("Has perdut! Puntuació final: " + score + " monedes 🪙");
            return;
        }
        
        snake.unshift(newHead);
    }

    function collision(head, array){
        for(let i = 0; i < array.length; i++){
            if(head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

});
