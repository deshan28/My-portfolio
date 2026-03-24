document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    /* --- Typing Effect --- */
    const words = ["Digital Experiences", "Web Applications", "UI/UX Designs"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedWordElement = document.querySelector('.typed-word');
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedWordElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedWordElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, speed);
    }
    
    // Start typing effect slightly delayed
    setTimeout(typeEffect, 1000);

    /* --- Scroll Reveal Animation --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Optional: Stop observing once shown
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    /* --- Active Navigation Link Update on Scroll --- */
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });
    });

    /* --- Particle Background Effect --- */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(139, 92, 246, 0.3)'; // Primary color with low opacity

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    initParticles();
    animateParticles();

    /* --- Web3Forms API Form Handling --- */
    const contactForm = document.getElementById('contactForm');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const accessKeyData = new FormData(contactForm).get('access_key');
            if (accessKeyData === 'YOUR_ACCESS_KEY_HERE') {
                alert("Mahcan! API key eka naha! Email eka automatic background eken ewanawanam Web3Forms Key eka index.html eke athulata daanna oni. (https://web3forms.com eken FREE key eka ganna).");
                return;
            }

            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            formData.append('subject', 'New Contact from Portfolio');
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    formResult.style.display = 'block';
                    formResult.style.color = '#10B981';
                    formResult.innerHTML = 'Email sent successfully! (Deshan ge inbox ekata eka giya).';
                } else {
                    formResult.style.display = 'block';
                    formResult.style.color = '#ef4444';
                    formResult.innerHTML = jsonResponse.message || 'Something went wrong!';
                }
            })
            .catch(error => {
                formResult.style.display = 'block';
                formResult.style.color = '#ef4444';
                formResult.innerHTML = 'Please check your internet connection!';
            })
            .finally(() => {
                contactForm.reset();
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formResult.style.display = 'none';
                }, 5000);
            });
        });
    }
});
