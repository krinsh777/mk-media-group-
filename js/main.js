const API_BASE_URL = 'https://thepublictoday.com/wp-json/wp/v2/posts';

// Display current date in Nepali and English format
function updateCurrentDate() {
    const now = new Date();
    const nepaliWeekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];
    const day = now.getDay();
    const nepaliDateStr = `${nepaliWeekdays[day]}, फागुन २१, २०८१`;
    const englishDateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    const nepaliElem = document.getElementById('nepali-date-display');
    const englishElem = document.getElementById('current-date');
    if (nepaliElem) nepaliElem.textContent = nepaliDateStr;
    if (englishElem) englishElem.textContent = englishDateStr;
}

let currentLang = localStorage.getItem('mkmedia_lang') || 'ne';

const translations = {
    ne: {
        homepage: "होमपेज",
        society: "समाज",
        politics: "राजनीति",
        national: "राष्ट्रिय",
        international: "विदेश",
        sports: "खेलकुद",
        breaking: "ब्रेकिङ:",
        top_story: "ताजा समाचार",
        recent_videos: "भर्खरैका भिडियोहरु",
        welcome: "एमके मिडिया (MK Media) मा स्वागत छ",
        intro: "एमके मिडिया एक भरपर्दो र गतिशील डिजिटल समाचार प्लेटफर्म हो जुन समाजमा निष्पक्ष र ताजा समाचार पुर्याउन समर्पित छ। हामी बर्दिबास लगायत देशभरिका महत्वपूर्ण घटनाहरु, राजनीति, समाज, खेलकुद र मनोरन्जनका क्षेत्रमा गहिरो विश्लेषण र प्रत्यक्ष रिपोर्टिङ प्रदान गर्दछौं। हाम्रो मुख्य उद्देश्य सत्यतथ्य जानकारीको माध्यमबाट नागरिकलाई सुसूचित गराउनु हो।",
        intro_sub: "हामी विश्वास गर्दछौं कि सही सूचना नै सशक्त समाजको आधार हो। त्यसैले, हामी २४सै घण्टा ताजा अपडेटहरुका साथ तपाईंसँग जोडिएका छौं।",
        founder: "संस्थापक र अध्यक्ष",
        loading: "लोड हुँदैछ...",
        error: "त्रुटि भयो",
        view_all: "सबै हेर्नुहोस्",
        contact_us: "हामीलाई सम्पर्क गर्नुहोस्",
        about_title: "हाम्रो बारेमा",
        trending: "ट्रेन्डिङ",
        local_title: "ताजा समाचार",
        new_label: "नयाँ",
        no_local: "अहिले कुनै ताजा समाचार उपलब्ध छैन।",
        feedback_title: "प्रतिक्रिया",
        your_name: "तपाईंको नाम",
        your_email: "तपाईंको इमेल",
        your_feedback: "तपाईंको प्रतिक्रिया",
        submit: "पठाउनुहोस्",
        success_msg: "तपाईंको सन्देश सफलतापूर्वक पठाइयो। धन्यवाद!",
        error_msg: "सन्देश पठाउँदा त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोला।"
    },
    en: {
        homepage: "Homepage",
        society: "Society",
        politics: "Politics",
        national: "National",
        international: "International",
        sports: "Sports",
        breaking: "Breaking:",
        top_story: "Top Story",
        recent_videos: "Recent Videos",
        welcome: "Welcome to MK Media",
        intro: "MK Media is a reliable and dynamic digital news platform dedicated to delivering impartial and fresh news to society. We provide deep analysis and direct reporting on important events in Bardibas and across the country, covering politics, society, sports, and entertainment. Our main objective is to inform citizens through factual information.",
        intro_sub: "We believe that accurate information is the foundation of an empowered society. Therefore, we are connected with you 24 hours a day with fresh updates.",
        founder: "Founder & Chairperson",
        loading: "Loading...",
        error: "Error occurred",
        view_all: "View All",
        contact_us: "Contact Us",
        about_title: "About Us",
        trending: "Trending Now",
        local_title: "Latest News",
        new_label: "New",
        no_local: "No latest news available right now.",
        feedback_title: "Your Feedback",
        your_name: "Your Name",
        your_email: "Your Email",
        your_feedback: "Your Feedback",
        submit: "Submit",
        success_msg: "Your message has been sent successfully. Thank you!",
        error_msg: "An error occurred while sending the message. Please try again."
    }
};

// Rebranding helper: Replaces "The Public Today" with "MK Media"
function rebrand(text) {
    if (!text) return "";
    return text
        .replace(/The Public Today/g, "MK Media")
        .replace(/द पब्लिक टुडे/g, "एमके मिडिया")
        .replace(/Public Today/g, "MK Media")
        .replace(/पब्लिक टुडे/g, "एमके मिडिया")
        .replace(/Tpt/g, "MK Media");
}

const GH_REPO = 'krinsh777/mk-media-group--main'; // Correct Global Repo for cross-device sync

// Global Image Proxy to handle hotlink protection and cross-device cloud images
function proxyImage(url) {
    if (!url) return 'https://via.placeholder.com/400x300?text=News+Article';

    // Redirect local news images to GitHub Raw with cache busting for INSTANT visibility
    if (typeof url === 'string' && url.startsWith('images/news/')) {
        return `https://raw.githubusercontent.com/${GH_REPO}/main/${url}?v=${Date.now()}`;
    }

    if (url.includes('images/')) return url;

    // Fallback for WP images using bridge
    const cleanUrl = url.replace(/^https?:\/\//, '');
    return `https://i0.wp.com/${cleanUrl}`;
}

function updateUIStrings() {
    const t = translations[currentLang];

    // Update Menu
    const menuLinks = document.querySelectorAll('.menu li a');
    if (menuLinks.length >= 6) {
        menuLinks[0].textContent = t.homepage;
        menuLinks[1].textContent = t.society;
        menuLinks[2].textContent = t.politics;
        menuLinks[3].textContent = t.national;
        menuLinks[4].textContent = t.international;
        menuLinks[5].textContent = t.sports;
    }

    // Update Section Headers
    document.querySelectorAll('.news-section').forEach(section => {
        const titleElem = section.querySelector('.section-title');
        const viewAll = section.querySelector('.view-all');
        if (titleElem) {
            const cat = section.dataset.category;
            if (cat == '8') titleElem.textContent = t.politics;
            else if (cat == '13') titleElem.textContent = t.society;
            else if (cat == '6') titleElem.textContent = t.international;
            else if (cat == '20') titleElem.textContent = t.sports;
            else if (cat == '1') titleElem.textContent = t.national;
        }
        if (viewAll) viewAll.textContent = t.view_all;
    });

    // Update Footer Titles & Form
    const footerHeaders = document.querySelectorAll('.footer-widget h3');
    if (footerHeaders[0]) footerHeaders[0].textContent = t.about_title.toUpperCase();
    if (footerHeaders[1]) footerHeaders[1].textContent = t.feedback_title.toUpperCase();

    const nameInput = document.querySelector('.feedback-form input[type="text"]');
    if (nameInput) nameInput.placeholder = t.your_name;

    const emailInput = document.querySelector('.feedback-form input[type="email"]');
    if (emailInput) emailInput.placeholder = t.your_email;

    const feedbackText = document.querySelector('.feedback-form textarea');
    if (feedbackText) feedbackText.placeholder = t.your_feedback;

    const submitBtn = document.querySelector('.feedback-form button');
    if (submitBtn) submitBtn.textContent = t.submit.toUpperCase();

    // Update Static Labels
    const breakingLabel = document.querySelector('.breaking-label');
    if (breakingLabel) breakingLabel.textContent = t.breaking;

    const introH2 = document.querySelector('.intro-content h2');
    if (introH2) introH2.textContent = t.welcome;

    const introPs = document.querySelectorAll('.intro-content p');
    if (introPs.length >= 2) {
        introPs[0].textContent = t.intro;
        introPs[1].textContent = t.intro_sub;
    }

    // Update Local News Grid Labels
    const localTitle = document.querySelector('#local-blog-section .section-title');
    if (localTitle) localTitle.innerHTML = `<i class="fas fa-feather-alt"></i> ${t.local_title}`;

    const localBadge = document.querySelector('.blog-badge');
    if (localBadge) localBadge.textContent = t.new_label;

    const ownerTitle = document.querySelector('.owner-title');
    if (ownerTitle) ownerTitle.textContent = t.founder;

    // Update Language Switcher Display
    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) langSwitch.innerHTML = currentLang === 'ne' ? "<sup>'</sup>EN<sup>'</sup>" : "<sup>'</sup>ने<sup>'</sup>";
}

// Fetch Featured News (Hero Section)
async function fetchFeaturedNews() {
    const featuredSection = document.getElementById('dynamic-featured-news');
    if (!featuredSection) return;

    try {
        const url = `${API_BASE_URL}?_embed&per_page=3&sticky=true`; // Try stickies first
        let response = await fetch(url);
        let posts = await response.json();

        // If no stickies, just get latest
        if (!posts || posts.length === 0) {
            const fallbackUrl = `${API_BASE_URL}?_embed&per_page=3`;
            response = await fetch(fallbackUrl);
            posts = await response.json();
        }

        if (posts && posts.length > 0) {
            const mainPost = posts[0];
            const secondaryPosts = posts.slice(1);

            const trendingLabel = translations[currentLang].trending;
            const topStoryLabel = translations[currentLang].top_story || "ताजा समाचार";

            const mainHTML = `
                <div class="featured-main fade-in">
                    <article class="main-feature">
                        <div class="featured-image">
                            <span class="trending-badge"><i class="fas fa-fire"></i> ${trendingLabel}</span>
                            <img src="${proxyImage(mainPost._embedded?.['wp:featuredmedia']?.[0]?.source_url)}" alt="Featured News">
                            <div class="category-label">${topStoryLabel}</div>
                        </div>
                        <div class="featured-content">
                            <h2><a href="${mainPost.link}" target="_blank">${rebrand(mainPost.title.rendered)}</a></h2>
                            <p>${rebrand(mainPost.excerpt.rendered).substring(0, 200)}...</p>
                            <div class="post-meta">
                                <span class="post-date"><i class="far fa-clock"></i> ${new Date(mainPost.date).toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-US')}</span>
                            </div>
                        </div>
                    </article>
                </div>
            `;

            const secondaryHTML = `
                <div class="featured-secondary">
                    ${secondaryPosts.map(post => `
                        <article class="secondary-feature">
                            <div class="featured-image">
                                <img src="${proxyImage(post._embedded?.['wp:featuredmedia']?.[0]?.source_url)}" alt="Secondary News">
                            </div>
                            <div class="featured-content">
                                <h3><a href="${post.link}" target="_blank">${rebrand(post.title.rendered)}</a></h3>
                                <div class="post-meta">
                                    <span class="post-date">${new Date(post.date).toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-US')}</span>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;

            featuredSection.innerHTML = mainHTML + secondaryHTML;
        }
    } catch (error) {
        console.error("Error fetching featured news:", error);
        featuredSection.innerHTML = '<div class="error">समाचार लोड गर्दा त्रुटि भयो।</div>';
    }
}

// Fetch news for a specific category and update its container
async function fetchCategoryNews(categoryId, gridElement) {
    try {
        const url = `${API_BASE_URL}?categories=${categoryId}&_embed&per_page=4`;
        const response = await fetch(url);
        const posts = await response.json();

        if (posts && posts.length > 0) {
            gridElement.innerHTML = posts.map(post => {
                const imageUrl = proxyImage(post._embedded?.['wp:featuredmedia']?.[0]?.source_url);
                const title = rebrand(post.title.rendered);
                const date = new Date(post.date).toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-US');

                return `
                    <article class="news-item">
                        <div class="news-image">
                            <img referrerpolicy="no-referrer" src="${imageUrl}" alt="${title}">
                        </div>
                        <div class="news-content">
                            <h3><a href="${post.link}" target="_blank">${title}</a></h3>
                            <div class="post-meta">
                                <span class="post-date"><i class="far fa-clock"></i> ${date}</span>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');
        } else {
            gridElement.innerHTML = '<div class="no-news">समाचार उपलब्ध छैन।</div>';
        }
    } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
        gridElement.innerHTML = '<div class="error">लोड गर्दा त्रुटि भयो।</div>';
    }
}

// Fetch Breaking News
async function fetchBreakingNews() {
    const breakingContent = document.querySelector('.breaking-content marquee');
    if (!breakingContent) return;
    try {
        const response = await fetch(`${API_BASE_URL}?per_page=5`);
        const posts = await response.json();
        if (posts && posts.length > 0) {
            breakingContent.innerHTML = posts.map(post => `
                <a href="${post.link}" target="_blank">${rebrand(post.title.rendered)}</a> |
            `).join('');
        }
    } catch (e) { console.error("Breaking news fetch error", e); }
}

// Fetch Hero Video and Sidebar
async function fetchVideoContent() {
    const sidebar = document.querySelector('.video-sidebar');
    if (!sidebar) return;
    try {
        const response = await fetch(`${API_BASE_URL}?categories=21&_embed&per_page=3`);
        const posts = await response.json();

        if (posts && posts.length > 0) {
            const sidebarHTML = `
                <div class="sidebar-title">${translations[currentLang].recent_videos}</div>
                ${posts.map(post => `
                    <div class="sidebar-video-item" onclick="window.open('${post.link}', '_blank')">
                        <img src="${proxyImage(post._embedded?.['wp:featuredmedia']?.[0]?.source_url)}" alt="Video">
                        <p>${rebrand(post.title.rendered)}</p>
                    </div>
                `).join('')}
            `;
            sidebar.innerHTML = sidebarHTML;
        }
    } catch (e) { console.error("Video sidebar fetch error", e); }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function () {
    updateUIStrings();
    updateCurrentDate();
    fetchFeaturedNews();
    fetchBreakingNews();
    fetchVideoContent();
    loadLocalNews();

    // --- DEEP LINKING SUPPORT ---
    function checkUrlForPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');
        if (postId) {
            // Delay to ensure local storage is filled before opening
            setTimeout(() => {
                if (window.openNewsReader) window.openNewsReader(postId);
            }, 1000);
        }
    }
    checkUrlForPost();

    // Update local highlights periodically
    setInterval(loadLocalNews, 300000); // Every 5 minutes

    // Preloader Hiding Logic (Advanced)
    const hidePreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
    };

    // 1. Hide on window load
    window.addEventListener('load', hidePreloader);

    // 2. Safety Timeout (Hide after 3 seconds anyway)
    setTimeout(hidePreloader, 3000);

    // 3. Hide after main data loads (if load event already occurred)
    if (document.readyState === 'complete') hidePreloader();

    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const pBar = document.getElementById("scroll-progress");
        if (pBar) pBar.style.width = scrolled + "%";
    });

    // Scroll listener for animations
    window.addEventListener('scroll', handleFadeIn);
    handleFadeIn(); // Initial trigger

    // Fetch all category sections
    document.querySelectorAll('.dynamic-category-grid').forEach(grid => {
        const categoryId = grid.dataset.category;
        fetchCategoryNews(categoryId, grid);
    });

    // Mobile menu toggle functionality
    const menuTrigger = document.querySelector('.menu-trigger');
    const navMenu = document.querySelector('.main-navigation');

    if (menuTrigger && navMenu) {
        menuTrigger.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked (for in-page anchors)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Theme Toggle logic
    const themeBtnMob = document.getElementById('theme-toggle-btn');
    const themeBtnDesk = document.getElementById('theme-toggle-desktop');
    const currentTheme = localStorage.getItem('mk_theme') || 'light';

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeBtnMob) themeBtnMob.innerHTML = '<i class="fas fa-sun"></i>';
            if (themeBtnDesk) themeBtnDesk.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('mk_theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeBtnMob) themeBtnMob.innerHTML = '<i class="fas fa-moon"></i>';
            if (themeBtnDesk) themeBtnDesk.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('mk_theme', 'light');
        }
    }

    setTheme(currentTheme);

    [themeBtnMob, themeBtnDesk].forEach(btn => {
        if (btn) {
            btn.onmousedown = (e) => e.preventDefault(); // prevent focus ring on click
            btn.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                setTheme(isDark ? 'light' : 'dark');
            });
        }
    });

    // Language Toggle logic
    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', () => {
            currentLang = currentLang === 'ne' ? 'en' : 'ne';
            localStorage.setItem('mkmedia_lang', currentLang);
            updateUIStrings();
            updateCurrentDate();
            // Refresh content to update dates/rebrand logic
            fetchFeaturedNews();
            fetchBreakingNews();
            fetchVideoContent();
            document.querySelectorAll('.dynamic-category-grid').forEach(grid => {
                fetchCategoryNews(grid.dataset.category, grid);
            });
        });
    }

    // Feedback Form Submission (AJAX)
    const feedbackForm = document.getElementById('mk-feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const msgContainer = document.getElementById('form-message');
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const t = translations[currentLang];

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = t.loading;

            const formData = new FormData(feedbackForm);
            // FormSubmit Options
            formData.append('_captcha', 'false');
            formData.append('_subject', 'New Feedback from MK Media Website');

            try {
                const response = await fetch('https://formsubmit.co/ajax/mkmediagroupnepal@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    msgContainer.textContent = t.success_msg;
                    msgContainer.style.color = "green";
                    msgContainer.style.display = "block";
                    feedbackForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                console.error(err);
                msgContainer.textContent = t.error_msg;
                msgContainer.style.color = "var(--primary-color)";
                msgContainer.style.display = "block";
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = t.submit.toUpperCase();
                // Hide message after 5 seconds
                setTimeout(() => { msgContainer.style.display = "none"; }, 5000);
            }
        });
    }

    // Load Local News from LocalStorage then refresh from GitHub
    async function loadLocalNews() {
        const grid = document.getElementById('local-news-grid');
        if (!grid) return;
        const t = translations[currentLang];

        // 1. Immediate Load from Cache to prevent flickering
        let localData = JSON.parse(localStorage.getItem('mk_local_news') || '[]');
        if (localData.length > 0) {
            renderLocalGrid(localData, grid, t);
        } else {
            grid.innerHTML = `<div class="loading-news" style="padding:40px; text-align:center; color:grey;">
                <i class="fas fa-sync fa-spin"></i> ${t.loading}
            </div>`;
        }

        // 2. Refresh from GitHub Cloud
        try {
            const rawUrl = `https://raw.githubusercontent.com/${GH_REPO}/main/data/news.json?v=${Date.now()}`;
            const res = await fetch(rawUrl);
            if (res.ok) {
                const cloudData = await res.json();

                // Compare to avoid unnecessary re-renders if content hasn't changed
                if (JSON.stringify(cloudData) !== JSON.stringify(localData)) {
                    localData = cloudData;
                    localStorage.setItem('mk_local_news', JSON.stringify(localData));
                    renderLocalGrid(localData, grid, t);
                }
            }
        } catch (e) {
            console.warn("Cloud sync failed, using offline backup", e);
        }
    }

    // Helper to render the local grid without flickering
    function renderLocalGrid(data, container, t) {
        if (!data || data.length === 0) {
            container.innerHTML = `<div class="no-news">${t.no_local}</div>`;
            return;
        }

        // Create a new set of innerHTML to avoid partial re-renders
        const html = data.map(item => `
            <article class="news-item fade-in-up">
                <div class="news-image" onclick="openNewsReader(${item.id})">
                    <img referrerpolicy="no-referrer" src="${proxyImage(item.image)}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Loading...'">
                    <span class="category-label">${t.local_title}</span>
                </div>
                <div class="news-content">
                    <h3><a href="javascript:void(0)" onclick="openNewsReader(${item.id})">${item.title}</a></h3>
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-clock"></i> ${item.date}</span>
                        <a href="javascript:void(0)" onclick="shareQuick(${item.id})" class="btn-share-mini" title="Share">
                            <i class="fas fa-share-alt"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');

        // Apply HTML ONLY if it's different from current to stop flickering
        const currentHTML = container.innerHTML;
        // Strip out some noise to compare content
        if (currentHTML.replace(/\s+/g, '') !== html.replace(/\s+/g, '')) {
            container.innerHTML = html;
        }
    }

    // Quick Share from Grid
    window.shareQuick = function (id) {
        const localData = JSON.parse(localStorage.getItem('mk_local_news') || '[]');
        const item = localData.find(it => it.id == id);
        if (!item) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}?post=${id}`;
        window.shareButtonGroup(item.title, item.content.substring(0, 100) + '...', shareUrl);
    }

    // --- IMMERSIVE NEWS READER ---
    window.openNewsReader = function (id) {
        const localData = JSON.parse(localStorage.getItem('mk_local_news') || '[]');
        const item = localData.find(it => it.id == id);
        if (!item) return;

        const t = translations[currentLang];
        const shareUrl = `${window.location.origin}${window.location.pathname}?post=${id}`;

        // Update URL without refreshing for deep linking
        window.history.pushState({ postId: id }, item.title, shareUrl);

        Swal.fire({
            customClass: {
                popup: 'news-reader-popup',
                htmlContainer: 'news-reader-container'
            },
            showConfirmButton: true,
            confirmButtonText: t.submit === 'Submit' ? 'Close Reader' : 'बन्द गर्नुहोस्',
            confirmButtonColor: 'var(--black)',
            width: '900px',
            willClose: () => {
                // Return to home URL when closed
                window.history.pushState({}, document.title, window.location.origin + window.location.pathname);
            },
            html: `
                <div class="reader-container">
                    <div class="reader-hero">
                        <img src="${proxyImage(item.image)}" alt="${item.title}" onerror="this.src='images/news-placeholder.jpg'">
                        <div class="reader-meta">
                            <span class="reader-category">${t.local_title}</span>
                            <h2 class="reader-title">${item.title}</h2>
                        </div>
                    </div>
                    <div class="reader-body">
                        <div class="reader-sender-info" style="margin-bottom: 20px; font-size: 14px; color: #666;">
                            <i class="far fa-user"></i> MK Media Reporter | <i class="far fa-clock"></i> ${item.date}
                        </div>
                        <div class="reader-actions" style="margin-bottom: 25px; display: flex; flex-wrap: wrap; gap: 10px;">
                            <button onclick="shareOnFacebook('${item.title.replace(/'/g, "\\'")}', '${proxyImage(item.image)}', '${item.content.substring(0, 150).replace(/'/g, "\\'")}', '${shareUrl}')" class="btn-share-fb" style="background:#1877f2; color:white; border:none; padding:10px 18px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:700; transition:0.3s; box-shadow: 0 4px 12px rgba(24,119,242,0.3);">
                                <i class="fab fa-facebook"></i> Facebook मा सेयर
                            </button>
                            <button onclick="shareButtonGroup('${item.title.replace(/'/g, "\\'")}', '${item.content.substring(0, 150).replace(/'/g, "\\'")}...', '${shareUrl}')" class="btn-share-generic" style="background:#333; color:white; border:none; padding:10px 18px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:700; transition:0.3s;">
                                <i class="fas fa-share-alt"></i> अरु ठाउँमा सेयर
                            </button>
                        </div>
                        <div class="reader-content" style="line-height: 1.8; font-size: 1.1rem;">${item.content.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            `
        });
    }

    // --- SOCIAL SHARING HELPERS ---
    window.shareOnFacebook = function (title, image, desc, url) {
        // Since it's a static site, FB crawler won't see dynamic JS meta tags,
        // but we can try to improve the quote.
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + '\n\n' + desc)}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
    }

    window.shareButtonGroup = function (title, text, url) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            }).catch(console.error);
        } else {
            // Fallback: Copy link
            navigator.clipboard.writeText(url);
            Swal.fire({
                title: 'Link Copied!',
                text: 'The article link has been copied to your clipboard.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }

    // Fade-in effect logic on scroll
    function handleFadeIn() {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach(el => {
            const speed = 150;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - speed) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
    setInterval(() => {
        fetchFeaturedNews();
        fetchBreakingNews();
        document.querySelectorAll('.dynamic-category-grid').forEach(grid => {
            fetchCategoryNews(grid.dataset.category, grid);
        });
    }, 600000);
});
