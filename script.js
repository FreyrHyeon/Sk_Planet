(() => {
  const root = document.documentElement;
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const allowedThemes = ['system', 'light', 'dark'];

  function resolveTheme(choice) {
    if (choice !== 'system') return choice;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(choice, persist = true) {
    const safeChoice = allowedThemes.includes(choice) ? choice : 'system';
    root.dataset.theme = safeChoice;
    themeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === safeChoice));
    });
    if (themeMeta) themeMeta.content = resolveTheme(safeChoice) === 'dark' ? '#121519' : '#f6f2ec';
    if (persist) localStorage.setItem('zeiv-theme', safeChoice);
  }

  let savedTheme = 'system';
  try { savedTheme = localStorage.getItem('zeiv-theme') || 'system'; } catch (_) {}
  setTheme(savedTheme, false);
  themeButtons.forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  systemTheme.addEventListener?.('change', () => {
    if (root.dataset.theme === 'system') setTheme('system', false);
  });

  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  menuButton?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const currentPage = document.body.dataset.page;
  document.querySelector(`[data-nav="${currentPage}"]`)?.setAttribute('aria-current', 'page');
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
  } else {
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-category]');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projects.forEach((project) => { project.hidden = filter !== 'all' && project.dataset.category !== filter; });
  }));

  function setProjectToc(entry, open) {
    const toggle = entry.querySelector('[data-project-toggle]');
    const toc = entry.querySelector('[data-project-toc]');
    if (!toggle || !toc) return;
    toggle.setAttribute('aria-expanded', String(open));
    toc.hidden = !open;
  }

  document.querySelectorAll('[data-project-entry]').forEach((entry) => {
    const toggle = entry.querySelector('[data-project-toggle]');
    toggle?.addEventListener('click', () => {
      const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      setProjectToc(entry, willOpen);
    });
  });

  const linkedProject = window.location.hash ? document.querySelector(window.location.hash) : null;
  if (linkedProject?.matches('[data-project-entry]')) {
    setProjectToc(linkedProject, true);
    requestAnimationFrame(() => linkedProject.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  const tourismPlaces = {
    arte: {
      title: '아르떼뮤지엄 부산',
      navTitle: 'Arte Museum',
      kicker: 'Immersive art · Yeongdo',
      subtitle: '빛과 소리, 향으로 확장된 자연을 따라 걸으며 감각의 경계를 새롭게 발견하는 몰입형 미디어아트 공간입니다.',
      location: '부산 · 영도구',
      images: [
        { src: 'assets/images/report/arte-museum.png', alt: '푸른 파도가 전시 공간 전체로 이어지는 아르떼뮤지엄 부산', caption: 'ETERNAL NATURE · WAVE' },
        { src: 'assets/images/report/arte-museum-02.jpg', alt: '다채로운 장미 빛으로 채워진 아르떼뮤지엄 부산 플라워 전시', caption: 'FLOWER ROSE · BUSAN' },
        { src: 'assets/images/report/arte-museum-03.png', alt: '흰 장미 미디어아트 속을 걷는 아르떼뮤지엄 관람객', caption: 'IMMERSIVE FLOWER GARDEN' }
      ],
      quote: '빛을 따라, 익숙한 자연을 새로운 감각으로 경험하다.',
      facts: [
        ['Location', '영도구 해양로247번길 29'],
        ['Opening hours', '매일 10:00–20:00 · 입장 마감 19:00'],
        ['Best season', '사계절 · 비 오는 날 추천'],
        ['Recommended stay', '약 90–120분']
      ],
      programIntro: '관람 동선 속에서 시각·청각·후각을 단계적으로 경험하도록 구성한 체험 아이디어입니다.',
      programs: [
        { name: 'Eternal Nature Walk', text: '파도, 꽃, 빛의 정원을 따라 대표 작품을 감상하는 몰입형 전시 산책.', time: '60–90분', type: '자유 관람' },
        { name: 'Coloring Life', text: '직접 색칠한 생명체가 대형 미디어 공간 안에서 움직이는 참여형 콘텐츠.', time: '15–20분', type: '인터랙티브' },
        { name: 'Arte Tea Moment', text: '빛과 음악의 여운을 차의 향과 함께 정리하는 감각 기반 휴식 프로그램.', time: '20–30분', type: '휴식 · 미식' }
      ],
      rating: '4.8',
      reviews: [
        { name: '빛을 따라온 여행자', meta: '20대 · 친구와 방문', text: '사진보다 공간의 규모와 사운드가 훨씬 인상적이었어요. 천천히 머물수록 새로운 장면이 보였습니다.', score: '★★★★★' },
        { name: '영도 산책자', meta: '30대 · 커플 여행', text: '비 오는 날에도 일정 변경 없이 즐길 수 있고, 전시 후 영도 바다 코스로 이어가기 좋았습니다.', score: '★★★★★' },
        { name: '주말 기록가', meta: '가족 방문', text: '아이와 어른이 각자 다른 방식으로 즐길 수 있는 참여형 공간이 많아 지루하지 않았어요.', score: '★★★★☆' }
      ],
      credit: '이미지 제공: 아르떼뮤지엄 공식 웹사이트',
      source: 'https://www.kr.artemuseum.com/busan'
    },
    millac: {
      title: '밀락더마켓',
      navTitle: 'Millac Market',
      kicker: 'Culture market · Suyeong',
      subtitle: '바다 가까이에서 로컬 푸드, 팝업, 공연과 휴식이 한 흐름으로 이어지는 개방형 복합문화공간입니다.',
      location: '부산 · 수영구',
      images: [
        { src: 'assets/images/report/millac-market.png', alt: '넓은 유리 파사드로 이루어진 밀락더마켓의 낮 전경', caption: 'MILLAC THE MARKET · EXTERIOR' },
        { src: 'assets/images/report/millac-market-02.png', alt: '광안대교와 바다가 보이는 밀락더마켓 실내 스탠드', caption: 'OCEAN STAND · GWANGALLI VIEW' },
        { src: 'assets/images/report/millac-market-03.png', alt: '밀락더마켓 간판과 중앙 계단이 보이는 실내 입구', caption: 'CENTRAL STAIR · MARKET HALL' }
      ],
      quote: '먹고, 보고, 머무는 순간이 부산의 새로운 로컬 장면이 되다.',
      facts: [
        ['Location', '수영구 민락수변로17번길 56'],
        ['Opening hours', '매장·팝업·공연별 운영 시간 상이'],
        ['Best season', '봄·가을 · 일몰 이후 추천'],
        ['Recommended stay', '약 60–120분']
      ],
      programIntro: '시간대에 따라 바뀌는 공간의 표정을 중심으로 먹거리와 문화 경험을 연결했습니다.',
      programs: [
        { name: 'Ocean Stand', text: '통창과 스탠드 좌석에서 광안리의 바다 풍경을 바라보며 쉬어가는 프로그램.', time: '30–40분', type: '뷰 · 휴식' },
        { name: 'Local Food Curation', text: '공간 안의 다양한 메뉴 가운데 부산다운 조합을 골라 맛보는 셀프 미식 코스.', time: '40–60분', type: '로컬 미식' },
        { name: 'Weekend Pop-up', text: '시즌별 브랜드 팝업과 버스킹, 마켓 일정을 따라 발견하는 문화 탐색.', time: '일정별 상이', type: '공연 · 마켓' }
      ],
      rating: '4.6',
      reviews: [
        { name: '광안리 나이트러너', meta: '20대 · 저녁 방문', text: '한 장소에서 식사와 공연, 바다 야경까지 이어져 동선을 따로 계획하지 않아도 좋았어요.', score: '★★★★★' },
        { name: '부산 주말러', meta: '30대 · 친구와 방문', text: '공간이 넓고 좌석의 분위기가 다양해서 각자 먹고 싶은 메뉴를 고르기 편했습니다.', score: '★★★★☆' },
        { name: '팝업 수집가', meta: '20대 · 혼자 방문', text: '방문 시기마다 팝업 구성이 달라 다시 찾아갈 이유가 생기는 곳이에요.', score: '★★★★★' }
      ],
      credit: '이미지 제공: 부산광역시·부산관광공사 / 하이픈그룹, 공공누리 제1유형',
      source: 'https://visitbusan.net/archive/dataSearch/view.nm?dataSid=METADATA013192&menuCd=36'
    },
    huinnyeoul: {
      title: '흰여울문화마을',
      navTitle: 'Huinnyeoul',
      kicker: 'Coastal village · Yeongdo',
      subtitle: '절벽 위 좁은 골목과 푸른 바다가 나란히 이어지는, 생활의 흔적과 예술적 풍경이 공존하는 해안마을입니다.',
      location: '부산 · 영도구',
      images: [
        { src: 'assets/images/report/huinnyeoul-village.png', alt: '파란 바다를 따라 이어지는 흰여울문화마을 산책 골목', caption: 'COASTAL ALLEY · YEONGDO' },
        { src: 'assets/images/report/huinnyeoul-village-02.png', alt: '빨랫줄 집게 너머로 보이는 흰여울문화마을 앞바다', caption: 'A SMALL SCENE ABOVE THE SEA' },
        { src: 'assets/images/report/huinnyeoul-village-03.png', alt: '바다를 배경으로 세워진 흰여울문화마을 입구 표지', caption: 'HUINNYEOUL VILLAGE · ENTRANCE' }
      ],
      quote: '바다와 골목 사이, 부산의 오래된 이야기를 천천히 걷다.',
      facts: [
        ['Location', '영도구 영선동4가 흰여울길 일대'],
        ['Opening hours', '마을 상시 개방 · 시설별 운영 상이'],
        ['Best season', '봄·가을 맑은 날 · 일몰 전'],
        ['Recommended stay', '약 90–150분']
      ],
      programIntro: '주민의 생활 공간을 존중하며 골목의 역사와 바다 풍경을 천천히 기록하는 코스입니다.',
      programs: [
        { name: 'Alley Story Walk', text: '피란민 마을의 흔적과 영화 촬영 장소를 따라 걷는 짧은 스토리 산책.', time: '40–60분', type: '도보 해설' },
        { name: 'Slow Postcard', text: '마을의 풍경을 엽서에 기록하고 미래의 나에게 보내는 아날로그 체험.', time: '20–30분', type: '기록 체험' },
        { name: 'Coastal Photo Walk', text: '전망대와 해안터널을 연결해 빛과 바다의 변화를 담는 포토워크.', time: '60–80분', type: '사진 · 산책' }
      ],
      rating: '4.7',
      reviews: [
        { name: '영도 느린 여행자', meta: '30대 · 혼자 방문', text: '골목 끝에서 갑자기 바다가 열리는 장면이 기억에 남아요. 서두르지 않고 걸을수록 좋은 곳입니다.', score: '★★★★★' },
        { name: '필름 카메라 산책자', meta: '20대 · 친구와 방문', text: '흰 벽과 파란 바다가 잘 어울려 어디서든 사진이 되지만, 주민 공간을 배려하며 걷는 게 중요해요.', score: '★★★★★' },
        { name: '부산 가족 여행', meta: '가족 방문', text: '계단 구간이 있어 편한 신발이 필요했지만 해안산책로와 전망이 충분히 보상해 줬습니다.', score: '★★★★☆' }
      ],
      credit: '이미지 제공: 부산광역시·부산관광공사 / 김장용, 공공누리 제1유형',
      source: 'https://www.visitbusan.net/archive/dataSearch/view.nm?dataSid=METADATA000909'
    }
  };

  const placeFilterButtons = [...document.querySelectorAll('[data-place-filter]')];
  const placeCards = [...document.querySelectorAll('[data-place-card]')];
  placeFilterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.placeFilter;
    placeFilterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    placeCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.placeCategory !== filter;
    });
  }));

  const tourismModal = document.querySelector('[data-tourism-modal]');
  const tourismDialog = document.querySelector('[data-tourism-dialog]');
  const modalScroll = document.querySelector('[data-modal-scroll]');
  const modalSectionButtons = [...document.querySelectorAll('[data-modal-section]')];
  const galleryViewport = document.querySelector('[data-gallery-viewport]');
  const galleryTrack = document.querySelector('[data-gallery-track]');
  const galleryDots = document.querySelector('[data-gallery-dots]');
  const galleryCurrent = document.querySelector('[data-gallery-current]');
  const galleryTotal = document.querySelector('[data-gallery-total]');
  let galleryImages = [];
  let galleryIndex = 0;
  let galleryDragging = false;
  let galleryStartX = 0;
  let galleryDeltaX = 0;
  let modalTrigger = null;

  function setModalText(selector, value) {
    const node = tourismModal?.querySelector(selector);
    if (node) node.textContent = value;
  }

  function renderTourismPlace(key) {
    const place = tourismPlaces[key];
    if (!place || !tourismModal || !tourismDialog) return;
    tourismDialog.dataset.place = key;
    setModalText('[data-modal-nav-title]', place.navTitle);
    setModalText('[data-modal-kicker]', place.kicker);
    setModalText('[data-modal-title]', place.title);
    setModalText('[data-modal-subtitle]', place.subtitle);
    setModalText('[data-modal-location]', place.location);
    setModalText('[data-modal-caption]', place.caption);
    setModalText('[data-modal-quote]', place.quote);
    setModalText('[data-modal-program-intro]', place.programIntro);
    setModalText('[data-modal-rating]', place.rating);
    setModalText('[data-modal-credit]', place.credit);

    renderGallery(place.images);

    const facts = tourismModal.querySelector('[data-modal-facts]');
    if (facts) facts.innerHTML = place.facts.map(([label, value]) => `<div class="tourism-fact"><span>${label}</span><strong>${value}</strong></div>`).join('');

    const programs = tourismModal.querySelector('[data-modal-programs]');
    if (programs) programs.innerHTML = place.programs.map((program, index) => `
      <article class="tourism-program">
        <span>0${index + 1}</span>
        <h4>${program.name}</h4>
        <p>${program.text}</p>
        <dl><div><dt>Duration</dt><dd>${program.time}</dd></div><div><dt>Type</dt><dd>${program.type}</dd></div></dl>
      </article>`).join('');

    const reviews = tourismModal.querySelector('[data-modal-reviews]');
    if (reviews) reviews.innerHTML = place.reviews.map((review) => `
      <article class="tourism-review">
        <div class="tourism-review-name"><strong>${review.name}</strong><span>${review.meta}</span></div>
        <p>${review.text}</p>
        <span aria-label="5점 만점 평가">${review.score}</span>
      </article>`).join('');

    const source = tourismModal.querySelector('[data-modal-source]');
    if (source) source.href = place.source;
  }

  function formatGalleryNumber(number) {
    return String(number).padStart(2, '0');
  }

  function setGallerySlide(index, animate = true) {
    if (!galleryImages.length || !galleryTrack) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    galleryTrack.classList.toggle('is-dragging', !animate);
    galleryTrack.style.transform = `translate3d(-${galleryIndex * 100}%, 0, 0)`;
    galleryDots?.querySelectorAll('button').forEach((dot, dotIndex) => {
      const active = dotIndex === galleryIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (galleryCurrent) galleryCurrent.textContent = formatGalleryNumber(galleryIndex + 1);
  }

  function renderGallery(images) {
    galleryImages = images || [];
    galleryIndex = 0;
    if (galleryTrack) {
      galleryTrack.innerHTML = galleryImages.map((image) => `
        <figure class="tourism-gallery-slide">
          <img src="${image.src}" alt="${image.alt}" draggable="false">
          <figcaption>${image.caption}</figcaption>
        </figure>`).join('');
    }
    if (galleryDots) {
      galleryDots.innerHTML = galleryImages.map((_, index) => `<button class="tourism-gallery-dot${index === 0 ? ' is-active' : ''}" type="button" aria-label="${index + 1}번째 이미지" aria-current="${index === 0 ? 'true' : 'false'}" data-gallery-index="${index}"></button>`).join('');
      galleryDots.querySelectorAll('[data-gallery-index]').forEach((dot) => dot.addEventListener('click', () => setGallerySlide(Number(dot.dataset.galleryIndex))));
    }
    if (galleryTotal) galleryTotal.textContent = formatGalleryNumber(galleryImages.length);
    setGallerySlide(0, false);
    requestAnimationFrame(() => galleryTrack?.classList.remove('is-dragging'));
  }

  function setActiveModalSection(id) {
    modalSectionButtons.forEach((button) => {
      const active = button.dataset.modalSection === id;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function openTourismModal(key, trigger) {
    if (!tourismModal || !tourismDialog) return;
    modalTrigger = trigger;
    renderTourismPlace(key);
    if (!tourismModal.open) {
      if (typeof tourismModal.showModal === 'function') tourismModal.showModal();
      else tourismModal.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
    if (modalScroll) modalScroll.scrollTop = 0;
    setActiveModalSection('modal-overview');
    requestAnimationFrame(() => {
      tourismDialog.classList.add('is-open');
      tourismDialog.focus();
    });
  }

  function closeTourismModal() {
    if (!tourismModal || !tourismModal.open) return;
    tourismDialog?.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    window.setTimeout(() => {
      if (tourismModal.open && typeof tourismModal.close === 'function') tourismModal.close();
      else tourismModal.removeAttribute('open');
      modalTrigger?.focus();
      modalTrigger = null;
    }, 240);
  }

  placeCards.forEach((card) => card.addEventListener('click', () => openTourismModal(card.dataset.place, card)));
  tourismModal?.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeTourismModal));
  tourismModal?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeTourismModal();
  });
  tourismModal?.addEventListener('click', (event) => {
    if (event.target === tourismModal) closeTourismModal();
  });
  modalSectionButtons.forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.modalSection;
    const target = tourismModal?.querySelector(`#${id}`);
    if (!target || !modalScroll) return;
    const targetTop = target.getBoundingClientRect().top - modalScroll.getBoundingClientRect().top + modalScroll.scrollTop;
    modalScroll.scrollTo({ top: targetTop, behavior: 'smooth' });
    setActiveModalSection(id);
  }));

  tourismModal?.querySelector('[data-gallery-prev]')?.addEventListener('click', () => setGallerySlide(galleryIndex - 1));
  tourismModal?.querySelector('[data-gallery-next]')?.addEventListener('click', () => setGallerySlide(galleryIndex + 1));

  galleryViewport?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setGallerySlide(galleryIndex - 1);
    if (event.key === 'ArrowRight') setGallerySlide(galleryIndex + 1);
  });

  galleryViewport?.addEventListener('pointerdown', (event) => {
    galleryDragging = true;
    galleryStartX = event.clientX;
    galleryDeltaX = 0;
    galleryViewport.setPointerCapture(event.pointerId);
    galleryViewport.classList.add('is-dragging');
    galleryTrack?.classList.add('is-dragging');
  });

  galleryViewport?.addEventListener('pointermove', (event) => {
    if (!galleryDragging || !galleryTrack) return;
    galleryDeltaX = event.clientX - galleryStartX;
    galleryTrack.style.transform = `translate3d(calc(-${galleryIndex * 100}% + ${galleryDeltaX}px), 0, 0)`;
  });

  function finishGalleryDrag() {
    if (!galleryDragging) return;
    galleryDragging = false;
    galleryViewport?.classList.remove('is-dragging');
    galleryTrack?.classList.remove('is-dragging');
    const threshold = Math.min(90, (galleryViewport?.clientWidth || 400) * .16);
    if (galleryDeltaX < -threshold) setGallerySlide(galleryIndex + 1);
    else if (galleryDeltaX > threshold) setGallerySlide(galleryIndex - 1);
    else setGallerySlide(galleryIndex);
    galleryDeltaX = 0;
  }

  galleryViewport?.addEventListener('pointerup', finishGalleryDrag);
  galleryViewport?.addEventListener('pointercancel', finishGalleryDrag);

  modalScroll?.addEventListener('scroll', () => {
    const sections = [...tourismModal.querySelectorAll('[data-modal-observe]')];
    const current = sections.reduce((closest, section) => {
      const sectionTop = section.getBoundingClientRect().top - modalScroll.getBoundingClientRect().top;
      const distance = Math.abs(sectionTop - 40);
      return !closest || distance < closest.distance ? { id: section.id, distance } : closest;
    }, null);
    if (current) setActiveModalSection(current.id);
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && tourismModal?.open) closeTourismModal();
  });
})();
