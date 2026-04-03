document.addEventListener('DOMContentLoaded', () => {

    /* --- Custom Cursor Logic (Awwwards Style) --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        // Only show if not on purely touch devices
        if (window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            });

            const interactables = document.querySelectorAll('a, button, input, textarea');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.15)';
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        } else {
            // Hide custom cursor on mobile
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        }
    }

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

    /* --- CV Download Handling --- */
    const downloadCvBtn = document.getElementById('downloadCvBtn');
    const cvDownloadStatus = document.getElementById('cv-download-status');

    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const cvFilePath = 'cv.pdf';

            const triggerDownload = () => {
                const tempLink = document.createElement('a');
                tempLink.href = cvFilePath;
                tempLink.setAttribute('download', 'Deshan_Shavinda_CV.pdf');
                document.body.appendChild(tempLink);
                tempLink.click();
                tempLink.remove();
            };

            if (cvDownloadStatus) {
                cvDownloadStatus.style.display = 'none';
                cvDownloadStatus.textContent = '';
            }

            // On file:// pages, fetch/HEAD is blocked, so directly trigger browser download.
            if (window.location.protocol === 'file:') {
                triggerDownload();

                if (cvDownloadStatus) {
                    cvDownloadStatus.style.display = 'block';
                    cvDownloadStatus.style.color = '#86efac';
                    cvDownloadStatus.textContent = 'Download request eka yawuwa. Cv file eka project folder eke cv.pdf widiyata thiyenna ona.';
                }
                return;
            }

            try {
                const response = await fetch(cvFilePath, { method: 'HEAD' });

                if (!response.ok) {
                    throw new Error('CV file not found');
                }

                triggerDownload();

                if (cvDownloadStatus) {
                    cvDownloadStatus.style.display = 'block';
                    cvDownloadStatus.style.color = '#86efac';
                    cvDownloadStatus.textContent = 'CV download started.';
                }
            } catch (error) {
                if (cvDownloadStatus) {
                    cvDownloadStatus.style.display = 'block';
                    cvDownloadStatus.style.color = '#fca5a5';
                    cvDownloadStatus.textContent = 'cv.pdf file eka hoyaganna ba. Project folder eke cv.pdf file eka add karanna.';
                }
            }
        });
    }

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
            
            // Re-formatting data nicely for the Web3Forms email (Using emojis and nice labels instead of HTML)
            const object = {
                access_key: formData.get('access_key'),
                subject: `🌟 New Inquiry from ${formData.get('name')}`,
                from_name: "Portfolio Notification App",
                replyto: formData.get('email'), // This allows you to just click "Reply" to the email in your app
                "👤 Client Name": formData.get('name'),
                "📧 Client Email": formData.get('email'),
                "📅 Date & Time": new Date().toLocaleString(),
                "💬 Message Content": `\n${formData.get('message')}\n\n-------------------------\nSent securely via your portfolio website.`
            };
            
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
                    formResult.innerHTML = 'Message sent successfully! I will get back to you soon.';
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

    /* --- Bot Logic --- */
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotReset = document.getElementById('chatbotReset');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hidden-bot');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('hidden-bot');
        });

        if (chatbotReset) {
            chatbotReset.addEventListener('click', () => {
                // Remove dynamic messages, keeping only initial greeting and quick replies
                const elements = Array.from(chatMessages.children);
                for (let i = 2; i < elements.length; i++) {
                    elements[i].remove();
                }
                
                // Show quick replies again
                const qr = chatMessages.querySelector('.quick-replies');
                if (qr) qr.style.display = 'flex';
                
                chatInput.value = '';
                chatMessages.scrollTop = 0;
            });
        }

        // Bot Responses Logic
        const botResponses = {
            "hello": "Hello there! 👋 How can I assist you?",
            "hi": "Hi! Welcome to Deshan's portfolio. What would you like to know?",
            "skills": "Deshan is highly skilled in HTML5, CSS3, JavaScript (ES6+), and UI/UX Designing. He builds awesome stuff! 💻",
            "contact": "You can contact Deshan via email at deshansr2002@gmail.com or call him at +94 703115990. Also, check out the contact section below! 📞",
            "project": "Deshan has completed 50+ projects, from E-commerce storefronts to creative portfolios. Check out the 'Featured Work' section! 🚀",
            "default": "Hmm, I am not sure about that. 😅 Try asking about 'skills', 'contact', or 'projects', or just drop a message in the contact form!"
        };

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message');
            msgDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
            msgDiv.innerHTML = `<p>${text}</p>`;
            
            // Remove quick replies if user sends a message
            if (sender === 'user') {
                const qr = chatMessages.querySelector('.quick-replies');
                if (qr) qr.style.display = 'none';
            }

            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleUserMessage(msg) {
            if (!msg.trim()) return;
            
            addMessage(msg, 'user');
            chatInput.value = '';

            // Simulate typing delay
            setTimeout(() => {
                let response = botResponses['default'];
                let lowerMsg = msg.toLowerCase();
                
                if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) response = botResponses['hello'];
                else if (lowerMsg.includes('skill')) response = botResponses['skills'];
                else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('number')) response = botResponses['contact'];
                else if (lowerMsg.includes('project') || lowerMsg.includes('work')) response = botResponses['project'];

                addMessage(response, 'bot');
            }, 800);
        }

        chatSendBtn.addEventListener('click', () => {
            handleUserMessage(chatInput.value);
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage(chatInput.value);
            }
        });

        // Quick replies handler
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const replyType = e.target.getAttribute('data-reply');
                let userText = e.target.innerText;
                addMessage(userText, 'user');
                
                setTimeout(() => {
                    addMessage(botResponses[replyType], 'bot');
                }, 800);
            });
        });
    }
});
