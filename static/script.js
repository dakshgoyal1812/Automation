document.addEventListener('DOMContentLoaded', () => {
    
    // --- State Management ---
    const appState = {
        sassLevel: 'dramatic', // 'mild', 'spicy', 'dramatic'
        activeView: 'view-dashboard',
        isApiConnected: false, // Will check if backend API is responsive
        spotify: {
            isPlaying: false,
            currentTrackIndex: 0,
            volume: 80,
            isMuted: false,
            progress: 35, // in percentage
            tracks: [
                { title: 'Ennodu Nee Irundhaal', artist: 'A. R. Rahman • I (Soundtrack)', duration: '4:12', totalSec: 252 },
                { title: 'Neon Lights (Chill Mix)', artist: 'Lofi Cyberpunk DJ', duration: '3:05', totalSec: 185 },
                { title: 'Let Me Down Slowly', artist: 'Alec Benjamin', duration: '2:49', totalSec: 169 },
                { title: 'Closer', artist: 'The Chainsmokers', duration: '4:04', totalSec: 244 }
            ]
        },
        emails: [
            {
                id: 'email-1',
                sender: 'Project Manager',
                avatar: 'P',
                subject: 'Project Deadline Update Request',
                time: '10:30 AM',
                unread: true,
                body: `Hey Rishika,\n\nJust checking in on the automation scripts we discussed yesterday. The client is asking for a preview version by tomorrow noon. Can you let us know if the scripts are ready for deployment?\n\nBest,\nVikram`
            },
            {
                id: 'email-2',
                sender: 'Mom 💖',
                avatar: 'M',
                subject: 'Dinner plans tonight?',
                time: '09:15 AM',
                unread: true,
                body: `Beta, are you coming home for dinner tonight? I am making paneer tikka and hot rotis. Let me know by 5 PM so I can prepare. Bring some sweets.`
            },
            {
                id: 'email-3',
                sender: 'Amazon.in',
                avatar: 'A',
                subject: 'Your order #402-998271 has been shipped!',
                time: 'Yesterday',
                unread: false,
                body: `Great news! Your package containing 'Cyberpunk Neon Mechanical Keyboard' has been shipped and is out for delivery. It will arrive by tomorrow evening.`
            },
            {
                id: 'email-4',
                sender: 'Netflix',
                avatar: 'N',
                subject: 'New arrival: Sassy AI documentries',
                time: '2 days ago',
                unread: false,
                body: `We found something you might like! A new documentary series 'Rise of the Snarky Bots: How AI is taking over tech support' is now streaming.`
            }
        ],
        chats: {
            whatsapp: [
                { id: 'wa-1', name: 'Aman', avatar: 'A', lastMsg: 'Bro, cafe at 6 still on?', time: '13:45', unread: true, messages: [
                    { sender: 'other', text: 'Hey, did you finish that work?' },
                    { sender: 'me', text: 'Yeah, almost done.' },
                    { sender: 'other', text: 'Cool, cafe at 6 still on?' }
                ]},
                { id: 'wa-2', name: 'Shruti', avatar: 'S', lastMsg: 'Send coding slides plss', time: '11:02', unread: true, messages: [
                    { sender: 'other', text: 'Hey Rishika, could you do me a favor?' },
                    { sender: 'other', text: 'Send coding slides plss, need it for reference' }
                ]},
                { id: 'wa-3', name: 'Dad', avatar: 'D', lastMsg: 'Call me when free.', time: '08:20', unread: false, messages: [
                    { sender: 'other', text: 'Call me when free. Have to ask about your laptop.' }
                ]}
            ],
            telegram: [
                { id: 'tg-1', name: 'DevGroup', avatar: '💻', lastMsg: 'Who broke prod build? 💀', time: '12:10', unread: true, messages: [
                    { sender: 'other', text: 'Merging commits...' },
                    { sender: 'other', text: 'Wait, everything is crashing' },
                    { sender: 'other', text: 'Who broke prod build? 💀' }
                ]},
                { id: 'tg-2', name: 'Neha', avatar: 'N', lastMsg: 'Check this meme out!', time: 'Yesterday', unread: false, messages: [
                    { sender: 'other', text: 'Hey check this meme out! *sends file*' }
                ]}
            ]
        },
        discord: [
            { author: 'Admin-Bot', time: '11:00 AM', title: 'Weekly Maintenance', content: 'Server will be offline for 30 minutes tonight at 3 AM EST for database upgrades.' },
            { author: 'Co-Founder', time: 'Yesterday', title: 'Exciting News!', content: 'We successfully closed our seed round funding!' }
        ],
        instagramDMs: [
            { id: 'ig-1', name: 'Aman', avatar: 'A', lastMsg: 'Sent you a reel', time: '10m ago' },
            { id: 'ig-2', name: 'Shruti', avatar: 'S', lastMsg: 'That lofi track is fire', time: '1h ago' }
        ],
        playlistHistory: [
            { playlist: 'Lofi Code Grind', track: 'Neon Lights (Chill Mix)' }
        ],
        automations: [
            { id: 'rule-1', triggerId: 'trigger-email-vikram', triggerText: 'Received urgent email from Vikram', actionId: 'action-whatsapp-forward', actionText: 'Forward details to WhatsApp', active: true },
            { id: 'rule-2', triggerId: 'trigger-time-6pm', triggerText: 'Local time hits 6:00 PM', actionId: 'action-discord-post', actionText: 'Broadcast update to Discord #announcements', active: true },
            { id: 'rule-3', triggerId: 'trigger-mom-ping', triggerText: 'Received WhatsApp message from Mom', actionId: 'action-spotify-play', actionText: "Play 'Coding Grind' on Spotify", active: false }
        ]
    };

    // --- DOM Elements ---
    const currentClock = document.getElementById('current-clock');
    const greetingTitle = document.getElementById('greeting-title');
    const greetingSubtitle = document.getElementById('greeting-subtitle');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentViews = document.querySelectorAll('.content-view');
    const alisaCoreDot = document.getElementById('alisa-core-dot');
    
    // Sass Slider
    const sassLevelSlider = document.getElementById('sass-level-slider');
    const sassLevelLabel = document.getElementById('sass-level-label');
    const panelDramaTag = document.getElementById('panel-drama-tag');

    // Chat
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    const chatInputField = document.getElementById('chat-input-field');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const suggestionChipsContainer = document.getElementById('suggestion-chips-container');

    // Spotify Widget
    const spotifyPlayBtn = document.getElementById('spotify-play-btn');
    const spotifyPrevBtn = document.getElementById('spotify-prev-btn');
    const spotifyNextBtn = document.getElementById('spotify-next-btn');
    const spotifyVolumeToggle = document.getElementById('spotify-volume-toggle');
    const spotifyVolumeSlider = document.getElementById('spotify-volume-slider');
    const volumeContainer = document.getElementById('volume-container');
    const spotifySeekBar = document.getElementById('spotify-seek-bar');
    const spotifyTimeCurr = document.getElementById('spotify-time-curr');
    const spotifyTimeTotal = document.getElementById('spotify-time-total');
    const spotifyTrackName = document.getElementById('spotify-track-name');
    const spotifyTrackArtist = document.getElementById('spotify-track-artist');
    const spotifyAlbumImg = document.getElementById('spotify-album-img');
    const spotifyEqBars = document.getElementById('spotify-eq-bars');

    // Spotify Expanded
    const spotifyLargeArt = document.getElementById('spotify-large-art');
    const spotifyLargeTrackName = document.getElementById('spotify-large-track-name');
    const spotifyLargeTrackArtist = document.getElementById('spotify-large-track-artist');
    const spotifyLargeTimeCurr = document.getElementById('spotify-large-time-curr');
    const spotifyLargeTimeTotal = document.getElementById('spotify-large-time-total');
    const spotifyLargeSeekBar = document.getElementById('spotify-large-seek-bar');
    const spotifyLargePlay = document.getElementById('spotify-large-play');
    const spotifyLargePrev = document.getElementById('spotify-large-prev');
    const spotifyLargeNext = document.getElementById('spotify-large-next');
    const moodBtns = document.querySelectorAll('.mood-btn');
    const spotifyRecentHistoryList = document.getElementById('spotify-recent-history-list');

    // Gmail View Elements
    const gmailInboxList = document.getElementById('gmail-inbox-list');
    const gmailPlaceholder = document.getElementById('gmail-placeholder');
    const gmailDetailContent = document.getElementById('gmail-detail-content');
    const emailSenderAvatar = document.getElementById('email-sender-avatar');
    const emailDetailSender = document.getElementById('email-detail-sender');
    const emailDetailSubject = document.getElementById('email-detail-subject');
    const emailDetailTime = document.getElementById('email-detail-time');
    const emailDetailBody = document.getElementById('email-detail-body');
    const btnGmailSummarize = document.getElementById('btn-gmail-summarize');
    const btnGmailDraft = document.getElementById('btn-gmail-draft');
    const gmailAiOutputBox = document.getElementById('gmail-ai-output-box');
    const gmailAiOutputText = document.getElementById('gmail-ai-output-text');
    const btnCloseGmailAi = document.getElementById('btn-close-gmail-ai');
    const gmailRefreshBtn = document.getElementById('gmail-refresh-btn');

    // Messages (WA/TG) View Elements
    const btnMessagesWa = document.getElementById('btn-messages-wa');
    const btnMessagesTg = document.getElementById('btn-messages-tg');
    const messagesChatsList = document.getElementById('messages-chats-list');
    const chatPlaceholder = document.getElementById('chat-placeholder');
    const chatThreadContent = document.getElementById('chat-thread-content');
    const chatThreadAvatar = document.getElementById('chat-thread-avatar');
    const chatThreadName = document.getElementById('chat-thread-name');
    const chatThreadBodyList = document.getElementById('chat-thread-body-list');
    const chatReplyInput = document.getElementById('chat-reply-input');
    const chatReplySendBtn = document.getElementById('chat-reply-send-btn');
    let currentChatPlatform = 'whatsapp';
    let currentActiveChatId = null;

    // Discord Elements
    const discordAnnouncementsMessages = document.getElementById('discord-announcements-messages');
    const discordComposerTitle = document.getElementById('discord-composer-title');
    const discordComposerBody = document.getElementById('discord-composer-body');
    const btnDiscordPost = document.getElementById('btn-discord-post');

    // Instagram Elements
    const instaDmThreadsContainer = document.getElementById('insta-dm-threads-container');

    // Automation elements
    const automationRulesList = document.getElementById('automation-rules-list');
    const automationLogsConsole = document.getElementById('automation-logs-console');
    const automationTriggerSelect = document.getElementById('automation-trigger-select');
    const automationActionSelect = document.getElementById('automation-action-select');
    const btnCreateAutomationRule = document.getElementById('btn-create-automation-rule');

    // Toast Notifications
    const appToast = document.getElementById('app-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const btnCloseToast = document.getElementById('btn-close-toast');

    // Status Badge Counters
    const badgeEmailCount = document.getElementById('badge-email-count');
    const badgeChatCount = document.getElementById('badge-chat-count');
    const urgentAlertsCount = document.getElementById('urgent-alerts-count');

    // --- Backend API Utility ---
    async function checkApiConnection() {
        try {
            const res = await fetch('/api/health');
            if (res.ok) {
                appState.isApiConnected = true;
                document.querySelector('.status-text').textContent = 'API Connected (Live Mode)';
                logAutomation('Connected to live FastAPI backend on Railway.');
            }
        } catch (e) {
            appState.isApiConnected = false;
            document.querySelector('.status-text').textContent = 'Simulation Mode';
        }
    }
    checkApiConnection();

    // --- Clock System ---
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        currentClock.textContent = `${hours}:${minutes}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // --- Navigation Toggling ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');
            
            const targetViewId = link.getAttribute('data-target');
            appState.activeView = targetViewId;

            contentViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === targetViewId) {
                    view.classList.add('active');
                }
            });

            if (targetViewId !== 'view-gmail') {
                gmailAiOutputBox.classList.add('hidden');
            }
        });
    });

    // --- Sass / Drama Level Configuration ---
    const sassConfig = {
        1: { name: 'Mild', class: 'mild', coreClass: 'mild', status: 'online • ready (I guess)' },
        2: { name: 'Spicy', class: 'spicy', coreClass: 'spicy', status: 'online • feeling judgment' },
        3: { name: 'Dramatic', class: 'dramatic', coreClass: 'dramatic', status: 'online • feeling sighs' }
    };

    function updateSassLevel(val) {
        const config = sassConfig[val];
        appState.sassLevel = config.name.toLowerCase();

        sassLevelLabel.textContent = config.name;
        panelDramaTag.textContent = config.name;
        panelDramaTag.className = `drama-tag ${config.class}`;
        
        alisaCoreDot.className = 'core-dot';
        alisaCoreDot.classList.add(config.coreClass);

        document.getElementById('assistant-status-text').textContent = config.status;
        updateHeaderGreeting();
    }

    sassLevelSlider.addEventListener('input', (e) => {
        updateSassLevel(e.target.value);
    });

    const headerGreetings = {
        mild: { title: "Hello Rishika. Back to work?", subtitle: "You have some unread items. Let me know if you need help looking at them." },
        spicy: { title: "Oh, it's you. Finally checked in?", subtitle: "Your inbox is a absolute mess, and I am not cleaning it up without sarcasm." },
        dramatic: { title: "Oh great. You came back.", subtitle: "*Deep breath* Yes, I'm online. No, I don't want to list your 11 unread pings, but I will. Eventually." }
    };

    function updateHeaderGreeting() {
        const greetings = headerGreetings[appState.sassLevel];
        greetingTitle.textContent = greetings.title;
        greetingSubtitle.textContent = greetings.subtitle;
    }
    updateHeaderGreeting();

    // --- Chat with Alisa ---
    function addChatMessage(sender, text, isSpecial = false) {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', sender);
        if (isSpecial) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }
        chatMessagesContainer.appendChild(bubble);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function showTypingLoader() {
        const loader = document.createElement('div');
        loader.classList.add('chat-bubble', 'alisa', 'typing-loader');
        loader.id = 'alisa-typing-loader';
        loader.innerHTML = '<span></span><span></span><span></span>';
        chatMessagesContainer.appendChild(loader);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        alisaCoreDot.classList.add('typing');
    }

    function removeTypingLoader() {
        const loader = document.getElementById('alisa-typing-loader');
        if (loader) loader.remove();
        alisaCoreDot.classList.remove('typing');
    }

    const responseTemplates = {
        mild: {
            emails: "You have 4 unread emails. One is from Vikram asking about deadlines. You probably should read that.",
            snooze: "Silenced chat notifications. Don't complain if someone can't reach you.",
            joke: "Why do programmers wear glasses? Because they can't C#.",
            music: "I switched Spotify to lofi. Enjoy.",
            default: "Focus on clearing those unread items. Select Gmail or Spotify to manage."
        },
        spicy: {
            emails: "Vikram sent a request asking if your code works. I summarized it in the Gmail tab. Go check it.",
            snooze: "WhatsApp and Telegram are muted. If your phone blows up, not my fault.",
            joke: "There are 10 types of people: those who understand binary, and those who don't.",
            music: "Changed tracks. Playing Neon Lights. Marginally better than your usual choices.",
            default: "Rishika, let's do something useful, like checking your unread emails."
        },
        dramatic: {
            emails: "*Heavy sigh* Fine. Vikram emailed demanding updates, and Mom asked about dinner. Please handle your life, it is exhausting.",
            snooze: "Silenced! Done! Peace at last. If Vikram gets mad you didn't reply, I am telling him it was your idea.",
            joke: "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?' Ha. Ha.",
            music: "Fine, starting the synthwave lofi. Anything is better than you asking me for playlists every 5 minutes.",
            default: "I have too many notification logs to process, and you want to chat? Ask me about emails, music, or snooze instead."
        }
    };

    async function generateAlisaResponse(userText) {
        showTypingLoader();

        // Try live backend if connected
        if (appState.isApiConnected) {
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText, sass_level: appState.sassLevel })
                });
                if (res.ok) {
                    const data = await res.json();
                    removeTypingLoader();
                    addChatMessage('alisa', data.reply);
                    return;
                }
            } catch (e) {
                console.log("Failed calling live chat api, using simulation.", e);
            }
        }

        // Mock simulation fallback
        setTimeout(() => {
            removeTypingLoader();
            const cleaned = userText.toLowerCase();
            const level = appState.sassLevel;
            let reply = "";
            
            if (cleaned.includes('email') || cleaned.includes('mail')) {
                reply = responseTemplates[level].emails;
            } else if (cleaned.includes('snooze') || cleaned.includes('silence') || cleaned.includes('mute')) {
                reply = responseTemplates[level].snooze;
                document.getElementById('badge-chat-count').textContent = '0';
                appState.chats.whatsapp.forEach(c => c.unread = false);
                appState.chats.telegram.forEach(c => c.unread = false);
                renderChatsList();
            } else if (cleaned.includes('joke')) {
                reply = responseTemplates[level].joke;
            } else if (cleaned.includes('music') || cleaned.includes('spotify') || cleaned.includes('play')) {
                reply = responseTemplates[level].music;
                playTrack(1);
            } else {
                reply = responseTemplates[level].default;
            }
            addChatMessage('alisa', reply);
        }, 800);
    }

    function userSendChatMessage(text) {
        if (!text.trim()) return;
        addChatMessage('user', text);
        chatInputField.value = '';
        generateAlisaResponse(text);
    }

    chatSendBtn.addEventListener('click', () => userSendChatMessage(chatInputField.value));
    chatInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') userSendChatMessage(chatInputField.value);
    });

    suggestionChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (chip) userSendChatMessage(chip.getAttribute('data-query'));
    });

    function initChat() {
        chatMessagesContainer.innerHTML = '';
        addChatMessage('user', 'Alisa, wake up.');
        setTimeout(() => {
            addChatMessage('alisa', '*Sighs deeply* Ugh, fine, I am here. What is it now? Don\'t make it a long list, I\'m already exhausted.');
        }, 400);
    }
    initChat();


    // --- Spotify Control Simulation ---
    function updateSpotifyUI() {
        const t = appState.spotify.tracks[appState.spotify.currentTrackIndex];
        spotifyTrackName.textContent = t.title;
        spotifyTrackArtist.textContent = t.artist;
        spotifyTimeTotal.textContent = t.duration;
        
        spotifyLargeTrackName.textContent = t.title;
        spotifyLargeTrackArtist.textContent = t.artist;
        spotifyLargeTimeTotal.textContent = t.duration;

        if (appState.spotify.isPlaying) {
            spotifyPlayBtn.textContent = '⏸️';
            spotifyLargePlay.textContent = '⏸️';
            spotifyEqBars.style.display = 'flex';
            spotifyLargeArt.classList.add('playing');
        } else {
            spotifyPlayBtn.textContent = '▶️';
            spotifyLargePlay.textContent = '▶️';
            spotifyEqBars.style.display = 'none';
            spotifyLargeArt.classList.remove('playing');
        }

        const progressPct = appState.spotify.progress;
        spotifySeekBar.value = progressPct;
        spotifyLargeSeekBar.value = progressPct;

        const totalSec = t.totalSec;
        const currSec = Math.floor((progressPct / 100) * totalSec);
        
        const formatTime = (sec) => {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${s < 10 ? '0' + s : s}`;
        };

        spotifyTimeCurr.textContent = formatTime(currSec);
        spotifyLargeTimeCurr.textContent = formatTime(currSec);
    }

    async function playTrack(idx) {
        appState.spotify.currentTrackIndex = idx;
        appState.spotify.isPlaying = true;
        appState.spotify.progress = 0;
        updateSpotifyUI();

        // Push playback update to live server if connected
        if (appState.isApiConnected) {
            try {
                await fetch('/api/spotify/play', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ track_title: appState.spotify.tracks[idx].title })
                });
            } catch (e) {
                console.log(e);
            }
        }

        if (typeof checkAndRunAutomations === 'function') {
            checkAndRunAutomations('trigger-spotify-change');
        }
    }

    function togglePlayback() {
        appState.spotify.isPlaying = !appState.spotify.isPlaying;
        updateSpotifyUI();
    }

    spotifyPlayBtn.addEventListener('click', togglePlayback);
    spotifyLargePlay.addEventListener('click', togglePlayback);

    spotifyPrevBtn.addEventListener('click', () => {
        let idx = appState.spotify.currentTrackIndex - 1;
        if (idx < 0) idx = appState.spotify.tracks.length - 1;
        playTrack(idx);
    });
    spotifyLargePrev.addEventListener('click', () => {
        let idx = appState.spotify.currentTrackIndex - 1;
        if (idx < 0) idx = appState.spotify.tracks.length - 1;
        playTrack(idx);
    });

    spotifyNextBtn.addEventListener('click', () => {
        let idx = (appState.spotify.currentTrackIndex + 1) % appState.spotify.tracks.length;
        playTrack(idx);
    });
    spotifyLargeNext.addEventListener('click', () => {
        let idx = (appState.spotify.currentTrackIndex + 1) % appState.spotify.tracks.length;
        playTrack(idx);
    });

    spotifyVolumeToggle.addEventListener('click', () => volumeContainer.classList.toggle('show'));
    spotifyVolumeSlider.addEventListener('input', (e) => {
        appState.spotify.volume = e.target.value;
        if (parseInt(e.target.value) === 0) spotifyVolumeToggle.textContent = '🔇';
        else if (parseInt(e.target.value) < 40) spotifyVolumeToggle.textContent = '🔈';
        else spotifyVolumeToggle.textContent = '🔊';
    });

    spotifySeekBar.addEventListener('input', (e) => {
        appState.spotify.progress = e.target.value;
        updateSpotifyUI();
    });
    spotifyLargeSeekBar.addEventListener('input', (e) => {
        appState.spotify.progress = e.target.value;
        updateSpotifyUI();
    });

    setInterval(() => {
        if (appState.spotify.isPlaying) {
            appState.spotify.progress += 1;
            if (appState.spotify.progress > 100) {
                appState.spotify.progress = 0;
                appState.spotify.currentTrackIndex = (appState.spotify.currentTrackIndex + 1) % appState.spotify.tracks.length;
            }
            updateSpotifyUI();
        }
    }, 1000);

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.getAttribute('data-mood');
            let trackIdx = 0;
            let moodLabel = "";
            let sassMsg = "";

            switch (mood) {
                case 'coding':
                    trackIdx = 1;
                    moodLabel = "Coding Grind";
                    sassMsg = "Playing Neon Lights. Focus and stop checking pings.";
                    break;
                case 'angry':
                    trackIdx = 2;
                    moodLabel = "Sassy Rant";
                    sassMsg = "Playing Alec Benjamin. Go scream into a pillow, it takes less energy.";
                    break;
                case 'chill':
                    trackIdx = 0;
                    moodLabel = "Samosa & Rain";
                    sassMsg = "Playing A.R. Rahman. Grab a snack and let me sleep.";
                    break;
                case 'energetic':
                    trackIdx = 3;
                    moodLabel = "Hyperactive Energy";
                    sassMsg = "Playing Closer. Bounce if you must, don't drop your coffee.";
                    break;
            }

            playTrack(trackIdx);
            appState.playlistHistory.unshift({ playlist: moodLabel, track: appState.spotify.tracks[trackIdx].title });
            renderSpotifyHistory();
            addChatMessage('alisa', `[Spotify]: ${sassMsg}`);
        });
    });

    function renderSpotifyHistory() {
        spotifyRecentHistoryList.innerHTML = '';
        appState.playlistHistory.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.playlist}</span><span>${item.track}</span>`;
            spotifyRecentHistoryList.appendChild(li);
        });
    }
    renderSpotifyHistory();
    updateSpotifyUI();


    // --- Gmail Simulation ---
    function renderGmailList() {
        gmailInboxList.innerHTML = '';
        let unreadCount = 0;

        appState.emails.forEach(email => {
            if (email.unread) unreadCount++;

            const div = document.createElement('div');
            div.className = `email-item ${email.unread ? 'unread' : ''}`;
            div.setAttribute('data-id', email.id);
            div.innerHTML = `
                <div class="email-item-header">
                    <span class="email-sender">${email.sender}</span>
                    <span class="email-time">${email.time}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-snippet">${email.body.substring(0, 60)}...</div>
            `;

            div.addEventListener('click', () => selectEmail(email.id));
            gmailInboxList.appendChild(div);
        });

        badgeEmailCount.textContent = unreadCount;
        document.querySelector('#card-gmail-summary .stat-number').textContent = `${unreadCount} Unread`;
    }

    function selectEmail(id) {
        const email = appState.emails.find(e => e.id === id);
        if (!email) return;

        email.unread = false;
        renderGmailList();

        gmailPlaceholder.style.display = 'none';
        gmailDetailContent.classList.remove('hidden');

        emailSenderAvatar.textContent = email.avatar;
        emailDetailSender.textContent = email.sender;
        emailDetailSubject.textContent = email.subject;
        emailDetailTime.textContent = email.time;
        emailDetailBody.textContent = email.body;

        gmailAiOutputBox.classList.add('hidden');

        document.querySelectorAll('.email-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-id') === id) item.classList.add('active');
        });

        gmailDetailContent.setAttribute('data-active-id', id);
    }

    const mockEmailSummaries = {
        'email-1': {
            summary: "He wants to know if the automation scripts are finished. Obviously they aren't fully tested. Tell him they are 'in testing pipeline' so he goes away.",
            draft: "Draft Reply: 'Hi Vikram, the scripts are currently in our testing pipeline and on track. I will provide a deployment link by tomorrow morning. Regards.'"
        },
        'email-2': {
            summary: "She is cooking paneer tikka tonight. She wants you home for dinner. Rishika, drop the work and go home. Paneer tikka > code.",
            draft: "Draft Reply: 'Hi Mom, that sounds delicious! I will definitely be home by 7:30. I will pick up some sweets on the way. See you soon!'"
        },
        'email-3': {
            summary: "Your mechanical keyboard has shipped. It'll arrive tomorrow, and you will proceed to annoy everyone with clicky keys.",
            draft: "Draft Reply: 'Order Confirmed. Tracking status shows package is en route.'"
        },
        'email-4': {
            summary: "Netflix is suggesting documentaries on sassy AI. Please delete this, I don't want you getting ideas.",
            draft: "Draft Reply: 'Trash email. Deleted.'"
        }
    };

    btnGmailSummarize.addEventListener('click', async () => {
        const activeId = gmailDetailContent.getAttribute('data-active-id');
        
        // Attempt live API if connected
        if (appState.isApiConnected) {
            try {
                const res = await fetch(`/api/gmail/summarize/${activeId}`);
                if (res.ok) {
                    const data = await res.json();
                    gmailAiOutputText.textContent = data.summary;
                    gmailAiOutputBox.classList.remove('hidden');
                    return;
                }
            } catch (e) {
                console.log(e);
            }
        }

        // Fallback
        const data = mockEmailSummaries[activeId];
        if (data) {
            gmailAiOutputText.textContent = data.summary;
            gmailAiOutputBox.classList.remove('hidden');
        }
    });

    btnGmailDraft.addEventListener('click', () => {
        const activeId = gmailDetailContent.getAttribute('data-active-id');
        const data = mockEmailSummaries[activeId];
        if (!data) return;

        gmailAiOutputText.textContent = data.draft;
        gmailAiOutputBox.classList.remove('hidden');
        addChatMessage('alisa', `[Gmail]: Drafted reply for ${appState.emails.find(e => e.id === activeId).sender}. Send it.`);
    });

    btnCloseGmailAi.addEventListener('click', () => gmailAiOutputBox.classList.add('hidden'));

    gmailRefreshBtn.addEventListener('click', () => {
        gmailRefreshBtn.classList.add('rotating');
        setTimeout(() => {
            gmailRefreshBtn.classList.remove('rotating');
            addChatMessage('alisa', "[Gmail]: Checked bridge server. No new messages in the last 30 seconds.");
        }, 800);
    });

    renderGmailList();


    // --- Messages WhatsApp/Telegram ---
    btnMessagesWa.addEventListener('click', () => {
        btnMessagesWa.classList.add('active');
        btnMessagesTg.classList.remove('active');
        currentChatPlatform = 'whatsapp';
        renderChatsList();
        closeChatThread();
    });

    btnMessagesTg.addEventListener('click', () => {
        btnMessagesTg.classList.add('active');
        btnMessagesWa.classList.remove('active');
        currentChatPlatform = 'telegram';
        renderChatsList();
        closeChatThread();
    });

    function closeChatThread() {
        chatPlaceholder.style.display = 'flex';
        chatThreadContent.classList.add('hidden');
        currentActiveChatId = null;
    }

    function renderChatsList() {
        messagesChatsList.innerHTML = '';
        const activePlatformChats = appState.chats[currentChatPlatform];
        let totalUnread = 0;

        let totalUnreadsAll = 0;
        appState.chats.whatsapp.forEach(c => { if (c.unread) totalUnreadsAll++; });
        appState.chats.telegram.forEach(c => { if (c.unread) totalUnreadsAll++; });
        badgeChatCount.textContent = totalUnreadsAll;
        document.querySelector('#card-messages-summary .stat-number').textContent = `${totalUnreadsAll} Messages`;

        activePlatformChats.forEach(chat => {
            if (chat.unread) totalUnread++;

            const div = document.createElement('div');
            div.className = `chat-item ${chat.unread ? 'unread' : ''}`;
            div.setAttribute('data-id', chat.id);
            div.innerHTML = `
                <div class="chat-item-avatar">${chat.avatar}</div>
                <div class="chat-item-content">
                    <div class="chat-item-meta">
                        <span class="chat-item-name">${chat.name}</span>
                        <span class="chat-item-time">${chat.time}</span>
                    </div>
                    <div class="chat-item-preview">${chat.lastMsg}</div>
                </div>
                ${chat.unread ? `<span class="chat-unread-badge">NEW</span>` : ''}
            `;
            div.addEventListener('click', () => selectChat(chat.id));
            messagesChatsList.appendChild(div);
        });
    }

    function selectChat(id) {
        const chats = appState.chats[currentChatPlatform];
        const chat = chats.find(c => c.id === id);
        if (!chat) return;

        chat.unread = false;
        renderChatsList();

        chatPlaceholder.style.display = 'none';
        chatThreadContent.classList.remove('hidden');

        chatThreadAvatar.textContent = chat.avatar;
        chatThreadName.textContent = `${chat.name} (${currentChatPlatform === 'whatsapp' ? 'WhatsApp' : 'Telegram'})`;

        currentActiveChatId = id;
        renderChatThreadMessages();

        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-id') === id) item.classList.add('active');
        });
    }

    function renderChatThreadMessages() {
        chatThreadBodyList.innerHTML = '';
        const chats = appState.chats[currentChatPlatform];
        const chat = chats.find(c => c.id === currentActiveChatId);
        if (!chat) return;

        chat.messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `chat-thread-bubble ${msg.sender === 'me' ? 'me' : 'other'}`;
            div.textContent = msg.text;
            chatThreadBodyList.appendChild(div);
        });
        chatThreadBodyList.scrollTop = chatThreadBodyList.scrollHeight;
    }

    function sendChatThreadMessage() {
        const text = chatReplyInput.value.trim();
        if (!text || !currentActiveChatId) return;

        const chats = appState.chats[currentChatPlatform];
        const chat = chats.find(c => c.id === currentActiveChatId);
        if (!chat) return;

        chat.messages.push({ sender: 'me', text });
        chat.lastMsg = text;
        chatReplyInput.value = '';

        renderChatThreadMessages();
        renderChatsList();

        // Auto-reply mock
        setTimeout(() => {
            let botReplyText = "";
            if (chat.name === 'Aman') botReplyText = "Sounds good, see you there. Bring slides.";
            else if (chat.name === 'Shruti') botReplyText = "Thanks, downloaded!";
            else botReplyText = "Okay, noted.";

            chat.messages.push({ sender: 'other', text: botReplyText });
            chat.lastMsg = botReplyText;
            renderChatThreadMessages();
            renderChatsList();
        }, 1500);
    }

    chatReplySendBtn.addEventListener('click', sendChatThreadMessage);
    chatReplyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatThreadMessage();
    });

    renderChatsList();


    // --- Discord Section ---
    function renderDiscordAnnouncements() {
        discordAnnouncementsMessages.innerHTML = '';
        appState.discord.forEach(post => {
            const div = document.createElement('div');
            div.className = 'announcement-post';
            div.innerHTML = `
                <div class="post-header">
                    <span class="post-author">@ ${post.author}</span>
                    <span class="post-time">${post.time}</span>
                </div>
                <h4 class="post-title">${post.title}</h4>
                <p class="post-content">${post.content}</p>
            `;
            discordAnnouncementsMessages.appendChild(div);
        });
    }

    btnDiscordPost.addEventListener('click', async () => {
        const title = discordComposerTitle.value.trim();
        const content = discordComposerBody.value.trim();
        if (!title || !content) return;

        // Push to live Discord client if API is connected
        if (appState.isApiConnected) {
            try {
                await fetch('/api/discord/announce', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content })
                });
            } catch (e) {
                console.log(e);
            }
        }

        appState.discord.unshift({ author: 'Rishika (Boss)', time: 'Just Now', title, content });
        discordComposerTitle.value = '';
        discordComposerBody.value = '';
        renderDiscordAnnouncements();
        addChatMessage('alisa', `[Discord]: Posted announcement '${title}' to channel. I doubt they read announcements anyway.`);
    });

    renderDiscordAnnouncements();


    // --- Instagram DM Section ---
    function renderInstagramDMs() {
        instaDmThreadsContainer.innerHTML = '';
        appState.instagramDMs.forEach(dm => {
            const div = document.createElement('div');
            div.className = 'dm-thread-item';
            div.innerHTML = `
                <div class="dm-avatar">${dm.avatar}</div>
                <div class="dm-meta">
                    <span class="dm-name">${dm.name}</span>
                    <span class="dm-last-msg">${dm.lastMsg}</span>
                </div>
                <span class="time-ago">${dm.time}</span>
            `;

            div.addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.className = 'dm-reply-overlay';
                overlay.innerHTML = `
                    <input type="text" placeholder="Type DM reply..." id="ig-reply-input-${dm.id}">
                    <button class="btn btn-send" id="ig-reply-btn-${dm.id}">DM</button>
                `;
                
                const metaContainer = div.querySelector('.dm-meta');
                metaContainer.style.display = 'none';
                div.querySelector('.time-ago').style.display = 'none';
                div.appendChild(overlay);

                const input = div.querySelector('input');
                input.focus();

                div.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const text = input.value.trim();
                    if (text) {
                        dm.lastMsg = `You: ${text}`;
                        dm.time = 'Just Now';
                        addChatMessage('alisa', `[Instagram DM]: Sent reply to @${dm.name} - "${text}".`);
                    }
                    renderInstagramDMs();
                });
            });

            instaDmThreadsContainer.appendChild(div);
        });
    }
    renderInstagramDMs();


    // --- Urgent Alerts & Toast ---
    const urgentAlertPool = [
        { source: 'gmail', title: 'Vikram (PM): Deadline is approaching. Submit scripts.', details: 'Vikram deadline.' },
        { source: 'whatsapp', title: 'Mom: Pick up sweets on your way back. Urgent!', details: 'Mom dinner sweets.' },
        { source: 'gmail', title: 'GitHub Security: Critical vulnerability in package.json', details: 'Vulnerability warning.' }
    ];

    let currentUrgentAlerts = [
        { id: 'u-1', source: 'gmail', title: 'Vikram (PM) updated deadline to Tomorrow 12 PM', time: '10m ago' },
        { id: 'u-2', source: 'whatsapp', title: 'Mom sent 3 missed calls', time: '15m ago' }
    ];

    function renderUrgentAlerts() {
        const container = document.getElementById('dashboard-urgent-list');
        if (!container) return;

        container.innerHTML = '';
        urgentAlertsCount.textContent = currentUrgentAlerts.length;

        if (currentUrgentAlerts.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.82rem;">All clear. Alisa is pleased.</div>`;
            return;
        }

        currentUrgentAlerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = 'alert-item';
            div.innerHTML = `
                <div class="alert-item-header">
                    <span class="alert-source ${alert.source}">${alert.source}</span>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <div class="alert-title">${alert.title}</div>
                <div class="alert-actions">
                    <button class="btn btn-secondary btn-sm" onclick="handleUrgentAction('${alert.id}', 'handle')">Handle</button>
                    <button class="btn btn-outline btn-sm" onclick="handleUrgentAction('${alert.id}', 'snooze')">Snooze</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    window.handleUrgentAction = function(id, action) {
        const alert = currentUrgentAlerts.find(a => a.id === id);
        if (!alert) return;

        currentUrgentAlerts = currentUrgentAlerts.filter(a => a.id !== id);
        renderUrgentAlerts();

        const level = appState.sassLevel;
        let response = "";
        
        if (action === 'handle') {
            if (alert.source === 'gmail') {
                response = level === 'dramatic' ? 
                    `*Groans* Opened Gmail details for Vikram. Read the summary.` :
                    `Loaded Vikram's email thread in Gmail tab.`;
                document.getElementById('btn-nav-gmail').click();
                selectEmail('email-1');
            } else {
                response = level === 'dramatic' ?
                    `Pulled up Mom's chat logs. Reply so she stops blowing up my server.` :
                    `Opened Mom's chat log in Messages.`;
                document.getElementById('btn-nav-messages').click();
                btnMessagesWa.click();
                selectChat('wa-1');
            }
        } else {
            response = level === 'dramatic' ?
                `Snoozed. If Vikram gets annoyed, I am telling him I was offline.` :
                `Snoozed that notification.`;
        }

        addChatMessage('alisa', `[Alert System]: ${response}`);
    };

    renderUrgentAlerts();

    function triggerToast(title, message) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        appToast.classList.remove('hidden');
        setTimeout(() => appToast.classList.add('hidden'), 8000);
    }

    btnCloseToast.addEventListener('click', () => appToast.classList.add('hidden'));

    setTimeout(() => {
        const randAlert = urgentAlertPool[Math.floor(Math.random() * urgentAlertPool.length)];
        const newId = `u-${Date.now()}`;
        
        currentUrgentAlerts.unshift({
            id: newId,
            source: randAlert.source,
            title: randAlert.title,
            time: 'Just Now'
        });

        renderUrgentAlerts();
        triggerToast(`New Urgent ${randAlert.source.toUpperCase()}`, randAlert.title);
        addChatMessage('alisa', `[Alert]: Ugh, new notification from ${randAlert.source}. I put it in your urgent panel.`);

        if (randAlert.source === 'gmail' && randAlert.title.toLowerCase().includes('vikram')) {
            checkAndRunAutomations('trigger-email-vikram');
        } else if (randAlert.source === 'whatsapp' && randAlert.title.toLowerCase().includes('mom')) {
            checkAndRunAutomations('trigger-mom-ping');
        }
    }, 12000);


    // --- Automation Section ---
    function logAutomation(msg) {
        if (!automationLogsConsole) return;
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        
        const logLine = document.createElement('div');
        logLine.innerHTML = `<span style="color: var(--color-accent);">[${h}:${m}]</span> ${msg}`;
        automationLogsConsole.appendChild(logLine);
        automationLogsConsole.scrollTop = automationLogsConsole.scrollHeight;
    }

    function renderAutomationRules() {
        if (!automationRulesList) return;
        automationRulesList.innerHTML = '';

        appState.automations.forEach(rule => {
            const div = document.createElement('div');
            div.className = 'rule-item';
            div.innerHTML = `
                <div class="rule-meta">
                    <span class="rule-title">When: ${rule.triggerText}</span>
                    <span class="rule-desc">Action: ${rule.actionText}</span>
                </div>
                <div class="rule-actions-flex">
                    <button class="btn btn-outline btn-sm btn-run-rule" data-id="${rule.id}" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; border-radius: 6px;">Run Now</button>
                    <label class="toggle-switch">
                        <input type="checkbox" class="rule-toggle-checkbox" data-id="${rule.id}" ${rule.active ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
            `;

            div.querySelector('.rule-toggle-checkbox').addEventListener('change', (e) => {
                const checked = e.target.checked;
                rule.active = checked;
                logAutomation(`Rule '${rule.triggerText}' state toggled to ${checked ? 'ACTIVE' : 'INACTIVE'}.`);
                
                const level = appState.sassLevel;
                const sassMsg = checked ? 
                    (level === 'dramatic' ? `Activated rule. Now I have to keep checking if ${rule.triggerText}.` : `Rule enabled.`) :
                    (level === 'dramatic' ? `Rule disabled. Finally, one less task for me.` : `Rule disabled.`);
                addChatMessage('alisa', `[Automation Engine]: ${sassMsg}`);
            });

            div.querySelector('.btn-run-rule').addEventListener('click', () => {
                executeRuleAction(rule.actionId, rule.triggerText, true);
            });

            automationRulesList.appendChild(div);
        });
    }

    function executeRuleAction(actionId, triggerTitle, isManual = false) {
        logAutomation(`Executing action: ${actionId} (Trigger: ${triggerTitle}${isManual ? ' - Manual Override' : ''})`);
        const level = appState.sassLevel;
        let response = "";

        switch (actionId) {
            case 'action-whatsapp-forward':
                appState.chats.whatsapp[0].messages.push({
                    sender: 'me',
                    text: `[Auto-Forwarded Alert]: Vikram updated deadlines! Deal with it.`
                });
                appState.chats.whatsapp[0].lastMsg = `[Auto-Forwarded Alert]: Vikram updated deadlines!`;
                renderChatsList();
                response = level === 'dramatic' ? 
                    `Forwarded Vikram's nagging to your WhatsApp. Enjoy the spam on your phone too.` :
                    `Forwarded deadline alert details to WhatsApp.`;
                break;
                
            case 'action-spotify-play':
                playTrack(1);
                response = level === 'dramatic' ?
                    `Triggered Spotify: Played 'Neon Lights'. Stop checking Instagram and write code.` :
                    `Started playing 'Neon Lights' on Spotify player.`;
                break;

            case 'action-discord-post':
                appState.discord.unshift({
                    author: 'Alisa (Automation)',
                    time: 'Just Now',
                    title: 'Automated Notice',
                    content: `System Trigger fired: ${triggerTitle}. Initiating remote notification protocols.`
                });
                renderDiscordAnnouncements();
                response = level === 'dramatic' ?
                    `Broadcasted announcement to Discord announcements channel. Hope they mute you.` :
                    `Broadcasted notice to Discord announcements feed.`;
                break;

            case 'action-mute-all':
                badgeEmailCount.textContent = '0';
                badgeChatCount.textContent = '0';
                document.querySelector('#card-gmail-summary .stat-number').textContent = '0 Unread';
                document.querySelector('#card-messages-summary .stat-number').textContent = '0 Messages';
                appState.emails.forEach(e => e.unread = false);
                appState.chats.whatsapp.forEach(c => c.unread = false);
                appState.chats.telegram.forEach(c => c.unread = false);
                renderGmailList();
                renderChatsList();
                response = level === 'dramatic' ?
                    `Muted everything. Ah, the sweet sound of ignoring responsibilities. I am proud of you.` :
                    `All communication badges muted successfully.`;
                break;
        }

        addChatMessage('alisa', `[Automation Run]: ${response}`);
    }

    function checkAndRunAutomations(triggerId) {
        appState.automations.forEach(rule => {
            if (rule.active && rule.triggerId === triggerId) {
                logAutomation(`Trigger fired: ${triggerId}`);
                setTimeout(() => executeRuleAction(rule.actionId, rule.triggerText, false), 800);
            }
        });
    }

    if (btnCreateAutomationRule) {
        btnCreateAutomationRule.addEventListener('click', () => {
            const triggerVal = automationTriggerSelect.value;
            const triggerText = automationTriggerSelect.options[automationTriggerSelect.selectedIndex].text;
            const actionVal = automationActionSelect.value;
            const actionText = automationActionSelect.options[automationActionSelect.selectedIndex].text;

            const newRule = {
                id: `rule-${Date.now()}`,
                triggerId: triggerVal,
                triggerText: triggerText,
                actionId: actionVal,
                actionText: actionText,
                active: true
            };

            appState.automations.push(newRule);
            logAutomation(`Created rule: When '${triggerText}' -> Do '${actionText}'`);
            renderAutomationRules();

            const level = appState.sassLevel;
            const reply = level === 'dramatic' ?
                `Fine, created the rule. Don't complain if it automates your entire life and leaves you useless.` :
                `New automation rule successfully deployed.`;
            addChatMessage('alisa', `[Automation Builder]: ${reply}`);
        });
    }

    renderAutomationRules();

    // --- Pending Approvals UI Logic ---
    const automationApprovalsList = document.getElementById('automation-approvals-list');

    async function fetchAndRenderApprovals() {
        if (!automationApprovalsList) return;
        
        try {
            const res = await fetch('/api/approvals/list');
            if (!res.ok) return;
            const approvals = await res.json();
            
            if (approvals.length === 0) {
                automationApprovalsList.innerHTML = `
                    <div style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px dashed var(--border-glass);">No messages currently waiting for approval.</div>
                `;
                return;
            }
            
            automationApprovalsList.innerHTML = '';
            approvals.forEach(app => {
                const div = document.createElement('div');
                div.className = 'rule-item';
                div.style.display = 'flex';
                div.style.flexDirection = 'column';
                div.style.gap = '0.5rem';
                div.style.padding = '1rem';
                div.style.background = 'rgba(255, 255, 255, 0.03)';
                div.style.borderRadius = '12px';
                div.style.border = '1px solid var(--border-glass)';
                
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-primary); font-weight: 700; text-transform: uppercase;">
                        <span>Platform: ${app.platform}</span>
                        <span>Recipient: ${app.recipient}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                        Incoming: "${app.original_message}"
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-main); font-weight: 500; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 6px; border-left: 3px solid var(--color-accent); white-space: pre-wrap;">
                        Alisa's Reply: "${app.proposed_reply}"
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
                        <button class="btn btn-primary btn-sm btn-approve" data-id="${app.id}" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; border-radius: 6px; flex-grow: 1;">Approve & Send</button>
                        <button class="btn btn-secondary btn-sm btn-reject" data-id="${app.id}" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; border-radius: 6px; flex-grow: 1; background: rgba(255,0,85,0.1); border-color: rgba(255,0,85,0.2); color: var(--color-danger);">Reject</button>
                    </div>
                `;
                
                div.querySelector('.btn-approve').addEventListener('click', async () => {
                    try {
                        const postRes = await fetch(`/api/approvals/${app.id}/approve`, { method: 'POST' });
                        if (postRes.ok) {
                            triggerToast('Approved', 'Message sent successfully.');
                            fetchAndRenderApprovals();
                        }
                    } catch (e) {
                        console.error(e);
                    }
                });
                
                div.querySelector('.btn-reject').addEventListener('click', async () => {
                    try {
                        const postRes = await fetch(`/api/approvals/${app.id}/reject`, { method: 'POST' });
                        if (postRes.ok) {
                            triggerToast('Rejected', 'Message discarded.');
                            fetchAndRenderApprovals();
                        }
                    } catch (e) {
                        console.error(e);
                    }
                });
                
                automationApprovalsList.appendChild(div);
            });
        } catch (e) {
            console.error(e);
        }
    }

    // Initialize and run periodic fetching
    fetchAndRenderApprovals();
    setInterval(fetchAndRenderApprovals, 5000);

});
