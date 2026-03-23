const v1 = document.getElementById('video1');
const v2 = document.getElementById('video2');
const soundBtn = document.getElementById('soundBtn');
const shutterTop = document.getElementById('shutterTop');
const shutterBottom = document.getElementById('shutterBottom');
const contactBtn = document.getElementById('contactBtn');
const closeContact = document.getElementById('closeContact');
const contactModal = document.getElementById('contactModal');
const mobileHeadline = document.querySelector('.mobile-copy .headline');
const mobileSubline = document.querySelector('.mobile-copy .subline');
const desktopHeadline = document.querySelector('.desktop-headline');
const desktopSubline = document.querySelector('.desktop-subline');

v1.src = 'videos/intro-01.mp4';
v2.src = 'videos/intro-02.mp4';
let muted = true;
let phase = 1;

function setMuted(next){
  muted = next;
  v1.muted = muted;
  v2.muted = muted;
  soundBtn.textContent = muted ? 'Sound off' : 'Sound on';
}
setMuted(true);

function showVideo(n){
  phase = n;
  v1.classList.toggle('is-active', n === 1);
  v2.classList.toggle('is-active', n === 2);
}

function play1(){ showVideo(1); v1.currentTime = 0; v1.play().catch(()=>{}); }
function play2(){ showVideo(2); v2.currentTime = 0; v2.play().catch(()=>{}); }

v1.addEventListener('ended', play2);
v2.addEventListener('ended', play1);

window.addEventListener('load', () => {
  setTimeout(() => {
    shutterTop.classList.add('open');
    shutterBottom.classList.add('open');
  }, 250);
  setTimeout(() => {
    play1();
    mobileHeadline.classList.add('visible');
    setTimeout(() => mobileSubline.classList.add('visible'), 900);
  }, 1550);
});

soundBtn.addEventListener('click', () => setMuted(!muted));
contactBtn.addEventListener('click', () => contactModal.classList.add('open'));
closeContact.addEventListener('click', () => contactModal.classList.remove('open'));
contactModal.addEventListener('click', (e) => { if (e.target === contactModal) contactModal.classList.remove('open'); });

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target === desktopHeadline) {
      desktopHeadline.classList.toggle('visible', entry.isIntersecting);
    }
    if (entry.target === desktopSubline) {
      desktopSubline.classList.toggle('visible', entry.isIntersecting);
    }
  });
}, { threshold: 0.28 });

io.observe(desktopHeadline);
io.observe(desktopSubline);
