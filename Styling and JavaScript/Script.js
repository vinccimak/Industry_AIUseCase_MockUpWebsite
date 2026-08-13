document.addEventListener("DOMContentLoaded", function () {
  const industryTabs = document.querySelectorAll(".industry-tab");
  const industryPanels = document.querySelectorAll(".industry-panel");
  const caseCards = document.querySelectorAll("[data-case]");
  const detailPanels = document.querySelectorAll("[data-detail]");
  const backButtons = document.querySelectorAll(".back-button");
  const langButtons = document.querySelectorAll(".lang-toggle");
  const industrySection = document.getElementById("industry");
  const brandMark = document.getElementById("brand-mark");
  const brandName = document.getElementById("brand-name");

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

    const top = panel.getBoundingClientRect().top + window.scrollY - 90;

    window.scrollTo({
      top: top,
      behavior: "smooth"
    });
  }

  function hideAllDetails() {
    detailPanels.forEach(function (panel) {
      panel.setAttribute("hidden", "");
    });
  }

  function showIndustry(industryName) {
    industryTabs.forEach(function (tab) {
      const active = tab.dataset.tab === industryName;

      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

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
    const detailPanel = document.querySelector(
      '[data-detail="' + caseName + '"]'
    );

    if (!detailPanel) {
      console.log("No detail panel found for:", caseName);
      return;
    }

    const currentPanel = document.querySelector(".industry-panel.active");

    if (currentPanel) {
      currentPanel.classList.remove("active");
      currentPanel.setAttribute("hidden", "");
    }

    hideAllDetails();
    detailPanel.removeAttribute("hidden");
    scrollToIndustry();
  }

  function setLanguage(lang) {
    document.documentElement.setAttribute("data-lang", lang);

    langButtons.forEach(function (button) {
      button.classList.toggle("active", button.dataset.lang === lang);
    });

    const translatable = document.querySelectorAll(
      "[data-text-en][data-text-zh]"
    );

    translatable.forEach(function (element) {
      const text = lang === "zh"
        ? element.dataset.textZh
        : element.dataset.textEn;

      if (text !== undefined && text !== null) {
        element.innerHTML = text;
      }
    });

    if (brandMark) {
      brandMark.textContent = lang === "zh" ? "電訊盈科" : "PCCW";
    }

    if (brandName) {
      brandName.textContent =
        lang === "zh"
          ? "行業人工智慧應用案例"
          : "Industry AI Use Cases";
    }
  }

  industryTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const tabName = tab.dataset.tab;

      showIndustry(tabName);

      if (tabName === "finance") {
        setTimeout(scrollToFinancePanel, 50);
      } else {
        scrollToIndustry();
      }
    });
  });

  caseCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const caseName = card.dataset.case;

      if (caseName) {
        showDetail(caseName);
      }
    });
  });

  backButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const detailPanel = button.closest(".case-detail");

      if (!detailPanel) return;

      const detailName = detailPanel.dataset.detail;
      let industryName = "finance";

      if (
        detailName === "mhi-maintenance" ||
        detailName === "wiadvance-supply"
      ) {
        industryName = "manufacturing";
      }

      if (
        detailName === "aws-agents" ||
        detailName === "nike-personalisation"
      ) {
        industryName = "retail";
      }

      if (
        detailName === "salesforce-engagement" ||
        detailName === "prosaic-diagnostics"
      ) {
        industryName = "healthcare";
      }

      if (
        detailName === "ups-orion" ||
        detailName === "samsara-fleet"
      ) {
        industryName = "logistics";
      }

      showIndustry(industryName);
      scrollToIndustry();
    });
  });

  langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.dataset.lang);
    });
  });

  setLanguage("en");
  showIndustry("finance");
});
