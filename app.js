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
  let animes = [];

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

  const continueAnimesData = [];

  const populateContinueRow = () => {
    const row = document.getElementById('continue-row');
    if (row) {
      row.innerHTML = continueAnimesData.map(createContinueCard).join('');
    }
  };

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
        
        animes = [...realAnimes];
        
        populateRow('popular-row', animes);
        populateRow('new-row', [...animes].reverse());
        populateRow('rec-row', [...animes].sort(() => 0.5 - Math.random()));
        setRandomFeatured();
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

  // ─── GÖRSEL YÜKLEME (imgbb + wsrv.nl) — hem forum hem admin panelinde kullanılır ───
  const IMGBB_API_KEY = '273b87e235f85d989e9ed809490193c9';
  const MAX_IMAGE_MB = 5;

  // Seçilen dosyayı imgbb'ye yükler, kalıcı bir görsel URL'si döndürür
  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('[Görsel] imgbb yanıtı:', data);
    if (!data || !data.success) throw new Error('imgbb yükleme başarısız: ' + JSON.stringify(data));
    return data.data.url; // doğrudan görsel linki (i.ibb.co/...)
  };

  // wsrv.nl üzerinden görseli yeniden boyutlandırıp optimize eden URL üretir
  // wsrv.nl kendisi depolama yapmaz; zaten var olan bir URL'yi proxy'ler.
  const wsrvUrl = (url, { w, h, q = 80, fit = 'cover', bg } = {}) => {
    if (!url) return '';
    const params = new URLSearchParams({ url, q: String(q), fit });
    if (w) params.set('w', String(w));
    if (h) params.set('h', String(h));
    if (bg) params.set('bg', bg);
    return `https://wsrv.nl/?${params.toString()}`;
  };

  // Dosya seçme + önizleme mantığını tek bir yerden yönetir (ID çakışmasını önlemek için).
  // Elemanlardan biri sayfada yoksa sessizce atlar (o form o sayfada olmayabilir).
  const setupImagePicker = ({ inputId, previewId, previewImgId, removeId }) => {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const previewImg = document.getElementById(previewImgId);
    const removeBtn = document.getElementById(removeId);

    if (!input || !preview || !previewImg) {
      return { getFile: () => null, clear: () => {} };
    }

    const clear = () => {
      input.value = '';
      preview.style.display = 'none';
      previewImg.src = '';
    };

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) { clear(); return; }

      if (!file.type.startsWith('image/')) {
        showToast('Lütfen bir görsel dosyası seç.', '⚠️');
        clear();
        return;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        showToast(`Görsel en fazla ${MAX_IMAGE_MB}MB olabilir.`, '⚠️');
        clear();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    if (removeBtn) removeBtn.addEventListener('click', clear);

    return { getFile: () => input.files?.[0] || null, clear };
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
  let currentSeason = 1;
  let currentEpisodesData = []; // Veritabanından gelen bölümler
  let currentSeasonsList = []; // [1, 2, 3] gibi mevcut sezonlar
  let isMockAnime = true;

  const setEpisode = (epNumber) => {
    currentEp = epNumber;
    const epBtns = document.querySelectorAll('.ep-btn');
    epBtns.forEach(b => b.classList.remove('active'));
    
    const activeBtn = Array.from(epBtns).find(b => parseInt(b.dataset.ep) === currentEp);
    if (activeBtn) activeBtn.classList.add('active');
    
    document.getElementById('player-meta').textContent = `Sezon ${currentSeason} · Bölüm ${currentEp} · HD`;
    
    const playerVideo = document.getElementById('player-video');
    const playerIframe = document.getElementById('player-iframe');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const playerControls = document.querySelector('.player-controls');

    if (videoPlaceholder) videoPlaceholder.style.display = 'none';

    // Bölüm URL'sini belirle
    let videoUrl = "";
    let epName = "Bölüm";
    let hasNext = false;
    let nextEpName = "Sonraki Bölüm";

    if (isMockAnime) {
      const mockEpNames = ["Yeni Başlangıç", "Gizli Güç", "Karanlık Gece", "Umut Işığı"];
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      epName = mockEpNames[(epNumber-1) % mockEpNames.length];
      hasNext = epNumber < 12;
      nextEpName = mockEpNames[epNumber % mockEpNames.length];
    } else {
      const epData = currentEpisodesData.find(e => e.season === currentSeason && e.episode === epNumber);
      if (epData) {
        videoUrl = epData.video_url;
        epName = epData.name;
        const nextEpData = currentEpisodesData.find(e => e.season === currentSeason && e.episode === epNumber + 1);
        if (nextEpData) {
          hasNext = true;
          nextEpName = nextEpData.name || "Sonraki Bölüm";
        }
      }
    }

    // Embed (iframe) mi yoksa normal MP4 mü?
    if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || isMockAnime) {
      if (playerIframe) playerIframe.style.display = 'none';
      if (playerVideo) {
        playerVideo.style.display = 'block';
        playerVideo.src = videoUrl;
        playerControls.style.opacity = '1';
        playerControls.style.pointerEvents = 'auto';
        playerVideo.play().catch(e => {
          playerVideo.muted = true;
          playerVideo.play();
        });
      }
    } else {
      // Üçüncü parti sağlayıcı (Tau Video vb.)
      if (playerVideo) {
        playerVideo.style.display = 'none';
        playerVideo.pause();
      }
      if (playerIframe) {
        playerIframe.style.display = 'block';
        playerIframe.src = videoUrl;
      }
      // Iframe'in kendi kontrolleri olduğu için bizimkileri gizle
      playerControls.style.opacity = '0';
      playerControls.style.pointerEvents = 'none';
    }
    
    // Update next episode banner
    const nextBanner = document.getElementById('next-ep-banner');
    if (hasNext) {
      nextBanner.style.display = 'flex';
      document.getElementById('next-ep-title').textContent = `Bölüm ${currentEp + 1}: ${nextEpName}`;
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

    if (isMockAnime) {
      for (let i = 1; i <= 12; i++) {
        epsHTML += `<button class="ep-btn" data-ep="${i}">Bölüm ${i}</button>`;
      }
    } else {
      const seasonEps = currentEpisodesData.filter(e => e.season === season);
      if (seasonEps.length === 0) {
        epsHTML = `<div style="padding:1rem; text-align:center; color:var(--text-muted);">Henüz bölüm eklenmemiş</div>`;
      } else {
        seasonEps.forEach(ep => {
          epsHTML += `<button class="ep-btn" data-ep="${ep.episode}">Bölüm ${ep.episode}: ${ep.name || ''}</button>`;
        });
      }
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
    
    currentEp = 0;
    document.getElementById('player-meta').textContent = 'Sezon ve Bölüm Seçin';
    document.querySelector('.player-controls').style.opacity = '0.3';
    document.querySelector('.player-controls').style.pointerEvents = 'none';
    
    const playerVideo = document.getElementById('player-video');
    const playerIframe = document.getElementById('player-iframe');
    const videoPlaceholder = document.getElementById('video-placeholder');
    if (playerVideo && playerIframe && videoPlaceholder) {
      playerVideo.style.display = 'none';
      playerIframe.style.display = 'none';
      playerIframe.src = '';
      playerVideo.pause();
      videoPlaceholder.style.display = 'flex';
      document.querySelector('.video-play-icon').style.display = 'none';
      document.querySelector('#video-anime-title').nextElementSibling.textContent = 'İzlemeye başlamak için lütfen sağ taraftan bir sezon ve bölüm seçin.';
    }

    const seasonsList = document.getElementById('seasons-list');
    seasonsList.style.display = 'flex';
    let seasonsHTML = '';

    if (isMockAnime) {
      for (let i = 1; i <= 3; i++) {
        seasonsHTML += `<button class="ep-btn season-btn" data-season="${i}">${i}. Sezon</button>`;
      }
    } else {
      if (currentSeasonsList.length === 0) {
        seasonsHTML = `<div style="padding:1rem; text-align:center; color:var(--text-muted);">Henüz sezon eklenmemiş</div>`;
      } else {
        currentSeasonsList.forEach(s => {
          seasonsHTML += `<button class="ep-btn season-btn" data-season="${s}">${s}. Sezon</button>`;
        });
      }
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

  const openPlayer = async (animeIdStr, title, resumeSeason = null, resumeEp = null) => {
    document.getElementById('player-title').textContent = title;
    document.getElementById('video-anime-title').textContent = title;
    
    // UUID veya ID kontrolü yerine artık kesin olarak string başında 'mock-' olup olmadığına bakıyoruz
    isMockAnime = animeIdStr ? String(animeIdStr).startsWith('mock-') : false;
    
    if (!isMockAnime) {
      const { data, error } = await supabaseClient
        .from('episodes')
        .select('*')
        .eq('anime_id', animeIdStr)
        .order('season', { ascending: true })
        .order('episode', { ascending: true });
        
      if (!error && data) {
        currentEpisodesData = data;
        currentSeasonsList = [...new Set(data.map(e => e.season))];
      }
    }
    
    if (resumeSeason && resumeEp) {
      showSeasons();
      showEpisodes(resumeSeason);
      setEpisode(resumeEp);
    } else {
      showSeasons();
      // Eğer sadece tek sezon varsa otomatik olarak bölümleri aç
      if (!isMockAnime && currentSeasonsList.length === 1) {
        showEpisodes(currentSeasonsList[0]);
      }
    }

    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
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
      const animeIdStr = card.dataset.id; // Artık string alıyoruz (UUID için)
      
      let resumeSeason = null;
      let resumeEp = null;
      if (card.dataset.season && card.dataset.ep) {
        resumeSeason = parseInt(card.dataset.season);
        resumeEp = parseInt(card.dataset.ep);
      }
      
      openPlayer(animeIdStr, title, resumeSeason, resumeEp);
    }
  });

  // ─── RANDOM FEATURED ANIME ───
  const setRandomFeatured = () => {
    if (animes.length === 0) return;
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
    const select = document.getElementById('ep-anime-select');
    try {
      if (select) select.innerHTML = '<option value="">Yükleniyor...</option>';
      
      const { data, error } = await supabaseClient.from('animes').select('id, title').order('title');
      
      if (error) {
        console.error("Animeler yüklenirken hata oluştu:", error);
        if (select) select.innerHTML = '<option value="">Bağlantı hatası</option>';
        return;
      }
      
      if (!data || data.length === 0) {
        if (select) select.innerHTML = '<option value="">Önce anime ekleyin</option>';
        return;
      }
      
      const options = data.map(a => `<option value="${a.id}">${a.title}</option>`).join('');
      if (select) select.innerHTML = options;
    } catch (e) {
      console.error("Beklenmeyen hata:", e);
      if (select) select.innerHTML = '<option value="">Bir hata oluştu</option>';
    }
  };

  // Anime kapak fotoğrafı seçimi → önizleme
  const animeCoverPicker = setupImagePicker({
    inputId: 'anime-cover-input',
    previewId: 'anime-cover-preview',
    previewImgId: 'anime-cover-preview-img',
    removeId: 'anime-cover-remove',
  });

  // Anime Ekle Formu
  const addAnimeForm = document.getElementById('add-anime-form');
  if (addAnimeForm) {
    addAnimeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('anime-title-input').value.trim();
      const genre = document.getElementById('anime-genre-input').value;
      const seasons = parseInt(document.getElementById('anime-seasons-input').value);

      const submitBtn = document.getElementById('add-anime-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Ekleniyor...';

      // Kapak fotoğrafı seçilmişse imgbb'ye yükle
      let img = 'https://via.placeholder.com/400x600?text=Kapak+Yok';
      const selectedCoverFile = animeCoverPicker.getFile();
      if (selectedCoverFile) {
        submitBtn.textContent = 'Kapak yükleniyor...';
        try {
          img = await uploadImageToImgbb(selectedCoverFile);
        } catch (err) {
          console.error('[Anime] Kapak yükleme hatası:', err);
          showToast('Kapak fotoğrafı yüklenemedi, varsayılan kapak kullanılacak.', '⚠️');
        }
        submitBtn.textContent = 'Ekleniyor...';
      }

      const { error } = await supabaseClient.from('animes').insert({
        title, genre, img, seasons, created_at: new Date().toISOString()
      });

      if (error) {
        console.error('[Anime] Supabase ekleme hatası:', error);
        showToast('Hata: ' + error.message, '❌');
      } else {
        showToast(`"${title}" eklendi! 🎌`, '✨');
        addAnimeForm.reset();
        animeCoverPicker.clear();
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





  // ─── FORUM ───
  const AVATARS = ['🌸', '🦊', '🐼', '🐱', '🌙', '⭐', '🎌', '🦋', '🍡', '🎏'];
  const CAT_LABELS = { tavsiye: '💡 Tavsiye', tartisma: '🔥 Tartışma', teori: '🔮 Teori', 'fan-art': '🎨 Fan Art', duyuru: '📢 Duyuru' };

  // Mock posts for demo (loaded if DB is empty)
  const mockForumPosts = [
    { id: 'fp-1', title: 'Violet Evergarden izledim, hayatım değişti 😭', content: 'Bu anime beni bu kadar derinden etkileyeceğini hiç tahmin etmezdim. Her bölümde ağladım. Siz de izlediyseniz yorumlar bırakın!', category: 'tartisma', anime_tag: 'Violet Evergarden', author_name: 'SakuraFan', created_at: new Date(Date.now() - 2 * 3600000).toISOString(), likes: 42, comments_count: 8 },
    { id: 'fp-2', title: 'Jujutsu Kaisen 2. sezon teorim 🔮', content: 'Gojo\'nun seallanmasından sonra neler olacak? Bence Yuji yeni bir güç geliştirecek ve finale kadar beklenmedik bir karakter ölümü göreceğiz...', category: 'teori', anime_tag: 'Jujutsu Kaisen', author_name: 'OtakuKing', created_at: new Date(Date.now() - 5 * 3600000).toISOString(), likes: 31, comments_count: 14 },
    { id: 'fp-3', title: 'En iyi slice-of-life önerileri listesi ✨', content: 'Bugün rahatlatıcı anime arıyorsanız: 1) Yuru Camp 2) Non Non Biyori 3) Barakamon 4) Silver Spoon — bunları kesinlikle deneyin!', category: 'tavsiye', anime_tag: null, author_name: 'CalmVibes', created_at: new Date(Date.now() - 24 * 3600000).toISOString(), likes: 67, comments_count: 23 },
    { id: 'fp-4', title: 'Frieren fan artım 🎨 (kendi çizimim)', content: 'Frieren karakterini pastel renklerle çizdim, umarım beğenirsiniz! Çizim yapmaya yeni başlıyorum, eleştirilerinizi bekliyorum 🌸', category: 'fan-art', anime_tag: 'Frieren', author_name: 'ArtistAkane', created_at: new Date(Date.now() - 48 * 3600000).toISOString(), likes: 88, comments_count: 31 },
    { id: 'fp-5', title: 'Yeni sezon duyuruları - Yaz 2026', content: 'Bu sezon çok heyecan verici animeler başlıyor! Hangi animeyi en çok bekliyorsunuz? Ben kesinlikle yeni isekai serisi için sabırsızlanıyorum.', category: 'duyuru', anime_tag: null, author_name: 'AnimeNews', created_at: new Date(Date.now() - 72 * 3600000).toISOString(), likes: 55, comments_count: 19 },
    { id: 'fp-6', title: 'Your Name ve A Silent Voice karşılaştırması', content: 'Her ikisi de Makoto Shinkai\'nin başyapıtları mı? Yoksa A Silent Voice Kyoto Animation\'ın eseri mi? Hangi animeyi daha çok sevdiniz ve neden?', category: 'tartisma', anime_tag: null, author_name: 'CinemaOtaku', created_at: new Date(Date.now() - 96 * 3600000).toISOString(), likes: 74, comments_count: 42 },
  ];

  let forumPosts = [];
  let activeCat = 'all';
  let openPostId = null;

  // LocalStorage helpers for likes
  const getLikedPosts = () => JSON.parse(localStorage.getItem('kk_liked_posts') || '[]');
  const toggleLike = (id) => {
    const liked = getLikedPosts();
    const idx = liked.indexOf(id);
    if (idx > -1) { liked.splice(idx, 1); } else { liked.push(id); }
    localStorage.setItem('kk_liked_posts', JSON.stringify(liked));
    return idx === -1; // returns true if now liked
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
    return new Date(dateStr).toLocaleDateString('tr-TR');
  };

  const renderForumCard = (post) => {
    const likedPosts = getLikedPosts();
    const isLiked = likedPosts.includes(post.id);
    const avatarEmoji = AVATARS[Math.abs(post.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATARS.length];
    return `
      <div class="forum-card" data-post-id="${post.id}" id="fcard-${post.id}">
        <div class="forum-card-header">
          <div class="forum-author-avatar">${avatarEmoji}</div>
          <div class="forum-author-info">
            <div class="forum-author-name">${post.author_name || 'Anonim'}</div>
            <div class="forum-post-date">${timeAgo(post.created_at)}</div>
          </div>
          <span class="forum-cat-badge ${post.category}">${CAT_LABELS[post.category] || post.category}</span>
        </div>
        ${post.image_url ? `<img class="forum-card-img" src="${wsrvUrl(post.image_url, { w: 500, h: 340, fit: 'inside' })}" alt="Gönderi görseli" loading="lazy" onerror="this.onerror=null;this.src='${post.image_url}';" />` : ''}
        <div class="forum-card-title">${post.title}</div>
        <div class="forum-card-excerpt">${post.content}</div>
        ${post.anime_tag ? `<span class="forum-card-anime-tag">🎌 ${post.anime_tag}</span>` : ''}
        <div class="forum-card-footer">
          <button class="forum-like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}" id="like-btn-${post.id}">
            ${isLiked ? '❤️' : '🤍'} <span id="like-count-${post.id}">${post.likes || 0}</span>
          </button>
          <div class="forum-stat">💬 <span>${post.comments_count || 0}</span></div>
        </div>
      </div>
    `;
  };

  const renderForumGrid = (posts) => {
    const grid = document.getElementById('forum-grid');
    if (!grid) return;
    if (!posts || posts.length === 0) {
      grid.innerHTML = `<div class="forum-empty"><div class="empty-icon">🌸</div><p>Henüz gönderi yok.<br/>İlk gönderiyi sen paylaş!</p></div>`;
      return;
    }
    grid.innerHTML = posts.map(renderForumCard).join('');
  };

  const getFilteredPosts = () => {
    if (activeCat === 'all') return forumPosts;
    return forumPosts.filter(p => p.category === activeCat);
  };

  // ─── Yerel yedek gönderiler ───
  // Supabase'e kaydedilemeyen (örn. tablo/kolon eksikse) gönderiler burada tutulur,
  // böylece sayfa yenilense bile kaybolmazlar.
  const getLocalForumPosts = () => {
    try {
      return JSON.parse(localStorage.getItem('kk_local_forum_posts') || '[]');
    } catch (_) {
      return [];
    }
  };
  const saveLocalForumPost = (post) => {
    const posts = getLocalForumPosts();
    posts.unshift(post);
    localStorage.setItem('kk_local_forum_posts', JSON.stringify(posts.slice(0, 100)));
  };

  const loadForumPosts = async () => {
    const grid = document.getElementById('forum-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="forum-loading"><div class="forum-spinner"></div><p>Gönderiler yükleniyor...</p></div>`;

    try {
      const { data, error } = await supabaseClient
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        forumPosts = data;
      } else {
        if (error) console.error('[Forum] Supabase gönderi çekme hatası:', error);
        // Supabase yoksa mock data kullan
        forumPosts = mockForumPosts;
      }
    } catch (e) {
      console.error('[Forum] Supabase bağlantı hatası:', e);
      forumPosts = mockForumPosts;
    }

    // Supabase'e yazılamamış, yerelde tutulan gönderileri en başa ekle
    const localPosts = getLocalForumPosts();
    const existingIds = new Set(forumPosts.map(p => String(p.id)));
    const mergedLocal = localPosts.filter(p => !existingIds.has(String(p.id)));
    forumPosts = [...mergedLocal, ...forumPosts];

    renderForumGrid(getFilteredPosts());
  };

  loadForumPosts();

  // Category filter
  document.querySelectorAll('.forum-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.forum-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderForumGrid(getFilteredPosts());
    });
  });

  // Like button (event delegation)
  document.addEventListener('click', async (e) => {
    const likeBtn = e.target.closest('.forum-like-btn');
    if (likeBtn) {
      e.stopPropagation();
      const postId = likeBtn.dataset.postId;
      const nowLiked = toggleLike(postId);
      const post = forumPosts.find(p => String(p.id) === String(postId));
      if (post) {
        post.likes = (post.likes || 0) + (nowLiked ? 1 : -1);
        likeBtn.classList.toggle('liked', nowLiked);
        likeBtn.innerHTML = `${nowLiked ? '❤️' : '🤍'} <span id="like-count-${postId}">${post.likes}</span>`;
        // Try DB update (non-blocking)
        try {
          await supabaseClient.from('forum_posts').update({ likes: post.likes }).eq('id', postId);
        } catch (_) {}
      }
    }
  });

  // Open post detail
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.forum-card');
    if (card && !e.target.closest('.forum-like-btn')) {
      const postId = card.dataset.postId;
      openForumDetail(postId);
    }
  });

  const openForumDetail = async (postId) => {
    openPostId = postId;
    const post = forumPosts.find(p => String(p.id) === String(postId));
    if (!post) return;

    const likedPosts = getLikedPosts();
    const isLiked = likedPosts.includes(String(postId));
    const avatarEmoji = AVATARS[Math.abs(String(postId).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % AVATARS.length];

    const detailContent = document.getElementById('forum-detail-content');
    detailContent.innerHTML = `
      <div class="forum-detail-header">
        <div class="forum-detail-meta">
          <div class="forum-author-avatar">${avatarEmoji}</div>
          <div class="forum-author-info">
            <div class="forum-author-name">${post.author_name || 'Anonim'}</div>
            <div class="forum-post-date">${timeAgo(post.created_at)}</div>
          </div>
          <span class="forum-cat-badge ${post.category}">${CAT_LABELS[post.category] || post.category}</span>
          ${post.anime_tag ? `<span class="forum-card-anime-tag">🎌 ${post.anime_tag}</span>` : ''}
        </div>
        <div class="forum-detail-title">${post.title}</div>
        ${post.image_url ? `<img class="forum-detail-img" src="${wsrvUrl(post.image_url, { w: 900, q: 85, fit: 'inside' })}" alt="Gönderi görseli" loading="lazy" onerror="this.onerror=null;this.src='${post.image_url}';" />` : ''}
        <div class="forum-detail-body">${post.content}</div>
        <div class="forum-detail-actions">
          <button class="forum-like-btn ${isLiked ? 'liked' : ''}" data-post-id="${postId}" id="detail-like-btn">
            ${isLiked ? '❤️' : '🤍'} <span>${post.likes || 0}</span> Beğeni
          </button>
          <div class="forum-stat">💬 ${post.comments_count || 0} Yorum</div>
        </div>
      </div>
    `;

    loadComments(postId);

    document.getElementById('forum-detail-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeForumDetail = () => {
    document.getElementById('forum-detail-modal').classList.remove('active');
    document.body.style.overflow = '';
    openPostId = null;
  };

  document.getElementById('forum-detail-close').addEventListener('click', closeForumDetail);
  document.getElementById('forum-detail-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('forum-detail-modal')) closeForumDetail();
  });

  const loadComments = async (postId) => {
    const list = document.getElementById('forum-comments-list');
    list.innerHTML = `<div class="forum-comment-empty">Yorumlar yükleniyor...</div>`;

    try {
      const { data, error } = await supabaseClient
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data && data.length > 0) {
        renderComments(data);
      } else {
        list.innerHTML = `<div class="forum-comment-empty">Henüz yorum yok. İlk yorumu sen yap! 🌸</div>`;
      }
    } catch (e) {
      list.innerHTML = `<div class="forum-comment-empty">Henüz yorum yok. İlk yorumu sen yap! 🌸</div>`;
    }
  };

  const renderComments = (comments) => {
    const list = document.getElementById('forum-comments-list');
    if (!comments || comments.length === 0) {
      list.innerHTML = `<div class="forum-comment-empty">Henüz yorum yok. İlk yorumu sen yap! 🌸</div>`;
      return;
    }
    list.innerHTML = comments.map(c => {
      const av = AVATARS[Math.abs(String(c.id || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)) % AVATARS.length];
      return `
        <div class="forum-comment-item">
          <div class="forum-comment-avatar">${av}</div>
          <div class="forum-comment-bubble">
            <div class="forum-comment-author">${c.author_name || 'Anonim'}</div>
            <div class="forum-comment-text">${c.content}</div>
            <div class="forum-comment-time">${timeAgo(c.created_at)}</div>
          </div>
        </div>
      `;
    }).join('');
    list.scrollTop = list.scrollHeight;
  };

  // Comment form
  document.getElementById('forum-comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('forum-comment-input');
    const content = input.value.trim();
    if (!content) return;

    const { data: { user } } = await supabaseClient.auth.getUser();
    const authorName = user ? (user.user_metadata?.username || user.email?.split('@')[0] || 'Anonim') : 'Anonim';

    const submitBtn = document.getElementById('forum-comment-submit');
    submitBtn.disabled = true;

    const newComment = {
      post_id: openPostId,
      content,
      author_name: authorName,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabaseClient.from('forum_comments').insert(newComment).select().single();
      if (!error && data) {
        // Success: reload comments
        await loadComments(openPostId);
        // Update comment count
        const post = forumPosts.find(p => String(p.id) === String(openPostId));
        if (post) {
          post.comments_count = (post.comments_count || 0) + 1;
          await supabaseClient.from('forum_posts').update({ comments_count: post.comments_count }).eq('id', openPostId);
        }
      } else {
        // Mock fallback: show locally
        const list = document.getElementById('forum-comments-list');
        const emptyMsg = list.querySelector('.forum-comment-empty');
        if (emptyMsg) emptyMsg.remove();
        const av = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        list.insertAdjacentHTML('beforeend', `
          <div class="forum-comment-item">
            <div class="forum-comment-avatar">${av}</div>
            <div class="forum-comment-bubble">
              <div class="forum-comment-author">${authorName}</div>
              <div class="forum-comment-text">${content}</div>
              <div class="forum-comment-time">Az önce</div>
            </div>
          </div>
        `);
        list.scrollTop = list.scrollHeight;
      }
    } catch (_) {
      // Same local fallback
      const list = document.getElementById('forum-comments-list');
      const emptyMsg = list.querySelector('.forum-comment-empty');
      if (emptyMsg) emptyMsg.remove();
      const av = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      list.insertAdjacentHTML('beforeend', `
        <div class="forum-comment-item">
          <div class="forum-comment-avatar">${av}</div>
          <div class="forum-comment-bubble">
            <div class="forum-comment-author">${authorName}</div>
            <div class="forum-comment-text">${content}</div>
            <div class="forum-comment-time">Az önce</div>
          </div>
        </div>
      `);
      list.scrollTop = list.scrollHeight;
    }

    input.value = '';
    submitBtn.disabled = false;
  });

  // New Post Modal
  const forumModal = document.getElementById('forum-modal');
  const forumNewBtn = document.getElementById('forum-new-btn');
  const forumModalClose = document.getElementById('forum-modal-close');

  const openForumModal = () => {
    forumModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeForumModal = () => {
    forumModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (forumNewBtn) forumNewBtn.addEventListener('click', openForumModal);
  if (forumModalClose) forumModalClose.addEventListener('click', closeForumModal);
  forumModal.addEventListener('click', (e) => { if (e.target === forumModal) closeForumModal(); });

  // Fotoğraf seçimi → önizleme
  const forumImagePicker = setupImagePicker({
    inputId: 'forum-post-image',
    previewId: 'forum-image-preview',
    previewImgId: 'forum-image-preview-img',
    removeId: 'forum-image-remove',
  });

  // New Post Form Submit
  document.getElementById('forum-post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('forum-post-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Paylaşılıyor...';

    try {
      // Auth kontrolü
      let user = null;
      try {
        const { data } = await supabaseClient.auth.getUser();
        user = data?.user ?? null;
      } catch (_) {}

      if (!user) {
        showToast('Gönderi paylaşmak için giriş yapmalısın!', '⚠️');
        closeForumModal();
        openLogin();
        return;
      }

      const title = document.getElementById('forum-post-title').value.trim();
      const content = document.getElementById('forum-post-content').value.trim();
      const category = document.getElementById('forum-post-category').value;
      const animeTag = document.getElementById('forum-post-anime').value.trim() || null;
      const authorName = user.user_metadata?.username || user.email?.split('@')[0] || 'Anonim';

      if (!title || !content) {
        showToast('Başlık ve içerik zorunludur!', '⚠️');
        return;
      }

      // Fotoğraf seçilmişse önce imgbb'ye yükle
      let imageUrl = null;
      const selectedImageFile = forumImagePicker.getFile();
      if (selectedImageFile) {
        submitBtn.textContent = 'Fotoğraf yükleniyor...';
        try {
          imageUrl = await uploadImageToImgbb(selectedImageFile);
        } catch (err) {
          console.error('[Forum] Görsel yükleme hatası:', err);
          showToast('Fotoğraf yüklenemedi, gönderi görselsiz paylaşılacak.', '⚠️');
        }
        submitBtn.textContent = 'Paylaşılıyor...';
      }

      const newPost = {
        title,
        content,
        category,
        anime_tag: animeTag,
        image_url: imageUrl,
        author_name: authorName,
        likes: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
      };

      // Supabase'e kaydetmeyi dene, başarısız olursa local state'e (ve localStorage'a) ekle
      try {
        const { data: inserted, error } = await supabaseClient
          .from('forum_posts')
          .insert({ ...newPost, author_id: user.id })
          .select()
          .single();
        if (!error && inserted) {
          forumPosts.unshift(inserted);
        } else {
          console.error('[Forum] Supabase gönderi kaydetme hatası:', error);
          newPost.id = 'fp-local-' + Date.now();
          forumPosts.unshift(newPost);
          saveLocalForumPost(newPost);
          showToast('Gönderi buluta kaydedilemedi, cihazında saklanıyor.', 'ℹ️');
        }
      } catch (err) {
        console.error('[Forum] Supabase bağlantı hatası:', err);
        newPost.id = 'fp-local-' + Date.now();
        forumPosts.unshift(newPost);
        saveLocalForumPost(newPost);
        showToast('Gönderi buluta kaydedilemedi, cihazında saklanıyor.', 'ℹ️');
      }

      renderForumGrid(getFilteredPosts());
      showToast('Gönderin paylaşıldı! 🌸', '✨');
      document.getElementById('forum-post-form').reset();
      forumImagePicker.clear();
      closeForumModal();

      // Scroll to forum
      document.getElementById('forum-section').scrollIntoView({ behavior: 'smooth' });

    } finally {
      // Düğme her koşulda serbest bırakılır
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gönderi Paylaş 🌸';
    }
  });

});
