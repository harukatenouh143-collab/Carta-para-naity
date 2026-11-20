document.addEventListener('DOMContentLoaded', () => {
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const cardContainer = document.getElementById('cardContainer');
  const bgMusic = document.getElementById('bgMusic');

  if (envelopeWrapper && cardContainer) {
    envelopeWrapper.addEventListener('click', () => {
      envelopeWrapper.classList.add('open');

      window.setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        cardContainer.classList.remove('hidden');

        if (bgMusic) {
          bgMusic.play().catch(() => {
            console.log('La reproducción automática fue bloqueada por el navegador');
          });
        }
      }, 600);
    });
  }

  const btnSurprise = document.getElementById('btnSurprise');
  if (btnSurprise) {
    btnSurprise.addEventListener('click', () => {
      createBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
    });
  }

  const photoModal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeModal = document.getElementById('closeModal');

  const openModal = (src, caption) => {
    if (!photoModal || !modalImg || !modalCaption) return;
    modalImg.src = src;
    modalCaption.textContent = caption;
    photoModal.classList.remove('hidden');
  };

  document.querySelectorAll('.photo-card').forEach((card) => {
    const openFromCard = () => openModal(card.dataset.src, card.dataset.caption);
    card.addEventListener('click', openFromCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFromCard();
      }
    });
  });

  const closePhotoModal = () => {
    if (photoModal) photoModal.classList.add('hidden');
  };

  if (closeModal) closeModal.addEventListener('click', closePhotoModal);
  if (photoModal) {
    photoModal.addEventListener('click', (event) => {
      if (event.target === photoModal) closePhotoModal();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePhotoModal();
  });

  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const resizeCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor(x, y, speedY) {
      this.x = x ?? Math.random() * width;
      this.y = y ?? height + Math.random() * 20;
      this.size = Math.random() * 8 + 4;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = speedY ?? -(Math.random() * 1.5 + 0.5);
      this.opacity = Math.random() * 0.7 + 0.3;
      this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 100)}, 150, ${this.opacity})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(this.x, this.y + topCurveHeight);
      ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
      ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
      ctx.bezierCurveTo(this.x, this.y + this.size, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
      ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 45 }, () => new Particle());

  function createBurst(x, y, amount) {
    for (let i = 0; i < amount; i++) {
      const particle = new Particle(x, y, Math.random() * -4 - 1);
      particle.speedX = (Math.random() - 0.5) * 6;
      particles.push(particle);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.update();
      particle.draw();

      if (particle.y < -20 && particles.length > 50) {
        particles.splice(i, 1);
      }
    }

    window.requestAnimationFrame(animate);
  }

  animate();
});
