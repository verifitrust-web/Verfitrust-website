// Fetch and inject Header
fetch('/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-include').innerHTML = data;
    if (window.tailwind) { window.tailwind.refresh(); }
  });

// Fetch and inject Footer
fetch('/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-include').innerHTML = data;
    if (window.tailwind) { window.tailwind.refresh(); }
    
    const backTop = document.getElementById('backTop');
    if(backTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          backTop.style.opacity = '1';
          backTop.style.visibility = 'visible';
        } else {
          backTop.style.opacity = '0';
          backTop.style.visibility = 'hidden';
        }
      });
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  });

// Global Scroll Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .stagger').forEach(el => observer.observe(el));

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
if(faqItems.length > 0) {
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
        }
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = '0px';
      }
    });
  });

  const firstFaq = document.querySelector('.faq-item.active');
  if(firstFaq) {
    const firstAnswer = firstFaq.querySelector('.faq-answer');
    firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }
}

// Bulletproof Mobile Menu Click Listener (Event Delegation)
document.addEventListener('click', function(e) {
  const menuBtn = e.target.closest('#menuBtn');
  const closeMenu = e.target.closest('#closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');

  // Open/Close Mobile Hamburger Menu
  if (menuBtn && mobileMenu) {
    mobileMenu.classList.add('open');
  }
  if (closeMenu && mobileMenu) {
    mobileMenu.classList.remove('open');
  }
  
  // Close menu when a regular link inside it is clicked
  if (e.target.closest('.mobile-link') && mobileMenu && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
  }

  // Handle Mobile Accordion Toggles (Solutions, Industries, etc.)
  const accordionTrigger = e.target.closest('.mobile-accordion-trigger');
  if (accordionTrigger) {
    const content = accordionTrigger.nextElementSibling;
    const chevron = accordionTrigger.querySelector('i');
    if (content) {
      content.classList.toggle('open');
    }
    if (chevron) {
      if (content.classList.contains('open')) {
        chevron.style.transform = 'rotate(180deg)';
      } else {
        chevron.style.transform = 'rotate(0deg)';
      }
    }
  }
});

// ==========================================
// SUPPORT FORM LOGIC
// ==========================================
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkztDZsDPpCTT3wplHPeragKkoa7NNg8x0XJDx1HbACxje-V8PUGfg41VSyCDfrWgPIw/exec';

const supportForm = document.getElementById('supportForm');
if(supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button and show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerText;
    if(submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting...';
    }

    // Gather the form data from the HTML inputs
    const formData = {
      ticketId: 'TKT-' + Date.now(), // Automatically generate a unique ticket ID
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      company: document.getElementById('company').value,
      queryType: document.getElementById('queryType').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      // Send the data to Google Apps Script silently
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This is required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Show success message
      const successDiv = document.getElementById('formSuccess');
      if(successDiv) {
        successDiv.classList.remove('hidden');
        supportForm.reset();
      }
      
      // Reset button
      if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }

    } catch (error) {
      console.error('Support form error:', error);
      alert('Something went wrong. Please try again.');
      
      // Reset button on error
      if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    }
  });
}
// ==========================================
// candidate SUPPORT FORM LOGIC (Bulletproof version)
// ==========================================
document.addEventListener('submit', async function(e) {
    if (e.target && e.target.id === 'supportForm') {
        e.preventDefault(); 

        const supportForm = e.target;
        const submitBtn = document.getElementById('submitBtn');
        const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';

        if(submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';
        }

        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxlkxFUZoesxSaZqGVei-xGAg0OAAV4nSBQwEizqseQCxNkmohyZ0pMBzOiroBr1vmKtg/exec';

        // Safely grab the Country Code if it exists
        const countryCodeEl = document.getElementById('countryCode');
        const phoneEl = document.getElementById('phone');
        const fullPhoneNumber = countryCodeEl ? `${countryCodeEl.value} ${phoneEl.value}` : (phoneEl ? phoneEl.value : '');

        // Safely grab the Position or Company field (since Candidate form uses 'position' and Customer form uses 'company')
        const positionEl = document.getElementById('position');
        const companyEl = document.getElementById('company');
        const roleOrCompany = positionEl ? positionEl.value : (companyEl ? companyEl.value : 'N/A');

        const generatedTicketId = 'TKT-' + Date.now();

        const formData = {
            ticketId: generatedTicketId,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: fullPhoneNumber,
            company: roleOrCompany, 
            queryType: document.getElementById('queryType').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const successDiv = document.getElementById('formSuccess');
            if(successDiv) {
                successDiv.classList.remove('hidden');
                
                // Display the generated Ticket ID if the span exists
                const ticketIdSpan = document.getElementById('ticketIdDisplay');
                if(ticketIdSpan) {
                    ticketIdSpan.innerText = generatedTicketId;
                }
                
                supportForm.reset();
            }
            
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }

        } catch (error) {
            console.error('Support form error:', error);
            alert('Something went wrong. Please try again.');
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        }
    }
});
// ===== AUTOMATIC FAVICON INJECTION =====
const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.type = 'image/png';
faviconLink.href = '/assets/favicon.png';
document.head.appendChild(faviconLink);

const appleTouchIcon = document.createElement('link');
appleTouchIcon.rel = 'apple-touch-icon';
appleTouchIcon.sizes = '180x180';
appleTouchIcon.href = '/assets/favicon.png';
document.head.appendChild(appleTouchIcon);
