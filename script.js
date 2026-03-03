/* ── Cursor ── */
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cd.style.left = mx + 'px';
  cd.style.top  = my + 'px';
});

(function loop() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  cr.style.left = rx + 'px';
  cr.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a,button,.sk-card,.proj-card,.explore-trigger,.acard,.about-intro-card,.hobby-item,.stag,.soc-btn,.btn-cv,.stat-box').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ── Particles ── */
const pw = document.getElementById('ptcls');
for (let i = 0; i < 50; i++) {
  const d = document.createElement('div');
  d.className = 'ptcl';
  d.style.cssText = `
    left:${Math.random() * 100}%;
    top:${Math.random() * 100}%;
    width:${1 + Math.random() * 3}px;
    height:${1 + Math.random() * 3}px;
    animation-delay:${Math.random() * 5}s;
    animation-duration:${2 + Math.random() * 4}s;
    opacity:${.05 + Math.random() * .3}
  `;
  pw.appendChild(d);
}

/* ── Typed text ── */
const roles = ['Frontend Developer', 'IT Student', 'CSS Enthusiast', 'Creative Coder', 'Web Designer'];
let ri = 0, ci = 0, del = false;
const te = document.getElementById('ttxt');

function typeLoop() {
  const cur = roles[ri];
  if (del) {
    te.textContent = cur.substring(0, ci--);
  } else {
    te.textContent = cur.substring(0, ci++);
  }
  if (!del && ci === cur.length + 1) {
    setTimeout(() => { del = true; typeLoop(); }, 2200);
    return;
  }
  if (del && ci === 0) {
    del = false;
    ri = (ri + 1) % roles.length;
  }
  setTimeout(typeLoop, del ? 55 : 85);
}
setTimeout(typeLoop, 1200);

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(x => { if (x.isIntersecting) x.target.classList.add('v'); });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── Skill bars + rings ── */
const skObs = new IntersectionObserver(entries => {
  entries.forEach(x => {
    if (!x.isIntersecting) return;
    x.target.querySelectorAll('.sk-bar-fill').forEach(b => {
      b.style.width = b.dataset.w + '%';
    });
    x.target.querySelectorAll('.sk-ring-fill').forEach(ring => {
      const pct = parseInt(ring.dataset.pct);
      const circumference = 2 * Math.PI * 18;
      ring.style.strokeDasharray  = circumference;
      ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;
    });
  });
}, { threshold: .3 });
document.querySelectorAll('.sk-card').forEach(el => skObs.observe(el));

/* ── Nav active highlight ── */
document.querySelectorAll('section[id]').forEach(sec => {
  new IntersectionObserver(entries => {
    entries.forEach(x => {
      if (x.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${x.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: .4 }).observe(sec);
});

/* ── Lab Modal ── */
function closeLabModal(e) {
  if (e.target === document.getElementById('labModal'))
    document.getElementById('labModal').classList.remove('open');
}

/* ── Quiz ── */
const questions = [
  { cat:'JavaScript', q:'What does "typeof null" return in JavaScript?',               opts:['null','object','undefined','boolean'],                                                      ans:1 },
  { cat:'JavaScript', q:'Which method adds an element to the END of an array?',        opts:['push()','pop()','shift()','unshift()'],                                                    ans:0 },
  { cat:'CSS',        q:'Which CSS property controls the spacing between lines?',      opts:['letter-spacing','word-spacing','line-height','text-indent'],                              ans:2 },
  { cat:'CSS',        q:'What does "display: flex" enable?',                           opts:['Hides the element','Creates a block container','Flexbox layout','Makes it inline-block'], ans:2 },
  { cat:'JavaScript', q:'What is the correct way to declare a constant?',              opts:['var x = 5','let x = 5','const x = 5','constant x = 5'],                                  ans:2 },
  { cat:'CSS',        q:'Which CSS selector targets elements with a specific class?',  opts:['#className','.className','className','*className'],                                       ans:1 },
  { cat:'Programming',q:'What is the result of: 5 + "5" in JavaScript?',              opts:['"55"','10','55','Error'],                                                                  ans:0 },
  { cat:'Programming',q:'What is a "for loop" primarily used for?',                   opts:['Declaring functions','Repeating code a set number of times','Catching errors','Styling elements'], ans:1 },
  { cat:'CSS',        q:'Which property makes an element invisible but keeps space?',  opts:['display:none','visibility:hidden','opacity:0','hidden:true'],                             ans:1 },
  { cat:'JavaScript', q:'Which method removes the LAST element of an array?',         opts:['push()','pop()','shift()','splice()'],                                                     ans:1 },
];

let qIdx = 0, score = 0;

function openQuiz() {
  document.getElementById('quizModal').classList.add('open');
  document.getElementById('startScreen').style.display    = 'block';
  document.getElementById('questionScreen').style.display = 'none';
  document.getElementById('resultScreen').style.display   = 'none';
}

function closeQuiz() {
  document.getElementById('quizModal').classList.remove('open');
}

function startQuiz() {
  qIdx = 0; score = 0;
  document.getElementById('startScreen').style.display    = 'none';
  document.getElementById('resultScreen').style.display   = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  renderQ();
}

function renderQ() {
  const q = questions[qIdx];
  document.getElementById('progressBar').style.width    = ((qIdx + 1) / questions.length * 100) + '%';
  document.getElementById('quizCounter').textContent    = `Question ${qIdx + 1} of ${questions.length}`;
  document.getElementById('quizCategory').textContent   = q.cat;
  document.getElementById('quizQuestion').textContent   = q.q;
  const wrap = document.getElementById('quizOptions');
  wrap.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => answerQ(i, btn));
    wrap.appendChild(btn);
  });
}

function answerQ(i, btn) {
  const q = questions[qIdx];
  document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
  if (i === q.ans) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.quiz-opt')[q.ans].classList.add('correct');
  }
  setTimeout(() => {
    qIdx++;
    if (qIdx < questions.length) { renderQ(); } else { showResult(); }
  }, 900);
}

function showResult() {
  document.getElementById('questionScreen').style.display = 'none';
  document.getElementById('resultScreen').style.display   = 'block';
  const pct   = score / questions.length;
  const emoji = pct === 1 ? '🏆' : pct >= .7 ? '🎉' : pct >= .4 ? '💪' : '📚';
  const title = pct === 1 ? 'Perfect Score!' : pct >= .7 ? 'Great Job!' : pct >= .4 ? 'Good Effort!' : 'Keep Studying!';
  const msg   = pct === 1 ? 'You nailed every single question!' : pct >= .7 ? 'You really know your web dev!' : pct >= .4 ? "Keep practicing, you're improving!" : "Review the concepts and try again!";
  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultScore').textContent = `${score} / ${questions.length}`;
  document.getElementById('resultMsg').textContent   = msg;
  setTimeout(() => document.getElementById('resultBar').style.width = (pct * 100) + '%', 200);
}

function restartQuiz() { startQuiz(); }