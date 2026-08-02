(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.hasAttribute("data-open");
      if (isOpen) {
        mobileNav.removeAttribute("data-open");
        mobileNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      } else {
        mobileNav.setAttribute("data-open", "");
        mobileNav.hidden = false;
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.removeAttribute("data-open");
        mobileNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------- Accessible tabs (Showcase) ---------- */
  var tabGroups = document.querySelectorAll("[data-tabs]");

  tabGroups.forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(group.querySelectorAll('[role="tabpanel"]'));

    function activate(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.tabIndex = selected ? 0 : -1;
        t.classList.toggle("is-active", selected);
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab);
      });
      tab.addEventListener("keydown", function (e) {
        var newIndex = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          newIndex = 0;
        } else if (e.key === "End") {
          newIndex = tabs.length - 1;
        }
        if (newIndex !== null) {
          e.preventDefault();
          tabs[newIndex].focus();
          activate(tabs[newIndex]);
        }
      });
    });
  });

  /* ---------- Inline document viewer toggle ---------- */
  document.querySelectorAll("[data-doc-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var viewer = document.getElementById(btn.getAttribute("data-doc-toggle"));
      if (!viewer) return;
      var willShow = viewer.hidden;
      if (willShow) {
        var iframe = viewer.querySelector("iframe");
        if (iframe && !iframe.src) {
          iframe.src = iframe.getAttribute("data-src");
        }
        viewer.hidden = false;
        btn.textContent = btn.textContent.replace("View", "Hide");
      } else {
        viewer.hidden = true;
        btn.textContent = btn.textContent.replace("Hide", "View");
      }
    });
  });

  /* ---------- Active nav-link highlighting on scroll ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".main-nav a, .mobile-nav a");

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var isMatch = link.getAttribute("href") === "#" + id;
              link.classList.toggle("is-current", isMatch);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
