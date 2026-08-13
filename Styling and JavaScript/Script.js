document.addEventListener("DOMContentLoaded", function () {
  const industryTabs    = document.querySelectorAll(".industry-tab");
  const industryPanels  = document.querySelectorAll(".industry-panel");
  const caseCards       = document.querySelectorAll("[data-case]");
  const detailPanels    = document.querySelectorAll("[data-detail]");
  const backButtons     = document.querySelectorAll(".back-button");
  const langButtons     = document.querySelectorAll(".lang-toggle");
  const industrySection = document.getElementById("industry");
  const brandMark       = document.getElementById("brand-mark");
  const brandName       = document.getElementById("brand-name");

  // ===== SCROLL HELPERS =====

  function scrollToIndustry() {
    if (!industrySection) return;

    const headerHeight = 72;
    const scrollPosition =
      industrySection.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      18;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
  }

  function scrollToFinancePanel() {
    const panel = document.getElementById("finance-panel");
    if (!panel) return;

    const offset = 90;
    const top = panel.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: top,
      behavior: "smooth"
    });
  }

  // ===== DETAIL PANELS =====

  function hideAllDetails() {
    detailPanels.forEach(function (panel) {
      panel.setAttribute("hidden", "");
    });
  }

  function showIndustry(industryName) {
    // Tabs: active state
    industryTabs.forEach(function (tab) {
      const active = tab.dataset.tab === industryName;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    // Panels: visibility
    industryPanels.forEach(function (panel) {
      const active = panel.dataset.panel === industryName;
      panel.classList.toggle("active", active);

      if (active) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });

    hideAllDetails();
  }

  function showDetail(caseName) {
    const detailPanel = document.querySelector('[data-detail="' + caseName + '"]');
    if (!detailPanel) return;

    const currentPanel = document.querySelector(".industry-panel.active");
    if (currentPanel) {
      currentPanel.classList.remove("active");
      currentPanel.setAttribute("hidden", "");
    }

    hideAllDetails();
    detailPanel.removeAttribute("hidden");
    scrollToIndustry();
  }

  // ===== LANGUAGE TOGGLE =====

  function setLanguage(lang) {
    // For CSS (MHI ENG/中 logos etc.)
    document.documentElement.setAttribute("data-lang", lang);

    // Header language buttons
    langButtons.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Update all text elements with data-text-en / data-text-zh
    const translatable = document.querySelectorAll("[data-text-en][data-text-zh]");
    translatable.forEach(function (el) {
      const text = lang === "zh" ? el.dataset.textZh : el.dataset.textEn;
      if (text !== undefined && text !== null) {
        el.innerHTML = text;
      }
    });

    // Brand text in header
    if (brandMark) {
      brandMark.textContent = lang === "zh" ? "電訊盈科" : "PCCW";
    }

    if (brandName) {
      brandName.textContent =
        lang === "zh" ? "行業人工智慧應用案例" : "Industry AI Use Cases";
    }
  }

  // ===== EVENT WIRING =====

  // Tabs: switch industry and scroll
  industryTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const tabName = tab.dataset.tab;   // e.g. "finance", "manufacturing", "retail", "healthcare", "logistics"
      showIndustry(tabName);

      if (tabName === "finance") {
        setTimeout(function () {
          scrollToFinancePanel();
        }, 50);
      } else {
        scrollToIndustry();
      }
    });
  });

  // Case cards: show detail view (if detail panels exist)
  caseCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const caseName = card.dataset.case;
      if (!caseName) return;
      showDetail(caseName);
    });
  });

  // Back buttons in detail views: return to correct industry
  backButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const detailPanel = button.closest(".case-detail");
      if (!detailPanel) return;

      const detailName = detailPanel.dataset.detail;
      let industryName = "finance";

      // Manufacturing detail mapping
      if (detailName === "mhi-maintenance" || detailName === "wiadvance-supply") {
        industryName = "manufacturing";
      }

      // Retail detail mapping
      if (detailName === "amazon-agents" || detailName === "nike-personalisation") {
        industryName = "retail";
      }

      // Healthcare detail mapping (check spelling against your HTML)
      if (detailName === "salesforce-engagement" || detailName === "prosaic-diagnostics") {
        industryName = "healthcare";
      }

      // Logistics mapping (if you add detail panels later)
      if (detailName === "logistics-route" || detailName === "logistics-demand") {
        industryName = "logistics";
      }

      showIndustry(industryName);
      scrollToIndustry();
    });
  });

  // Language buttons
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.dataset.lang);
    });
  });

  // ===== INITIAL STATE =====
  setLanguage("en");
  showIndustry("finance");
});