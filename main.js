// Fetch and inject Header
fetch('/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-include').innerHTML = data;
    
    // Initialize Mobile Menu scripts AFTER header loads
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if(menuBtn) {
      menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
      closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
      document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
      });
    }
  });

// Fetch and inject Footer
fetch('/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-include').innerHTML = data;
    
    // Initialize Back to Top button AFTER footer loads
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

// FAQ Accordion (Safe to run globally, will only trigger if FAQ items exist)
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
