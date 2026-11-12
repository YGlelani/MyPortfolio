/* ==========================================================================
   Phikelelani Gumbi — Portfolio
   Vanilla JavaScript. No dependencies, no backend.
   ========================================================================== */

(function () {
  'use strict';

  // Enable JavaScript-dependent CSS features.
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ==========================================================================
     1. HEADER SHADOW AND BACK-TO-TOP VISIBILITY
     ========================================================================== */

  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var scrollPosition = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle('is-scrolled', scrollPosition > 8);
    }

    if (toTop) {
      toTop.classList.toggle('is-visible', scrollPosition > 560);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ==========================================================================
     2. MOBILE NAVIGATION
     ========================================================================== */

  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function setNav(open) {
    if (!navToggle || !mobileNav) return;

    navToggle.setAttribute('aria-expanded', String(open));

    navToggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu'
    );

    mobileNav.setAttribute('data-open', String(open));

    document.body.classList.toggle('nav-open', open);
  }

  if (navToggle && mobileNav) {

    navToggle.addEventListener('click', function () {
      var isOpen =
        navToggle.getAttribute('aria-expanded') === 'true';

      setNav(!isOpen);
    });

    // Close the menu when a navigation link is selected.
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNav(false);
      });
    });

    // Close the menu when clicking outside it.
    document.addEventListener('click', function (event) {
      if (
        !mobileNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        setNav(false);
      }
    });

    // Close the menu with the Escape key.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setNav(false);
      }
    });

    // Close the mobile menu when switching to desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) {
        setNav(false);
      }
    });
  }


  /* ==========================================================================
     3. BACK-TO-TOP BUTTON
     ========================================================================== */

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  }


  /* ==========================================================================
     4. SMOOTH SCROLLING
     ========================================================================== */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') return;

      var target;

      try {
        target = document.querySelector(targetId);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      // Close mobile navigation after selecting a section.
      if (mobileNav && mobileNav.contains(link)) {
        setNav(false);
      }

      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      // Update the URL without causing another page jump.
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', targetId);
      }
    });

  });


  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS
     ========================================================================== */

  var revealElements = document.querySelectorAll('.reveal');

  if (
    reduceMotion ||
    !('IntersectionObserver' in window)
  ) {
    revealElements.forEach(function (element) {
      element.classList.add('is-visible');
    });

  } else {

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });

  }


  /* ==========================================================================
     6. ACTIVE NAVIGATION LINK ON SCROLL
     ========================================================================== */

  var sections = document.querySelectorAll('main section[id]');

  var navLinks = document.querySelectorAll(
    '.nav-desktop a[href^="#"], #mobileNav a[href^="#"]'
  );

  function updateActiveLink(sectionId) {

    navLinks.forEach(function (link) {

      var isActive =
        link.getAttribute('href') === '#' + sectionId;

      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }

    });

  }

  if (
    'IntersectionObserver' in window &&
    sections.length > 0
  ) {

    var sectionObserver = new IntersectionObserver(
      function (entries) {

        var visibleSections = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

        if (visibleSections.length > 0) {
          updateActiveLink(visibleSections[0].target.id);
        }

      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75]
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

  }


  /* ==========================================================================
     7. AUTOMATIC FOOTER YEAR
     ========================================================================== */

  var yearElement = document.getElementById('currentYear');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ==========================================================================
     8. CONTACT FORM — FORMSPREE
     ========================================================================== */

  var contactForm = document.getElementById('contactForm');

  var formStatus = document.getElementById('formStatus');

  var submitButton = contactForm
    ? contactForm.querySelector('[type="submit"]')
    : null;

  if (contactForm) {

    contactForm.addEventListener('submit', async function (event) {

      event.preventDefault();

      // Validate form fields.
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var originalButtonText = submitButton
        ? submitButton.textContent
        : '';

      // Prevent multiple submissions.
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      // Clear previous messages.
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }

      try {

        var response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Message submission failed.');
        }

        // Reset the form after successful submission.
        contactForm.reset();

        if (formStatus) {
          formStatus.textContent =
            'Thank you! Your message has been sent successfully.';

          formStatus.className =
            'form-status is-success';

        }

      } catch (error) {

        if (formStatus) {
          formStatus.textContent =
            'Sorry, your message could not be sent. Please try again or contact me directly by email.';

          formStatus.className =
            'form-status is-error';
        }

      } finally {

        // Restore the submit button.
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }

      }

    });

  }


  /* ==========================================================================
     9. PROFILE IMAGE FALLBACK
     ========================================================================== */

  var portrait = document.querySelector('.portrait');
  var portraitImage = portrait
    ? portrait.querySelector('img')
    : null;

  if (portrait && portraitImage) {

    portraitImage.addEventListener('error', function () {
      portrait.classList.add('is-fallback');
    });

    // Handle an image that failed before this script loaded.
    if (portraitImage.complete && portraitImage.naturalWidth === 0) {
      portrait.classList.add('is-fallback');
    }

  }


  /* ==========================================================================
     10. INITIAL NAVIGATION STATE
     ========================================================================== */

  if (navToggle && mobileNav) {
    setNav(false);
  }

})();