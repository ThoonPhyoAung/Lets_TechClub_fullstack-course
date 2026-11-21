"use strict";

const THEME_STORAGE_KEY = "ranejipsy-portfolio-theme";

function getSavedTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return "light";
  } catch (error) {
    return "light";
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Do nothing if localStorage is blocked
  }
}

function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  const sunIcon = themeToggleBtn.querySelector(".icon-sun");
  const moonIcon = themeToggleBtn.querySelector(".icon-moon");

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.setAttribute("data-theme", theme);
    themeToggleBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme",
    );

    if (sunIcon && moonIcon) {
      sunIcon.toggleAttribute("hidden", !isDark);
      moonIcon.toggleAttribute("hidden", isDark);
    }
  }

  let currentTheme = getSavedTheme();
  applyTheme(currentTheme);

  themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    saveTheme(currentTheme);
  });
}

/* --------------------------------------------------------------------------
   3. ACCESSIBLE MOBILE NAVIGATION MENU
   Uses HTML "hidden" attribute so closed links are skipped by keyboard Tab.
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const menuToggleBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!menuToggleBtn || !mobileMenu) return;

  const menuIcon = menuToggleBtn.querySelector(".menu-icon");
  const mobileLinks = mobileMenu.querySelectorAll(".mobile-nav-link");

  // Single helper function to open or close the menu cleanly
  function setMenuState(isOpen) {
    mobileMenu.hidden = !isOpen;
    menuToggleBtn.setAttribute("aria-expanded", String(isOpen));
    menuToggleBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );

    if (menuIcon) {
      menuIcon.textContent = isOpen ? "✕" : "☰";
    }
  }

  // Always start closed
  setMenuState(false);

  // Open/close when clicking the hamburger button
  menuToggleBtn.addEventListener("click", () => {
    const isCurrentlyOpen =
      menuToggleBtn.getAttribute("aria-expanded") === "true";
    setMenuState(!isCurrentlyOpen);
  });

  // Close menu after clicking any navigation link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  // Close menu when pressing Escape key and move focus back to button
  document.addEventListener("keydown", (event) => {
    const isOpen = menuToggleBtn.getAttribute("aria-expanded") === "true";
    if (event.key === "Escape" && isOpen) {
      setMenuState(false);
      menuToggleBtn.focus();
    }
  });

  // Close mobile menu automatically if screen becomes desktop size (>= 768px)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && !mobileMenu.hidden) {
      setMenuState(false);
    }
  });
}

/* ==================== PART 3: TECHNICAL SKILLS ==================== */
function initSkillTabs() {
  const nav = document.getElementById("skills-nav");
  const tabs = document.querySelectorAll(".skill-tab-btn");

  if (!nav || !tabs.length) return;

  function activateTab(selectedTab) {
    const selectedCategory = selectedTab.dataset.skillTab;
    const tiles = document.querySelectorAll(".skill-tile");

    // 1. Pill highlight နဲ့ aria-selected ကို ပြောင်းမယ်
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });

    // 2. Step 2 မှာ .skill-tile တွေ ထည့်ပြီးရင် Category အလိုက် Filter လုပ်မယ်
    tiles.forEach((tile) => {
      const matches =
        selectedCategory === "all" ||
        tile.dataset.category === selectedCategory;
      tile.hidden = !matches;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });
  });

  // Keyboard Left / Right Arrow keys နဲ့ Tab ပြောင်းနိုင်ဖို့
  nav.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    const tabArray = Array.from(tabs);
    const currentIndex = tabArray.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + tabArray.length) % tabArray.length;
    const nextTab = tabArray[nextIndex];

    nextTab.focus();
    activateTab(nextTab);
  });
}

/* ==================== PART 3: TECHNICAL SKILLS ==================== */

const skillsData = [
  // --- 1. Web dev ---
  {
    name: "React JS",
    category: "web",
    level: "80%",
    learning: false,
    color: "#61DAFB",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2.6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zm-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zm-24.5 263.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6.4 19.5.6 29.5.6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8.9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zm-149.7-15c25.3 0 45.8-20.5 45.8-45.8s-20.5-45.8-45.8-45.8c-25.3 0-45.8 20.5-45.8 45.8s20.5 45.8 45.8 45.8z"></path></svg>`,
  },
  {
    name: "JavaScript",
    category: "web",
    level: "80%",
    learning: false,
    color: "#F7DF1E",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z"></path></svg>`,
  },
  {
    name: "Tailwind CSS",
    category: "web",
    level: "75%",
    learning: false,
    color: "#06B6D4",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"></path></svg>`,
  },
  {
    name: "Django",
    category: "web",
    level: "75%",
    learning: false,
    color: "#092E20",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 00-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.098c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.53 3.109-2.625.561-1.121.739-2.421.739-5.835V6.059h3.924zM17.39.021h3.924v4.026H17.39z"></path></svg>`,
  },
  {
    name: "Node.js",
    category: "web",
    level: "55%",
    learning: true,
    color: "#339933",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224 508c-6.7 0-13.5-1.8-19.4-5.2l-61.7-36.5c-9.2-5.2-4.7-7-1.7-8 12.3-4.3 14.8-5.2 27.9-12.7 1.4-.8 3.2-.5 4.6.4l47.4 28.1c1.7 1 4.1 1 5.7 0l184.7-106.6c1.7-1 2.8-3 2.8-5V149.3c0-2.1-1.1-4-2.9-5.1L226.8 37.7c-1.7-1-4-1-5.7 0L36.6 144.3c-1.8 1-2.9 3-2.9 5.1v213.1c0 2 1.1 4 2.9 4.9l50.6 29.2c27.5 13.7 44.3-2.4 44.3-18.7V167.5c0-3 2.4-5.3 5.4-5.3h23.4c2.9 0 5.4 2.3 5.4 5.3V378c0 36.6-20 57.6-54.7 57.6-10.7 0-19.1 0-42.5-11.6l-48.4-27.9C8.1 389.2.7 376.3.7 362.4V149.3c0-13.8 7.4-26.8 19.4-33.7L204.6 9c11.7-6.6 27.2-6.6 38.8 0l184.7 106.7c12 6.9 19.4 19.8 19.4 33.7v213.1c0 13.8-7.4 26.7-19.4 33.7L243.4 502.8c-5.9 3.4-12.6 5.2-19.4 5.2zm149.1-210.1c0-39.9-27-50.5-83.7-58-57.4-7.6-63.2-11.5-63.2-24.9 0-11.1 4.9-25.9 47.4-25.9 37.9 0 51.9 8.2 57.7 33.8.5 2.4 2.7 4.2 5.2 4.2h24c1.5 0 2.9-.6 3.9-1.7s1.5-2.6 1.4-4.1c-3.7-44.1-33-64.6-92.2-64.6-52.7 0-84.1 22.2-84.1 59.5 0 40.4 31.3 51.6 81.8 56.6 60.5 5.9 65.2 14.8 65.2 26.7 0 20.6-16.6 29.4-55.5 29.4-48.9 0-59.6-12.3-63.2-36.6-.4-2.6-2.6-4.5-5.3-4.5h-23.9c-3 0-5.3 2.4-5.3 5.3 0 31.1 16.9 68.2 97.8 68.2 58.4-.1 92-23.2 92-63.4z"></path></svg>`,
  },
  {
    name: "Next.js",
    category: "web",
    level: "50%",
    learning: true,
    color: "var(--text-primary)",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 17.5-7.46-9.65v6.45H8.5V6.7h1.68l7.32 9.47V6.7H19V17.5h-1.438z"></path></svg>`,
  },
  {
    name: "TypeScript ",
    category: "web",
    level: "55%",
    learning: true,
    color: "#3178C6",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v18H3V3zm10.71 14.86c.5.89 1.46 1.41 2.72 1.41 1.52 0 2.52-.72 2.52-1.91 0-1.09-.65-1.64-2.18-2.16l-.67-.23c-.95-.32-1.26-.56-1.26-1.04 0-.51.45-.87 1.15-.87.64 0 1.13.3 1.42.83l1.24-.79c-.47-.86-1.36-1.34-2.63-1.34-1.45 0-2.46.78-2.46 1.89 0 .99.6 1.56 2.02 2.04l.69.23c1.05.35 1.38.61 1.38 1.15 0 .58-.53.97-1.27.97-.79 0-1.37-.37-1.73-1.03l-1.33.94zm-2.43-5.91H8.2v7.31H6.6v-7.31H3.52v-1.36h7.76v1.36z"></path></svg>`,
  },

  // --- 2. Embedded & IOT ---
  {
    name: "Espressif",
    category: "iot",
    level: "80%",
    learning: false,
    color: "#E12229",
    icon: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.926 19.324a7.6 7.6 0 00-2.983-6.754 7.44 7.44 0 00-3.828-1.554.697.697 0 01-.606-.731.674.674 0 01.743-.617 8.97 8.97 0 018 9.805 7.828 7.828 0 01-.298 1.542l1.989.56a11.039 11.039 0 001.714-.651 12.159 12.159 0 00.217-2.343A12.57 12.57 0 007.212 6.171a5.53 5.53 0 00-2 0 4.354 4.354 0 00-2.16 1.337 4.274 4.274 0 001.909 6.856 9.896 9.896 0 001.074.195 4.011 4.011 0 013.337 3.954 3.965 3.965 0 01-.64 2.16l1.371.88a10.182 10.182 0 002.057.342 7.52 7.52 0 00.754-2.628m.16 4.73A13.073 13.073 0 01.001 10.983 12.982 12.982 0 013.83 1.737l.743.697a12.067 12.067 0 000 17.141 12.067 12.067 0 0017.141 0l.697.697a12.97 12.97 0 01-9.336 3.726M24 10.993A10.993 10.993 0 0012.949 0c-.389 0-.766 0-1.143.057l-.252.732a18.912 18.912 0 0111.588 11.576l.731-.263c0-.366.069-.732.069-1.143m-1.269 5.165A17.53 17.53 0 007.818 1.27a11.119 11.119 0 00-2.457 1.77v1.635A13.919 13.919 0 0119.268 18.57h1.634a11.713 11.713 0 001.771-2.446M7.92 17.884a1.691 1.691 0 11-1.69-1.691 1.691 1.691 0 011.69 1.691"/></svg>`,
  },
  {
    name: "Arduino",
    category: "iot",
    level: "82%",
    learning: false,
    color: "#00979D",
    icon: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M18.087 6.146c-.3 0-.607.017-.907.069-2.532.367-4.23 2.239-5.18 3.674-.95-1.435-2.648-3.307-5.18-3.674a6.49 6.49 0 0 0-.907-.069C2.648 6.146 0 8.77 0 12s2.656 5.854 5.913 5.854c.3 0 .607-.017.916-.069 2.531-.376 4.23-2.247 5.18-3.683.949 1.436 2.647 3.307 5.18 3.683.299.043.607.069.915.069C21.344 17.854 24 15.23 24 12s-2.656-5.854-5.913-5.854zM6.53 15.734a3.837 3.837 0 0 1-.625.043c-2.148 0-3.889-1.7-3.889-3.777 0-2.085 1.749-3.777 3.898-3.777.208 0 .416.017.624.043 2.39.35 3.847 2.768 4.347 3.734-.508.974-1.974 3.384-4.355 3.734zm11.558.043c-.208 0-.416-.017-.624-.043-2.39-.35-3.856-2.768-4.347-3.734.491-.966 1.957-3.384 4.347-3.734.208-.026.416-.043.624-.043 2.149 0 3.89 1.7 3.89 3.777 0 2.085-1.75 3.777-3.89 3.777zm1.65-4.404v1.134h-1.205v1.182h-1.156v-1.182H16.17v-1.134h1.206V10.19h1.156v1.183h1.206zM4.246 12.498H7.82v-1.125H4.245v1.125z"/></svg>`,
  },
  {
    name: "MQTT & Ubidots",
    category: "iot",
    level: "75%",
    learning: false,
    color: "#660066",
    icon: `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>`,
  },
  {
    name: "C / C++",
    category: "iot",
    level: "78%",
    learning: false,
    color: "#00599C",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.293-1.343-.293-1.852 0L2.258 5.31C1.749 5.604 1.332 6.326 1.332 6.914v10.172c0 .294.104.605.271.895l.002.003c.167.29.398.543.652.69l8.816 5.09c.509.294 1.343.294 1.852 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.271-.601.271-.895V6.914c0-.294-.104-.605-.271-.895zM12 18.875a6.875 6.875 0 1 1 0-13.75 6.84 6.84 0 0 1 5.95 3.438l-2.975 1.718A3.438 3.438 0 1 0 12 15.438a3.415 3.415 0 0 0 2.975-1.719l2.975 1.719A6.84 6.84 0 0 1 12 18.875zm6.563-6.25h-1.25v1.25h-1.25v-1.25h-1.25v-1.25h1.25v-1.25h1.25v1.25h1.25zm3.125 0h-1.25v1.25h-1.25v-1.25h-1.25v-1.25h1.25v-1.25h1.25v1.25h1.25z"/></svg>`,
  },

  // --- 3. Tools ---
  {
    name: "Git & GitHub",
    category: "tools",
    level: "85%",
    learning: false,
    color: "#F05032",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>`,
  },
  {
    name: "VS Code",
    category: "tools",
    level: "90%",
    learning: false,
    color: "#007ACC",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>`,
  },
  {
    name: "KiCad",
    category: "tools",
    level: "65%",
    learning: false,
    color: "#314CB0",
    icon: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.4668 7.3039c-.472.0238-.8477.4142-.8477.8906 0 .4918.3994.8906.8926.8906.4933 0 .8926-.3988.8926-.8906 0-.4918-.3993-.8906-.8926-.8906-.0154 0-.0297-.0008-.0449 0zM.25 8.0109c-.1394 0-.25.1214-.25.254v8.1777c0 .1325.1106.2539.25.2539h8.5215c.1394 0 .248-.1214.248-.254V8.2649c0-.1327-.1083-.2539-.248-.2539h-.2598c.011.0595.0176.121.0176.1836 0 .0605-.0054.1201-.0156.1777h.1445v7.963H.3613v-7.963h6.1485a1.0179 1.0179 0 0 1-.0157-.1777c0-.0628.0066-.1238.0176-.1836zm.2617.5117v7.664h7.9961v-7.664h-.0332a1.025 1.025 0 0 1-.4883.5703.8482.8482 0 0 1-.4746.1426.8483.8483 0 0 1-.4746-.1426 1.025 1.025 0 0 1-.4883-.5703zm21.5606.252c.0966.1084.1562.2266.1797.3555.0116.0615.0175.1992.0175.4101v1.664c-.2753-.2606-.6554-.3906-1.1386-.3906-.3662 0-.6896.1007-.9707.3028-.5946.4276-.8926 1.2249-.8926 2.3906 0 .3515.0469.67.1406.957.1347.41.3487.7335.6387.9707.3075.252.669.379 1.0879.379.495 0 .9034-.1574 1.2226-.4708v.373H24c-.1347-.1492-.2012-.4072-.2012-.7733v-6.168Zm-9.6328.2988c-.785 0-1.463.2873-2.0372.8613-.6209.621-.9316 1.4593-.9316 2.5137 0 .9402.253 1.7238.7598 2.3535.5447.6795 1.2746 1.0196 2.1914 1.0196.577 0 1.0987-.131 1.5644-.3946.2636-.1494.414-.22.4492-.211l-.7304-1.1952c-.3456.3807-.7404.5703-1.1856.5703-.249 0-.4834-.0782-.703-.2363-.4717-.3398-.7071-.9749-.7071-1.9063 0-.328.0322-.628.0996-.9004.205-.8318.6447-1.248 1.3183-1.248.4306 0 .7755.1641 1.0332.4922l.7872-1.1426c-.085-.009-.1964-.0508-.334-.127-.536-.2987-1.0617-.4492-1.5742-.4492zM.5605 9.175H2.625c-.164.164-.2461.4474-.246.8515v1.6133l1.2616-1.5957c.2578-.325.3867-.5674.3867-.7285 0-.0585-.0088-.1054-.0234-.1406h2.2012c-.167.0937-.375.2901-.627.5918-.0673.079-.1856.2247-.3554.4355L3.5703 12.259l1.9727 2.7148c.12.164.2725.3497.457.5547.0498.0527.1211.1144.2148.1875H3.957a.7156.7156 0 0 0 .0254-.1797c0-.1611-.1114-.3946-.334-.6992L2.379 13.1066v1.754c0 .407.082.6914.2461.8554H.5605c.1143-.1142.1866-.2442.2188-.3906.0175-.082.0273-.2355.0273-.461v-4.8379c0-.2255-.0098-.3789-.0273-.4609-.0322-.1464-.1045-.2764-.2188-.3906zm16.2032 1.6386c-.2373 0-.4561.0195-.6582.0605l-.5977.1504c-.2812.0703-.4717.1055-.5683.1055l.4355 1.0488c.41-.2167.8019-.3242 1.1738-.3242.4364 0 .6543.2511.6543.752-.2167-.0116-.3691-.0176-.457-.0176-.618 0-1.0987.083-1.4414.25-.5946.29-.8906.7384-.8906 1.3476 0 .2666.0469.506.1406.7168.1318.2959.3409.5244.6308.6856.2754.1522.5831.2276.92.2246.4745-.006.8623-.1632.1164-.4707v.373h1.6387c-.0996-.1083-.1621-.2276-.1855-.3594-.0117-.0644-.0176-.2031-.0176-.414V12.794c0-.4305-.0587-.791-.1758-1.084-.2402-.5974-.8284-.8964-1.7656-.8964zm-10.211.0957h1.7266v4.0332c0 .211.0059.3497.0176.4141.0234.1318.086.251.1855.3594H6.5488c.0996-.1083.1602-.2276.1836-.3594.0117-.0644.0176-.2032.0176-.414V11.675c0-.2109-.0059-.3467-.0176-.4082-.0234-.1289-.083-.249-.1797-.3574zM21.623 11.929c.2373 0 .4532.082.6465.246v2.1934c-.2284.1845-.4668.2754-.7129.2754-.4715 0-.707-.4025-.707-1.211 0-1.0016.258-1.5038.7734-1.5038zm-4.793 1.6484c.123 0 .2403.009.3516.0293v.7617c-.1464.252-.38.377-.6992.377-.1728 0-.3154-.046-.4297-.1367-.126-.0996-.1894-.2315-.1894-.3985 0-.2226.1114-.3906.334-.502.1757-.0878.3867-.1308.6328-.1308z"/></svg>`,
  },
  {
    name: "DevOps",
    category: "tools",
    level: "50%",
    learning: true,
    color: "var(--accent)",
    icon: `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>`,
  },
  {
    name: "Vercel",
    category: "tools",
    level: "80%",
    learning: false,
    color: "var(--text-primary)",
    icon: `<svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L24 22H0L12 2z"></path></svg>`,
  },
  {
    name: "Agentic Coding",
    category: "tools",
    level: "65%",
    learning: true,
    color: "var(--accent-bright, #38bdf8)",
    icon: `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"></path></svg>`,
  },

  // --- 4. Soft skills ---
  {
    name: "Presentation",
    category: "soft",
    level: "95%",
    learning: false,
    color: "var(--text-primary)",
    icon: `<svg aria-hidden="true" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2H14.5L15 2.5V9.35418C14.714 9.03018 14.3764 8.75287 14 8.53513V3H2V11H4.5L5 11.5V13.293L7.146 11.146L7.5 11H8.12602C8.04375 11.3196 8 11.6547 8 12H7.707L4.854 14.854L4 14.5V12H1.5L1 11.5V2.5L1.5 2Z"></path><path d="M12 9C11.4067 9 10.8266 9.17595 10.3333 9.50559C9.83994 9.83524 9.45543 10.3038 9.22836 10.8519C9.0013 11.4001 8.94189 12.0033 9.05765 12.5853C9.1734 13.1672 9.45912 13.7018 9.87868 14.1213C10.2982 14.5409 10.8328 14.8266 11.4147 14.9424C11.9967 15.0581 12.5999 14.9987 13.1481 14.7716C13.6962 14.5446 14.1648 14.1601 14.4944 13.6667C14.8241 13.1734 15 12.5933 15 12C14.999 11.2047 14.6826 10.4422 14.1202 9.87976C13.5578 9.31736 12.7954 9.00098 12 9Z"></path></svg>`,
  },
  {
    name: "Teamwork",
    category: "soft",
    level: "75%",
    learning: false,
    color: "var(--text-primary)",
    icon: `<svg aria-hidden="true" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M16.24 13.65c-1.17-.52-2.61-.9-4.24-.9-1.63 0-3.07.39-4.24.9A2.988 2.988 0 0 0 6 16.39V18h12v-1.61c0-1.18-.68-2.26-1.76-2.74zM1.22 14.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58zM22.78 14.58A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85zM12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM1.497 11 4 8.497 6.503 11 4 13.503zM20 9l-2.5 4h5z"></path></svg>`,
  },

  {
    name: "Leadership",
    category: "soft",
    level: "75%",
    learning: false,
    color: "var(--text-primary)",
    icon: `<svg aria-hidden="true" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z"></path></svg>`,
  },
];
// Card များကို အလုပ်လုပ်စေရန် Render လုပ်ခြင်း
function renderSkills() {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  grid.innerHTML = skillsData
    .map(
      (skill) => `
    <li class="skill-tile" data-category="${skill.category}" data-learning="${Boolean(skill.learning)}">
      ${skill.learning ? `<span class="skill-badge">Learning</span>` : ""}
      <div class="skill-tile-header">
        <div class="skill-icon-wrap" style="color: ${skill.color};">${skill.icon}</div>
        <div class="skill-info">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-level">${skill.level}</span>
        </div>
      </div>
      <div class="skill-progress-bar">
        <div class="skill-progress-fill" style="width: ${skill.level};"></div>
      </div>
    </li>
  `,
    )
    .join("");
}

// Tab Filter & Default "web" Tab Logic (All ဖြုတ်ပြီး Web dev ကို Default ထားခြင်း)
function initSkillTabs() {
  const nav = document.getElementById("skills-nav");
  const tabs = document.querySelectorAll(".skill-tab-btn");

  if (!nav || !tabs.length) return;

  function activateTab(selectedTab) {
    const selectedCategory = selectedTab.dataset.skillTab;
    const tiles = document.querySelectorAll(".skill-tile");

    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });

    tiles.forEach((tile) => {
      const matches = tile.dataset.category === selectedCategory;
      tile.hidden = !matches;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });
  });

  // Page စဖွင့်တာနဲ့ Default Active Tab အဖြစ် "web" ကို အလိုအလျောက် Filter လုပ်ပေးရန်
  const defaultTab =
    document.querySelector('.skill-tab-btn[data-skill-tab="web"]') || tabs[0];
  if (defaultTab) {
    activateTab(defaultTab);
  }

  // Keyboard Navigation Support
  nav.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    const tabArray = Array.from(tabs);
    const currentIndex = tabArray.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + tabArray.length) % tabArray.length;
    const nextTab = tabArray[nextIndex];

    nextTab.focus();
    activateTab(nextTab);
  });
}

/* ==================== PART 5: PROJECTS ==================== */

const projects = [
  {
    title: "MakerHub MM",
    category: "Web Apps",
    image: "assets/makerhub-mm.png",
    imageAlt: "MakerHub MM IoT and Arduino learning platform interface",
    description:
      "Modern IoT & Arduino learning platform for Myanmar tech learners with interactive roadmaps and a Raspberry Pi curriculum.",
    tech: ["React", "Vite", "Tailwind CSS", "MockAPI"],
    live: "https://makerhub-react.vercel.app",
    github: "https://github.com/ThoonPhyoAung/makerhub-react",
  },
  {
    title: "Stationery Store Django POS",
    category: "Web Apps",
    image: "assets/django-pos.png",
    imageAlt: "Stationery Store Django POS dashboard preview",
    description:
      "Retail Point-of-Sale web application featuring a session-based shopping cart, live product search, automated receipts, and inventory deduction.",
    tech: ["Python", "Django", "Tailwind CSS", "SQLite"],
    live: null,
    github: "https://github.com/ThoonPhyoAung/django-pos-system",
  },
  {
    title: "ESP32-S3 Smart Water & Motor Control",
    category: "Embedded IoT",
    image: "assets/esp32-water.png",
    imageAlt: "ESP32-S3 ultrasonic water level and motor control setup",
    description:
      "Dual-mode (Auto/Manual) water level management system streaming live ultrasonic telemetry to Ubidots dashboards via MQTT.",
    tech: ["ESP32-S3", "C/C++", "HC-SR04", "MQTT"],
    live: null,
    github: "https://github.com/ThoonPhyoAung/esp32-ubidots-waterlevel",
  },
  {
    title: "Smart Motor Control System",
    category: "Embedded IoT",
    image: "assets/motor-control.jpg",
    imageAlt: "Smart AC submersible pump motor controller circuit",
    description:
      "Industrial safety motor controller for high-power AC submersible pumps featuring dry-run protection and remote relay control.",
    tech: ["ESP32", "Arduino C++", "Relay Module"],
    live: null,
    github: "https://github.com/ThoonPhyo/Arduino-Smart-Motor-Control-V-2",
  },
];

function createProjectCard(project) {
  const techTags = project.tech
    .map((item) => `<span class="tech-tag">${item}</span>`)
    .join("");

  const liveLink = project.live
    ? `<a class="project-link" href="${project.live}" target="_blank" rel="noopener noreferrer">Live Demo →</a>`
    : "";

  const githubLink = project.github
    ? `<a class="project-link" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub →</a>`
    : "";

  const imgAlt = project.imageAlt || project.title;
  const imgHtml = project.image
    ? `<img class="project-img" src="${project.image}" alt="${imgAlt}" loading="lazy" />`
    : "";

  return `
    <article class="project-card">
      <div class="project-banner">
        ${imgHtml}
        <span class="project-category">${project.category}</span>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">${techTags}</div>
        <div class="project-footer">
          ${liveLink}
          ${githubLink}
        </div>
      </div>
    </article>
  `;
}

function renderProjects(projectList) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projectList
    .map((project) => createProjectCard(project))
    .join("");
}

function applyProjectFilter(filter) {
  const grid = document.getElementById("projects-grid");
  const countText = document.getElementById("projects-count");
  const emptyText = document.getElementById("projects-empty");

  // 1. "All" ဆိုရင် အကုန်ယူမယ်၊ မဟုတ်ရင် Category တူတာပဲ စစ်ထုတ်မယ်
  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  // 2. စစ်ထုတ်ထားတဲ့ Card တွေကို Screen ပေါ် ထုတ်ပေးမယ်
  renderProjects(filteredProjects);

  // 3. Carousel scroll ကို ဘယ်ဘက်အစ (0) ကို ပြန်ပို့မယ်
  if (grid) {
    grid.scrollLeft = 0;
  }

  // 4. Project မရှိတဲ့အခါ vs ရှိတဲ့အခါ Count နဲ့ Empty စာသား ပြောင်းမယ်
  if (filteredProjects.length === 0) {
    if (grid) grid.hidden = true;
    if (emptyText) emptyText.hidden = false;
    if (countText) {
      countText.hidden = false;
      countText.textContent = `No projects found in ${filter}.`;
    }
  } else {
    if (grid) grid.hidden = false;
    if (emptyText) emptyText.hidden = true;
    if (countText) {
      countText.hidden = false;
      countText.textContent =
        filter === "All"
          ? `Showing ${filteredProjects.length} of ${projects.length} projects`
          : `Showing ${filteredProjects.length} of ${projects.length} projects in ${filter}`;
    }
  }

  updateCarouselButtons();
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (filterButtons.length === 0) {
    applyProjectFilter("All");
    return;
  }

  filterButtons.forEach((clickedButton) => {
    clickedButton.addEventListener("click", () => {
      // 1. ခလုတ်အားလုံးဆီက active အရောင်ကို အရင်ဖြုတ်မယ်
      filterButtons.forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });

      // 2. အခု နှိပ်လိုက်တဲ့ ခလုတ်တစ်ခုတည်းကိုပဲ active ပေးမယ်
      clickedButton.classList.add("is-active");
      clickedButton.setAttribute("aria-pressed", "true");

      // 3. ခလုတ်ထဲက data-filter တန်ဖိုးကို ယူပြီး Filter လုပ်မယ်
      const selectedFilter = clickedButton.dataset.filter || "All";
      applyProjectFilter(selectedFilter);
    });
  });

  // Page စဖွင့်တာနဲ့ "All" ကို အလိုအလျောက် ပြပေးမယ်
  applyProjectFilter("All");
}

function getCardScrollStep(grid) {
  const firstCard = grid.querySelector(".project-card");
  if (!firstCard) return grid.clientWidth;

  // Card ၁ ကတ်ရဲ့ အကျယ် + Card တွေကြားက gap အကွာအဝေးကို ပေါင်းယူမယ်
  const cardWidth = firstCard.getBoundingClientRect().width;
  const styles = window.getComputedStyle(grid);
  const gap = parseFloat(styles.columnGap || styles.gap) || 0;

  return cardWidth + gap;
}

function updateCarouselButtons() {
  const grid = document.getElementById("projects-grid");
  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");
  if (!grid || !prevBtn || !nextBtn) return;

  const hasCards = grid.hidden === false && grid.children.length > 0;
  const needsScroll = grid.scrollWidth > grid.clientWidth + 1;

  if (hasCards && needsScroll) {
    prevBtn.hidden = false;
    nextBtn.hidden = false;

    const atStart = grid.scrollLeft <= 1;
    const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;

    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  } else {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }
}

function initProjectCarousel() {
  const grid = document.getElementById("projects-grid");
  const prevBtn = document.getElementById("projects-prev");
  const nextBtn = document.getElementById("projects-next");
  if (!grid || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", () => {
    const step = getCardScrollStep(grid);
    grid.scrollBy({ left: -step, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    const step = getCardScrollStep(grid);
    grid.scrollBy({ left: step, behavior: "smooth" });
  });

  grid.addEventListener("scroll", updateCarouselButtons, { passive: true });
  window.addEventListener("resize", updateCarouselButtons);
  updateCarouselButtons();
}

/* ==================== PART 6: CONTACT FORM ==================== */

function showError(input, errorBox, msg) {
  if (!errorBox) return;
  input.setAttribute("aria-invalid", "true");
  errorBox.textContent = msg;
  errorBox.hidden = false;
}

function clearError(input, errorBox) {
  if (!errorBox) return;
  input.removeAttribute("aria-invalid");
  errorBox.textContent = "";
  errorBox.hidden = true;
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const msgInput = document.getElementById("contact-message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const msgError = document.getElementById("message-error");
  const countText = document.getElementById("message-count");
  const statusBox = document.getElementById("form-status");

  if (!form || !nameInput || !emailInput || !msgInput) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function getNameError() {
    const val = nameInput.value.trim();
    if (val.length < 2) return "Name must be at least 2 characters.";
    return "";
  }

  function getEmailError() {
    const val = emailInput.value.trim();
    if (!emailRegex.test(val)) return "Please enter a valid email address.";
    return "";
  }

  function getMsgError() {
    const len = msgInput.value.trim().length;
    if (len < 20) return `Message must be at least 20 characters (${len}/20).`;
    if (len > 500)
      return `Message must be 500 characters or less (${len}/500).`;
    return "";
  }

  function updateCount() {
    const len = msgInput.value.trim().length;
    if (countText) {
      countText.textContent = `${len} / 500 characters`;
      countText.classList.toggle("is-over", len > 500);
    }
  }

  // ရိုက်နေစဉ် မှန်သွားရင် error ဖျောက်မယ်
  nameInput.addEventListener("input", () => {
    if (!getNameError()) clearError(nameInput, nameError);
  });

  emailInput.addEventListener("input", () => {
    if (!getEmailError()) clearError(emailInput, emailError);
  });

  msgInput.addEventListener("input", () => {
    updateCount();
    if (!getMsgError()) clearError(msgInput, msgError);
  });

  // Input ထဲက ထွက်သွားတဲ့အခါ မှားနေရင် error ပြမယ်
  nameInput.addEventListener("blur", () => {
    const err = getNameError();
    if (err) showError(nameInput, nameError, err);
  });

  emailInput.addEventListener("blur", () => {
    const err = getEmailError();
    if (err) showError(emailInput, emailError, err);
  });

  msgInput.addEventListener("blur", () => {
    const err = getMsgError();
    if (err) showError(msgInput, msgError, err);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (statusBox) statusBox.hidden = true;

    const checks = [
      { input: nameInput, errorBox: nameError, msg: getNameError() },
      { input: emailInput, errorBox: emailError, msg: getEmailError() },
      { input: msgInput, errorBox: msgError, msg: getMsgError() },
    ];

    let firstInvalid = null;

    checks.forEach((item) => {
      if (item.msg) {
        showError(item.input, item.errorBox, item.msg);
        if (!firstInvalid) firstInvalid = item.input;
      } else {
        clearError(item.input, item.errorBox);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    form.reset();
    updateCount();

    if (statusBox) {
      statusBox.textContent = "Demo only. Your message has not been sent.";
      statusBox.hidden = false;
    }
  });

  updateCount();
}

// ==================== Footer ====================
const footerYear = document.getElementById("footer-year");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ==================== Pointer effect ==================== */
function initPointerBubbles() {
  const layer = document.getElementById("pointer-fx-layer");
  if (!layer) return;

  let lastTime = 0;

  function spawnOne(x, y) {
    const dot = document.createElement("span");
    dot.className = "fx-particle";

    const size = Math.floor(Math.random() * 16) + 10; // 10px - 25px
    const dx = Math.floor(Math.random() * 44) - 22; // -22px to +22px
    const dy = -(Math.floor(Math.random() * 34) + 22); // -22px to -55px

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${x + (Math.random() * 10 - 5)}px`;
    dot.style.top = `${y + (Math.random() * 10 - 5)}px`;
    dot.style.setProperty("--dx", `${dx}px`);
    dot.style.setProperty("--dy", `${dy}px`);

    layer.appendChild(dot);
    setTimeout(() => dot.remove(), 800);
  }

  window.addEventListener("pointermove", (e) => {
    const now = Date.now();
    if (now - lastTime < 20) return;
    lastTime = now;

    spawnOne(e.clientX, e.clientY);
    spawnOne(e.clientX, e.clientY);
  });
}

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initThemeSwitcher();
  initMobileNavigation();
  renderSkills();
  initSkillTabs();
  initProjectFilters();
  initProjectCarousel();
  initContactForm();
  initPointerBubbles();
});
