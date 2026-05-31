// ─── SUPABASE CLIENT ───
const SUPABASE_URL = 'https://kycfoaamhvmerunslumz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MixEk_2y7e8Lcmi0j78PtQ_6Pkcf21v';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  // ─── NAVBAR SCROLL ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ─── SAKURA ANIMATION ───
  const sakuraContainer = document.getElementById('sakura-container');
  if (sakuraContainer) {
    const createPetal = () => {
      const petal = document.createElement('div');
      petal.classList.add('sakura-petal');
      
      // Rastgele pozisyon ve boyut
      const startLeft = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const duration = Math.random() * 5 + 5;
      const delay = Math.random() * 5;
      
      petal.style.left = `${startLeft}vw`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      
      sakuraContainer.appendChild(petal);
      
      // Animasyon bitince sil
      setTimeout(() => {
        petal.remove();
      }, (duration + delay) * 1000);
    };

    // İlk başta birkaç tane oluştur
    for (let i = 0; i < 20; i++) {
      createPetal();
    }
    
    // Sürekli oluştur
    setInterval(createPetal, 400);
  }

  // ─── MOCK DATA ───
  let animes = [
    { id: 1, title: 'Your Name', genre: 'Romantik', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', eps: 1 },
    { id: 2, title: 'Spirited Away', genre: 'Fantezi', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop', eps: 1 },
    { id: 3, title: 'A Silent Voice', genre: 'Drama', img: 'https://images.unsplash.com/photo-1580477655166-51f7bb980d9a?w=400&h=600&fit=crop', eps: 1 },
    { id: 4, title: 'Violet Evergarden', genre: 'Drama', img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=600&fit=crop', eps: 13 },
    { id: 5, title: 'Jujutsu Kaisen', genre: 'Aksiyon', img: 'https://images.unsplash.com/photo-1601850494422-3fb19e13fcdb?w=400&h=600&fit=crop', eps: 24 },
    { id: 6, title: 'Demon Slayer', genre: 'Aksiyon', img: 'https://images.unsplash.com/photo-1611078713203-9118e61fb162?w=400&h=600&fit=crop', eps: 26 },
    { id: 7, title: 'Horimiya', genre: 'Romantik', img: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=600&fit=crop', eps: 13 },
    { id: 8, title: 'Frieren', genre: 'Fantezi', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', eps: 28 },
  ];

  // ─── RENDER CARDS ───
  const createCard = (anime) => {
    return `
      <div class="anime-card" data-id="${anime.id}">
        <div class="card-img-wrapper">
          <img src="${anime.img}" alt="${anime.title}" class="card-img" loading="lazy" />
          <div class="card-badge">⭐ 9.0</div>
          <button class="card-add-btn" aria-label="Listeye Ekle">+</button>
          <div class="card-overlay">
            <span class="play-text">İzle</span>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${anime.title}</h3>
          <span class="card-meta">${anime.genre} · ${anime.eps} Bölüm</span>
        </div>
      </div>
    `;
  };

  const populateRow = (rowId, items) => {
    const row = document.getElementById(rowId);
    if (row) {
      row.innerHTML = items.map(createCard).join('');
    }
  };

  const createContinueCard = (anime) => {
    return `
      <div class="anime-card continue-card-item" data-id="${anime.id}" data-season="${anime.currentSeason}" data-ep="${anime.currentEp}" data-progress="${anime.progress}">
        <div class="card-img-wrapper">
          <img src="${anime.img}" alt="${anime.title}" class="card-img" loading="lazy" />
          <div class="card-badge" style="background: var(--sakura-pink);">S:${anime.currentSeason} B:${anime.currentEp}</div>
          <button class="card-add-btn" aria-label="Listeye Ekle">+</button>
          <div class="card-overlay">
            <span class="play-text">Devam Et</span>
          </div>
          <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 6px; background: rgba(0,0,0,0.5);">
            <div style="height: 100%; width: ${anime.progress}%; background: var(--warm-heart-red); border-radius: 0 2px 2px 0;"></div>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${anime.title}</h3>
          <span class="card-meta">Kaldığın yerden devam et...</span>
        </div>
      </div>
    `;
  };

  const continueAnimesData = [
    { ...animes[4], progress: 65, currentSeason: 2, currentEp: 12 },
    { ...animes[7], progress: 30, currentSeason: 1, currentEp: 4 },
    { ...animes[2], progress: 90, currentSeason: 1, currentEp: 1 }
  ];

  const populateContinueRow = () => {
    const row = document.getElementById('continue-row');
    if (row) {
      row.innerHTML = continueAnimesData.map(createContinueCard).join('');
    }
  };

  populateContinueRow();
  populateRow('popular-row', animes);
  populateRow('new-row', [...animes].reverse());
  populateRow('rec-row', [...animes].sort(() => 0.5 - Math.random()));

  // ─── FETCH FROM SUPABASE ───
  const loadRealAnimes = async () => {
    try {
      const { data, error } = await supabaseClient.from('animes').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const realAnimes = data.map(a => ({
          id: a.id,
          title: a.title,
          genre: a.genre || 'Diğer',
          img: a.img || 'https://via.placeholder.com/400x600?text=Kapak+Yok',
          eps: (a.seasons * 12) + '?' // Şimdilik yaklaşık bölüm sayısı
        }));
        
        animes = [...realAnimes, ...animes];
        
        populateRow('popular-row', animes);
        populateRow('new-row', [...animes].reverse());
        populateRow('rec-row', [...animes].sort(() => 0.5 - Math.random()));
      }
    } catch (err) {
      console.error("Animeler yüklenirken hata oluştu:", err);
    }
  };
  loadRealAnimes();

  // ─── CAROUSEL CONTROLS ───
  const setupCarousel = (prevBtnId, nextBtnId, rowId) => {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const row = document.getElementById(rowId);
    
    if (!prevBtn || !nextBtn || !row) return;

    const scrollAmount = 300;

    prevBtn.addEventListener('click', () => {
      row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  };

  setupCarousel('continue-prev', 'continue-next', 'continue-row');
  setupCarousel('popular-prev', 'popular-next', 'popular-row');
  setupCarousel('new-prev', 'new-next', 'new-row');
  setupCarousel('rec-prev', 'rec-next', 'rec-row');

  // ─── TOAST NOTIFICATION ───
  const toastContainer = document.getElementById('toast-container');
  const showToast = (message, icon = '🌸') => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Remove after 3s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Add to list functionality
  document.addEventListener('click', (e) => {
    if (e.target.closest('.card-add-btn')) {
      e.stopPropagation();
      showToast('Listeye eklendi!', '✨');
    }
  });

  // ─── PLAYER MODAL ───
  const playerModal = document.getElementById('player-modal');
  const playerClose = document.getElementById('player-close');
  const playerBackdrop = document.getElementById('player-backdrop');
  
  let currentEp = 0;
  let totalEps = 12;
  let currentSeason = 1;
  let totalSeasons = 3;
  const mockEpNames = ["Yeni Başlangıç", "Gizli Güç", "Karanlık Gece", "Umut Işığı", "Beklenmedik Misafir", "Sonsuz Yolculuk", "Geçmişin İzleri", "Büyük Savaş", "Kayıp Şehir", "Yeniden Doğuş", "Son Karar", "Barış Zamanı"];

  const setEpisode = (ep) => {
    if (ep < 1 || ep > totalEps) return;
    currentEp = ep;
    const epBtns = document.querySelectorAll('.ep-btn');
    epBtns.forEach(b => b.classList.remove('active'));
    
    const activeBtn = Array.from(epBtns).find(b => parseInt(b.dataset.ep) === ep);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.getElementById('player-meta').textContent = `Sezon ${currentSeason} · Bölüm ${ep} · HD`;
    
    // Show player controls and play icon
    document.querySelector('.player-controls').style.opacity = '1';
    document.querySelector('.player-controls').style.pointerEvents = 'auto';
    
    const playerVideo = document.getElementById('player-video');
    const videoPlaceholder = document.getElementById('video-placeholder');
    if (playerVideo && videoPlaceholder) {
      videoPlaceholder.style.display = 'none';
      playerVideo.style.display = 'block';
      const sampleVideos = [
        "https://www.w3schools.com/html/mov_bbb.mp4",
        "https://media.w3.org/2010/05/sintel/trailer.mp4"
      ];
      playerVideo.src = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
      
      const playPromise = playerVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Auto-play prevented", e);
          playerVideo.muted = true;
          playerVideo.play();
        });
      }
      
      const ctrlPlay = document.getElementById('ctrl-play');
      if (ctrlPlay) {
        ctrlPlay.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      }
    }
    
    // Update next episode banner
    const nextBanner = document.getElementById('next-ep-banner');
    if (ep < totalEps) {
      nextBanner.style.display = 'flex';
      const nextName = mockEpNames[(ep) % mockEpNames.length] || "Sıradaki Macera";
      document.getElementById('next-ep-title').textContent = `Bölüm ${ep + 1}: ${nextName}`;
    } else {
      nextBanner.style.display = 'none';
    }
  };

  const showEpisodes = (season) => {
    currentSeason = season;
    document.getElementById('sidebar-title').textContent = `${season}. Sezon Bölümleri`;
    document.getElementById('back-to-seasons').style.display = 'block';
    document.getElementById('seasons-list').style.display = 'none';
    
    const epList = document.getElementById('episodes-list');
    epList.style.display = 'flex';
    let epsHTML = '';
    for (let i = 1; i <= totalEps; i++) {
      const epName = mockEpNames[(i-1) % mockEpNames.length] || "Macera Devam Ediyor";
      epsHTML += `<button class="ep-btn" data-ep="${i}">Bölüm ${i}: ${epName}</button>`;
    }
    epList.innerHTML = epsHTML;

    const epBtns = epList.querySelectorAll('.ep-btn');
    epBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setEpisode(parseInt(btn.dataset.ep));
      });
    });
  };

  const showSeasons = () => {
    document.getElementById('sidebar-title').textContent = 'Sezonlar';
    document.getElementById('back-to-seasons').style.display = 'none';
    document.getElementById('episodes-list').style.display = 'none';
    document.getElementById('next-ep-banner').style.display = 'none';
    
    // Reset player state (hide controls, show prompt)
    currentEp = 0;
    document.getElementById('player-meta').textContent = 'Sezon ve Bölüm Seçin';
    document.querySelector('.player-controls').style.opacity = '0.3';
    document.querySelector('.player-controls').style.pointerEvents = 'none';
    
    const playerVideo = document.getElementById('player-video');
    const videoPlaceholder = document.getElementById('video-placeholder');
    if (playerVideo && videoPlaceholder) {
      playerVideo.style.display = 'none';
      playerVideo.pause();
      videoPlaceholder.style.display = 'flex';
      document.querySelector('.video-play-icon').style.display = 'none';
      document.querySelector('#video-anime-title').nextElementSibling.textContent = 'İzlemeye başlamak için lütfen sağ taraftan bir sezon ve bölüm seçin.';
    }

    const seasonsList = document.getElementById('seasons-list');
    seasonsList.style.display = 'flex';
    let seasonsHTML = '';
    for (let i = 1; i <= totalSeasons; i++) {
      seasonsHTML += `<button class="ep-btn season-btn" data-season="${i}">${i}. Sezon</button>`;
    }
    seasonsList.innerHTML = seasonsHTML;
    
    const seasonBtns = seasonsList.querySelectorAll('.season-btn');
    seasonBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        showEpisodes(parseInt(btn.dataset.season));
      });
    });
  };

  document.getElementById('back-to-seasons').addEventListener('click', showSeasons);

  const openPlayer = (title, epsCount = 12, seasonsCount = 3, resumeSeason = null, resumeEp = null) => {
    totalEps = epsCount;
    totalSeasons = seasonsCount;
    document.getElementById('player-title').textContent = title;
    document.getElementById('video-anime-title').textContent = title;
    
    if (resumeSeason && resumeEp) {
      showSeasons();
      showEpisodes(resumeSeason);
      setEpisode(resumeEp);
    } else {
      showSeasons();
    }

    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  // Next / Prev buttons
  const nextEpBtnBanner = document.getElementById('next-ep-btn');
  if (nextEpBtnBanner) nextEpBtnBanner.addEventListener('click', () => setEpisode(currentEp + 1));
  
  const ctrlNextEp = document.getElementById('ctrl-next-ep');
  if (ctrlNextEp) ctrlNextEp.addEventListener('click', () => setEpisode(currentEp + 1));
  
  const ctrlPrevEp = document.getElementById('ctrl-prev-ep');
  if (ctrlPrevEp) ctrlPrevEp.addEventListener('click', () => setEpisode(currentEp - 1));

  const closePlayer = () => {
    playerModal.classList.remove('active');
    document.body.style.overflow = '';
    const playerVideo = document.getElementById('player-video');
    if (playerVideo) playerVideo.pause();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playerVideo = document.getElementById('player-video');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const progressThumb = document.getElementById('progress-thumb');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal = document.getElementById('time-total');
  const ctrlPlay = document.getElementById('ctrl-play');

  if (playerVideo) {
    if (ctrlPlay) {
      playerVideo.addEventListener('play', () => {
        ctrlPlay.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      });
      playerVideo.addEventListener('pause', () => {
        ctrlPlay.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      });
      ctrlPlay.addEventListener('click', () => {
        if (playerVideo.paused) playerVideo.play();
        else playerVideo.pause();
      });
    }

    playerVideo.addEventListener('timeupdate', () => {
      if (!playerVideo.duration) return;
      const percentage = (playerVideo.currentTime / playerVideo.duration) * 100;
      if (progressFill) progressFill.style.width = `${percentage}%`;
      if (progressThumb) progressThumb.style.left = `${percentage}%`;
      if (timeCurrent) timeCurrent.textContent = formatTime(playerVideo.currentTime);
    });

    playerVideo.addEventListener('loadedmetadata', () => {
      if (timeTotal) timeTotal.textContent = formatTime(playerVideo.duration);
    });

    if (progressBar) {
      const seekVideo = (e) => {
        if (!playerVideo.duration) return;
        const rect = progressBar.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));
        playerVideo.currentTime = pos * playerVideo.duration;
      };

      let isDragging = false;
      progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        seekVideo(e);
      });
      document.addEventListener('mousemove', (e) => {
        if (isDragging) seekVideo(e);
      });
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  // Click on card to play
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.anime-card');
    if (card && !e.target.closest('.card-add-btn')) {
      const title = card.querySelector('.card-title').textContent;
      // Get episode count if available from mock data
      const animeId = parseInt(card.dataset.id);
      const anime = animes.find(a => a.id === animeId);
      const eps = anime ? anime.eps : 12;
      
      let resumeSeason = null;
      let resumeEp = null;
      if (card.dataset.season && card.dataset.ep) {
        resumeSeason = parseInt(card.dataset.season);
        resumeEp = parseInt(card.dataset.ep);
      }
      
      openPlayer(title, eps, eps > 12 ? 2 : 1, resumeSeason, resumeEp);
    }
  });

  // ─── RANDOM FEATURED ANIME ───
  const setRandomFeatured = () => {
    const randomAnime = animes[Math.floor(Math.random() * animes.length)];
    
    // Update DOM elements
    const featuredImg = document.getElementById('featured-img');
    const featuredTitle = document.getElementById('featured-title');
    const featuredGenre = document.getElementById('featured-genre');
    
    if (featuredImg) featuredImg.src = randomAnime.img;
    if (featuredTitle) featuredTitle.textContent = randomAnime.title;
    if (featuredGenre) featuredGenre.textContent = randomAnime.genre;
    
    // Update Play buttons
    const featuredBtn = document.getElementById('featured-play-btn');
    const heroStartBtn = document.getElementById('hero-start-btn');
    
    const clickHandler = () => {
      openPlayer(randomAnime.title, randomAnime.eps, randomAnime.eps > 12 ? 2 : 1);
    };
    
    // Remove old listeners by cloning (quick way to reset listeners) if needed, 
    // but here we just attach since it only runs once on load.
    if (featuredBtn) {
      featuredBtn.onclick = clickHandler;
    }
    if (heroStartBtn) {
      heroStartBtn.onclick = clickHandler;
    }
  };
  
  setRandomFeatured();

  if (playerClose) playerClose.addEventListener('click', closePlayer);
  if (playerBackdrop) playerBackdrop.addEventListener('click', closePlayer);

  // ─── LOGIN / REGISTER MODAL (Supabase) ───
  const loginModal = document.getElementById('login-modal');
  const loginBtn = document.getElementById('login-btn');
  const loginClose = document.getElementById('login-close');
  const loginForm = document.getElementById('login-form');
  const loginSubmitBtn = document.getElementById('login-submit-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalSub = document.getElementById('modal-sub');
  const modalSwitchText = document.getElementById('modal-switch-text');
  const switchToRegister = document.getElementById('switch-to-register');
  const nameGroup = document.getElementById('name-group');
  const nameInput = document.getElementById('name-input');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const loginMenuBtn = document.getElementById('login-btn');
  const userMenu = document.getElementById('user-menu');
  const userEmailDisplay = document.getElementById('user-email-display');
  const logoutBtn = document.getElementById('logout-btn');

  let isRegisterMode = false;

  const setMode = (register) => {
    isRegisterMode = register;
    if (register) {
      modalTitle.textContent = 'Hesap Oluştur 🌸';
      modalSub.textContent = 'Kokoro Anime dünyasına katıl!';
      loginSubmitBtn.textContent = 'Kayıt Ol';
      nameGroup.style.display = 'block';
      modalSwitchText.innerHTML = 'Zaten hesabın var mı? <a href="#" id="switch-to-register">Giriş Yap</a>';
    } else {
      modalTitle.textContent = 'Hoş Geldin 🌸';
      modalSub.textContent = 'İzleme geçmişin ve listelerini kaydet';
      loginSubmitBtn.textContent = 'Giriş Yap';
      nameGroup.style.display = 'none';
      modalSwitchText.innerHTML = 'Hesabın yok mu? <a href="#" id="switch-to-register">Kayıt Ol</a>';
    }
    // Yeni link için tekrar event ekle
    document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      setMode(!isRegisterMode);
    });
  };

  const openLogin = () => {
    setMode(false);
    loginModal.classList.add('active');
  };

  const closeLogin = () => {
    loginModal.classList.remove('active');
    if (loginForm) loginForm.reset();
  };

  const updateNavbar = async (user) => {
    if (user) {
      loginMenuBtn.style.display = 'none';
      userMenu.style.display = 'flex';
      const email = user.email || '';
      userEmailDisplay.textContent = email.split('@')[0];

      // Admin rolünü kontrol et
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const adminBtn = document.getElementById('admin-panel-btn');
      if (profile?.role === 'admin') {
        if (adminBtn) adminBtn.style.display = 'inline-flex';
        window._isAdmin = true;
      } else {
        if (adminBtn) adminBtn.style.display = 'none';
        window._isAdmin = false;
      }
    } else {
      loginMenuBtn.style.display = 'block';
      userMenu.style.display = 'none';
      window._isAdmin = false;
      const adminBtn = document.getElementById('admin-panel-btn');
      if (adminBtn) adminBtn.style.display = 'none';
    }
  };

  // Auth state değişimini dinle (sayfa yüklendiğinde de çalışır)
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateNavbar(session?.user ?? null);
  });

  if (loginBtn) loginBtn.addEventListener('click', openLogin);
  if (loginClose) loginClose.addEventListener('click', closeLogin);
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLogin();
  });

  // Çıkış
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      showToast('Güvenle çıkış yapıldı!', '🌸');
    });
  }

  // Form gönder
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const name = nameInput ? nameInput.value.trim() : '';

      if (!email || !password) {
        showToast('E-posta ve şifre girin!', '⚠️');
        return;
      }

      loginSubmitBtn.disabled = true;
      loginSubmitBtn.textContent = isRegisterMode ? 'Kayıt oluyor...' : 'Giriş yapılıyor...';

      if (isRegisterMode) {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { username: name } }
        });
        if (error) {
          showToast(error.message, '❌');
        } else {
          showToast('Kayıt başarılı! Lütfen e-posta adresini doğrula 📧', '🌸');
          closeLogin();
        }
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          showToast('Hatalı e-posta veya şifre!', '❌');
        } else {
          showToast('Hoş geldin! 🌸', '✨');
          closeLogin();
        }
      }

      loginSubmitBtn.disabled = false;
      loginSubmitBtn.textContent = isRegisterMode ? 'Kayıt Ol' : 'Giriş Yap';
    });
  }

  // İlk mod ayarı
  setMode(false);

  // ─── SEARCH OVERLAY ───
  const searchOverlay = document.getElementById('search-overlay');
  const searchToggle = document.getElementById('search-toggle-btn');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const openSearch = () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  };

  const closeSearch = () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  };

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (val.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = animes.filter(a => a.title.toLowerCase().includes(val));
    if (results.length > 0) {
      searchResults.innerHTML = results.map(createCard).join('');
    } else {
      searchResults.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted)">Anime bulunamadı 🌸</p>';
    }
  });

  // ─── LIST TABS ───
  const tabs = document.querySelectorAll('.list-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Tab switching logic (mock)
      const grid = document.getElementById('list-grid');
      grid.innerHTML = `
        <div class="list-empty">
          <div class="empty-icon">🌸</div>
          <p>${tab.textContent} listeniz şu an boş.<br/>Anime kartlarına tıklayarak ekleyebilirsiniz.</p>
        </div>
      `;
    });
  });

  // ─── GENRE CHIPS ───
  const genreChips = document.querySelectorAll('.genre-chip');
  const popularRow = document.getElementById('popular-row');
  const popularTitle = document.querySelector('#popular-section .section-title');

  genreChips.forEach(chip => {
    chip.addEventListener('click', () => {
      genreChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const selectedGenre = chip.dataset.genre;
      
      if (selectedGenre === 'all') {
        if (popularTitle) popularTitle.textContent = 'Popüler Animeler';
        if (popularRow) popularRow.innerHTML = animes.map(createCard).join('');
      } else {
        // Extract text content without emojis
        const targetGenreText = chip.textContent.replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '').trim(); 
        
        if (popularTitle) popularTitle.textContent = `${targetGenreText} Animeleri`;
        
        const filtered = animes.filter(a => a.genre.toLowerCase() === targetGenreText.toLowerCase());
        
        if (popularRow) {
          if (filtered.length > 0) {
            popularRow.innerHTML = filtered.map(createCard).join('');
          } else {
            popularRow.innerHTML = `<div style="padding: 2rem; width: 100%; text-align: center; color: var(--text-muted);">Bu türde anime bulunamadı 🌸</div>`;
          }
        }
      }
    });
  });

  // ─── ADMIN PANEL ───
  const adminModal = document.getElementById('admin-modal');
  const adminPanelBtn = document.getElementById('admin-panel-btn');
  const adminClose = document.getElementById('admin-close');

  const openAdminPanel = async () => {
    adminModal.classList.add('active');
    await loadAnimesForSelect();
  };

  const closeAdminPanel = () => {
    adminModal.classList.remove('active');
  };

  if (adminPanelBtn) adminPanelBtn.addEventListener('click', openAdminPanel);
  if (adminClose) adminClose.addEventListener('click', closeAdminPanel);
  if (adminModal) adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) closeAdminPanel();
  });

  // Sekme geçişi
  const adminTabBtns = document.querySelectorAll('.admin-tab');
  adminTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      adminTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      document.getElementById(`admin-tab-${tab.dataset.tab}`).style.display = 'block';
    });
  });

  // Anime listesini select'e yükle
  const loadAnimesForSelect = async () => {
    const { data, error } = await supabaseClient.from('animes').select('id, title').order('title');
    const select = document.getElementById('ep-anime-select');
    if (!select) return;
    if (error || !data?.length) {
      select.innerHTML = '<option value="">Önce anime ekleyin</option>';
      return;
    }
    select.innerHTML = data.map(a => `<option value="${a.id}">${a.title}</option>`).join('');
  };

  // Anime Ekle Formu
  const addAnimeForm = document.getElementById('add-anime-form');
  if (addAnimeForm) {
    addAnimeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('anime-title-input').value.trim();
      const genre = document.getElementById('anime-genre-input').value;
      const img = document.getElementById('anime-img-input').value.trim();
      const seasons = parseInt(document.getElementById('anime-seasons-input').value);

      const submitBtn = document.getElementById('add-anime-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Ekleniyor...';

      const { error } = await supabaseClient.from('animes').insert({
        title, genre, img, seasons, created_at: new Date().toISOString()
      });

      if (error) {
        showToast('Hata: ' + error.message, '❌');
      } else {
        showToast(`"${title}" eklendi! 🎌`, '✨');
        addAnimeForm.reset();
        await loadAnimesForSelect();
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Anime Ekle';
    });
  }

  // Bölüm / Video Ekle Formu
  const addEpisodeForm = document.getElementById('add-episode-form');
  if (addEpisodeForm) {
    addEpisodeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const animeId = document.getElementById('ep-anime-select').value;
      const season = parseInt(document.getElementById('ep-season-input').value);
      const episode = parseInt(document.getElementById('ep-number-input').value);
      const name = document.getElementById('ep-name-input').value.trim();
      const videoUrl = document.getElementById('ep-video-input').value.trim();

      const submitBtn = document.getElementById('add-episode-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Ekleniyor...';

      const { error } = await supabaseClient.from('episodes').insert({
        anime_id: animeId, season, episode, name, video_url: videoUrl,
        created_at: new Date().toISOString()
      });

      if (error) {
        showToast('Hata: ' + error.message, '❌');
      } else {
        showToast(`S${season} B${episode} eklendi! 🎬`, '✨');
        addEpisodeForm.reset();
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Bölüm Ekle';
    });
  }
});
