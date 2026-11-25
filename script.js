/* ============================================================
   script.js — StepUp Shoes Karachi
   Contains:
     1. Sticky navbar (scroll + solid class)
     2. Mobile hamburger menu toggle
     3. Active nav link highlighting
     4. Scroll-reveal animations (IntersectionObserver)
     5. Product category filter (All / Running / Formal / Casual)
     6. Back-to-top button
     7. Contact form validation + success message
     8. Newsletter form handling
   ============================================================ */


/* ============================================================
   UTILITY — wait for the DOM to be fully loaded before
   running any JavaScript, so elements exist when we query them.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. STICKY NAVBAR
        On pages with a hero (index.html) the navbar starts
        transparent and gains a solid background after 60px.
        On inner pages (about / contact) we use the .solid class
        set directly in HTML to always show a solid bar.
     ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    // If this page has a hero section, apply scroll-based bg change
    const hasHero = document.querySelector('.hero');

    function handleNavbarScroll() {
      if (hasHero) {
        // Add .scrolled class when user has scrolled more than 60px
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }

    // Run once on load in case the page is already scrolled (e.g. refresh)
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);
  }


  /* ----------------------------------------------------------
     2. MOBILE HAMBURGER MENU
        Clicking the hamburger button toggles the .open class on
        both the button and the nav links list.
        Clicking any nav link or outside the menu closes it.
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks  = document.querySelector('.navbar__links');

  if (hamburger && navLinks) {
    // Toggle open/close when button is clicked
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');

      // Accessibility: announce expanded state to screen readers
      const isOpen = hamburger.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close the menu when any nav link is clicked (useful on mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking anywhere outside the navbar
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK HIGHLIGHTING
        Checks the current page filename and adds the .active
        class to the matching nav link.
     ---------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar__links a').forEach(function (link) {
    const linkPage = link.getAttribute('href');
    // Compare current filename with the link's href value
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });


  /* ----------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
        Uses IntersectionObserver (a modern, performant browser
        API) to detect when elements enter the viewport.
        Elements with the class .reveal start invisible
        (opacity:0 in CSS) and become .visible when seen.
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Element is in view — add .visible to trigger the CSS animation
            entry.target.classList.add('visible');
            // Stop watching after first reveal (animation only plays once)
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,  // trigger when 12% of element is visible
        rootMargin: '0px 0px -40px 0px' // small offset so element is clearly on screen
      }
    );

    // Attach the observer to every .reveal element on the page
    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  /* ----------------------------------------------------------
     5. PRODUCT CATEGORY FILTER
        On the home page there are filter buttons:
        All / Running / Formal / Casual
        Each product card has a data-category attribute.
        Clicking a filter button shows only matching cards.
     ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards  = document.querySelectorAll('.card[data-category]');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // 1. Mark only the clicked button as active
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // 2. Get the chosen category from the button's data attribute
        const chosen = btn.getAttribute('data-filter');

        // 3. Show / hide cards with a smooth fade
        productCards.forEach(function (card) {
          const cardCategory = card.getAttribute('data-category');

          if (chosen === 'all' || cardCategory === chosen) {
            // Show: remove hidden, trigger reflow, fade in
            card.style.display = 'flex';
            // Small timeout lets the browser repaint before we animate
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            // Hide: fade out then remove from layout
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 300); // matches CSS transition duration
          }
        });
      });
    });
  }


  /* ----------------------------------------------------------
     6. BACK-TO-TOP BUTTON
        A floating button appears after scrolling 400px.
        Clicking it scrolls the page smoothly back to the top.
     ---------------------------------------------------------- */
  const backToTopBtn = document.querySelector('.back-to-top');

  if (backToTopBtn) {
    // Show button when user scrolls down 400px
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     7. CONTACT FORM VALIDATION
        Client-side validation before "submitting" the form.
        Real submission would use fetch() to a backend endpoint;
        here we simulate a success message after validation.
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Prevent default browser form submission
      e.preventDefault();

      // Clear all previous errors
      clearAllErrors();

      // Collect field values
      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const phone   = document.getElementById('phone');
      const message = document.getElementById('message');

      let isValid = true; // track overall form validity

      // --- Validate Name ---
      if (name.value.trim().length < 2) {
        showError(name, 'Please enter your full name (at least 2 characters).');
        isValid = false;
      }

      // --- Validate Email ---
      // Simple regex: checks for characters@characters.characters
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // --- Validate Phone (optional but if entered must be valid) ---
      if (phone.value.trim() !== '') {
        // Pakistan phone: 03XX-XXXXXXX or +92XXXXXXXXXX etc.
        const phoneRegex = /^[0-9+\-\s]{10,15}$/;
        if (!phoneRegex.test(phone.value.trim())) {
          showError(phone, 'Please enter a valid phone number (10–15 digits).');
          isValid = false;
        }
      }

      // --- Validate Message ---
      if (message.value.trim().length < 10) {
        showError(message, 'Please write a message of at least 10 characters.');
        isValid = false;
      }

      // --- If all valid, show success ---
      if (isValid) {
        // Hide the form and show the success message
        contactForm.style.display = 'none';
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          successMsg.classList.add('visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    /* Helper: display an error message below a field */
    function showError(field, message) {
      field.classList.add('error');
      const errorEl = field.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
      }
    }

    /* Helper: clear all error states */
    function clearAllErrors() {
      contactForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      contactForm.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
    }

    // Live validation — clear error as user types
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }


  /* ----------------------------------------------------------
     8. NEWSLETTER FORM
        Simple handling — show a brief confirmation inline.
     ---------------------------------------------------------- */
  const newsletterForm = document.querySelector('.newsletter__form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const input = newsletterForm.querySelector('input[type="email"]');
      const btn   = newsletterForm.querySelector('button');

      if (!input || input.value.trim() === '') {
        input.style.borderLeft = '3px solid #e53e3e';
        return;
      }

      // Simulate a successful subscription
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#2f855a';
      input.value = '';
      input.disabled = true;
      btn.disabled = true;
    });
  }


}); // end DOMContentLoaded
