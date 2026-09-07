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
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkztDZsDPpCTT3wplHPeragKkoa7NNg8x0XJDx1HbACxje-V8PUGfg41VSyCDfrWgPIw/exec'; // PASTE YOUR ACTUAL URL HERE

async function submitSupportTicket(formData) {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        ticketId: formData.ticketId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        queryType: formData.queryType,
        subject: formData.subject,
        message: formData.message
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      console.log('Ticket created:', result.ticketId);
      return {
        success: true,
        ticketId: result.ticketId
      };
    }

    throw new Error(result.message || 'Unable to submit ticket.');

  } catch (error) {
    console.error('Support form error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Form Submission Event Listener for Support Page
const supportForm = document.getElementById('supportForm');
if(supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button and show loading state
    const submitBtn = document.getElementById('submitBtn');
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

    // Send the data to Google Apps Script
    const result = await submitSupportTicket(formData);

    // Handle the response
    if (result.success) {
      // Show success message
      const successDiv = document.getElementById('formSuccess');
      if(successDiv) {
        successDiv.classList.remove('hidden');
        supportForm.reset();
      }
    } else {
      // Show error message
      alert('Error: ' + result.message);
      if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Ticket';
      }
    }
  });
}
