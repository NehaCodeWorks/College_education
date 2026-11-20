document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dark / light toggle ---------- */
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeBtn.querySelector('i');
    icon.className = document.body.classList.contains('dark')
      ? 'bi bi-moon-stars'
      : 'bi bi-brightness-high';
  });

  /* ---------- Hero tabs (change placeholder) ---------- */
  const tabs = document.querySelectorAll('.hero-tab');
  const input = document.getElementById('heroInput');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      input.placeholder = tab.dataset.placeholder;
      input.value = '';
      filterColleges('');
      // streams + college list only make sense for Colleges tab
      const isCollege = tab.dataset.type === 'colleges';
      document.getElementById('streamSection').style.display = isCollege ? '' : 'none';
      document.querySelector('.dd-featured').style.display = isCollege ? '' : 'none';
      input.focus();
    });
  });

  /* ---------- Search dropdown ---------- */
  const wrap = document.getElementById('searchWrap');
  const dropdown = document.getElementById('searchDropdown');
  const items = document.querySelectorAll('#collegeList li');

  input.addEventListener('focus', () => dropdown.classList.add('show'));

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) dropdown.classList.remove('show');
  });

  function filterColleges(q) {
    q = q.trim().toLowerCase();
    items.forEach(li => {
      li.classList.toggle('hide', q && !li.dataset.name.toLowerCase().includes(q));
    });
  }
  input.addEventListener('input', () => filterColleges(input.value));

  // clicking a college fills the input
  items.forEach(li => {
    li.addEventListener('click', () => {
      input.value = li.dataset.name;
      dropdown.classList.remove('show');
    });
  });

  /* ---------- Hero slider (dots + 1 / 3) ---------- */
  const dots = document.querySelectorAll('.dot');
  const count = document.getElementById('slideCount');
  const bg = document.getElementById('heroBg');
  const images = ['img/hero/hero-1.jpg', 'img/hero/hero-2.jpg', 'img/hero/hero-3.jpg'];
  let current = 0;

  function showSlide(i) {
    current = i;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    count.textContent = (i + 1) + ' / ' + dots.length;
    bg.style.backgroundImage = `url('${images[i]}')`;
  }

  dots.forEach((d, i) => d.addEventListener('click', () => { showSlide(i); restart(); }));

  let timer = setInterval(() => showSlide((current + 1) % dots.length), 5000);
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => showSlide((current + 1) % dots.length), 5000);
  }
});



/* =====================================================
   COLLEGE CARDS + PAGINATION
   Naya college add karna ho to bas neeche array mein
   ek object aur daal do - pages apne aap badh jayenge.
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const PER_PAGE = 6;   // 3 column x 2 row

  const colleges = [
    { short: 'IITTP',  name: 'IIT Tirupati',                         city: 'Tirupati, Andhra Pradesh',     est: 2015, score: 8.4, rating: 4.3, reviews: 545, course: 'B.Tech CS',              fees: '₹3.95 Lacs',  nirf: 71,  cutoff: 26322 },
    { short: 'NITAP',  name: 'NIT Andhra Pradesh',                   city: 'Tadepalligudem, Andhra Pradesh', est: 2015, score: 8.1, rating: 3.6, reviews: 183, course: 'B.Tech CS',            fees: '₹6.41 Lacs',  nirf: 93,  cutoff: 54686 },
    { short: 'AITM',   name: 'Aditya Institute of Technology and Management', city: 'Tekkali, Andhra Pradesh', est: 2001, score: 7.2, rating: 3.4, reviews: 22,  course: 'Diploma in Engineering', fees: '₹10.27 Lacs', nirf: 242, cutoff: 85034 },
    { short: 'AUCE',   name: 'Andhra University College of Engineering', city: 'Visakhapatnam, Andhra Pradesh', est: 1955, score: 7.3, rating: 3.4, reviews: 90, course: 'B.Tech CS',        fees: '₹15.42 Lacs', nirf: 339, cutoff: 66845 }
  ];

  // demo ke liye 60 aur cards bana rahe hain (pagination test karne ke liye).
  // Real data daalne ke baad ye block delete kar dena.
  const base = colleges.slice();
  for (let i = 0; i < 14; i++) {
    const b = base[i % base.length];
    colleges.push({ ...b, name: b.name + ' ' + (i + 2), reviews: b.reviews + i });
  }

  const grid     = document.getElementById('collegeGrid');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const curEl    = document.getElementById('curPage');
  const totalEl  = document.getElementById('totalPages');
  let page = 1;

  function stars(r) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += i <= Math.round(r)
        ? '<i class="bi bi-star-fill"></i>'
        : '<i class="bi bi-star-fill off"></i>';
    }
    return html;
  }

  function cardHTML(c) {
    return `
      <div class="col-lg-4 col-md-6">
        <div class="college-card">
          <div class="cc-top">
        
            <div class="cc-score"><em>CB</em> ${c.score}/10</div>
            <div class="cc-logo">${c.short}</div>
            <div class="cc-info">
              <div class="cc-name" title="${c.name}">${c.name}</div>
              <div class="cc-loc"><i class="bi bi-geo-alt-fill"></i>${c.city} • Est. ${c.est}</div>
            </div>
          </div>

          <div class="cc-body">
            <div class="cc-rating">
              <span class="stars">${stars(c.rating)}</span>
              <span>${c.rating}/5</span>
              <span class="rv">${c.reviews} reviews</span>
            </div>
            <div class="cc-course">${c.course}</div>
            <div class="cc-fees"><i class="bi bi-cash-stack"></i>${c.fees} Total Fees</div>
            <div class="cc-nirf"><i class="bi bi-trophy-fill"></i>#${c.nirf} NIRF Engineering 2025</div>
            <div class="cc-cutoff"><i class="bi bi-bullseye"></i>JEE Main Cutoff ${c.cutoff}</div>
          </div>

          <div class="cc-foot">
            <a href="#" class="cc-courses">View All Courses &amp; Fees <i class="bi bi-chevron-right"></i></a>
            <a href="#" class="cc-apply">Apply Now / Download Brochure</a>
          </div>
        </div>
      </div>`;
  }

  function render() {
    const totalPages = Math.max(1, Math.ceil(colleges.length / PER_PAGE));
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * PER_PAGE;
    grid.innerHTML = colleges.slice(start, start + PER_PAGE).map(cardHTML).join('');

    curEl.textContent = page;
    totalEl.textContent = totalPages;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
  }

  prevBtn.addEventListener('click', () => {
    if (page > 1) { page--; render(); scrollToCards(); }
  });
  nextBtn.addEventListener('click', () => {
    page++; render(); scrollToCards();
  });

  // function scrollToCards() {
  //   document.querySelector('.colleges-section').scrollIntoView({ behavior: 'smooth' });
  // }
  function scrollToCards() {
  // sticky header ki height minus karte hain taaki cards header ke neeche na chhupein
  const header = document.querySelector('.site-header');
  const top = grid.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 20;
  window.scrollTo({ top: top, behavior: 'smooth' });
}

  render();
});

/* =====================================================
   TOP 10 COLLEGES - filter tabs
   Kisi tab ke colleges add karne ho to uske [] mein
   neeche wale format mein object daalo.
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const topData = {
    btech: [
      { short: 'IITD',   name: 'IIT Delhi - Indian Institute of Technology [IITD]',        loc: 'New Delhi, Delhi NCR',  rating: 5,   ranking: '#1 NIRF Engineering 2025',          cutoff: 'JEE-Advanced Cut off 403',  deadline: '2 Jun - 11 Jun 2026',     fees: '₹11.74 Lacs' },
      { short: 'IITB',   name: 'IIT Bombay - Indian Institute of Technology [IITB]',       loc: 'Mumbai, Maharashtra',   rating: 4.9, ranking: '#2 NIRF Engineering 2025',          cutoff: 'JEE-Advanced Cut off 67',   deadline: '2 Jun - 11 Jun 2026',     fees: '₹11.95 Lacs' },
      { short: 'IITM',   name: 'IIT Madras - Indian Institute of Technology [IITM]',       loc: 'Chennai, Tamil Nadu',   rating: 4.9, ranking: '#1 Overall NIRF 2025',              cutoff: 'JEE-Advanced Cut off 226',  deadline: '2 Jun - 11 Jun 2026',     fees: '₹10.70 Lacs' },
      { short: 'IITK',   name: 'IIT Kanpur - Indian Institute of Technology [IITK]',       loc: 'Kanpur, Uttar Pradesh', rating: 4.9, ranking: '#4 NIRF Engineering 2025',          cutoff: 'JEE-Advanced Cut off 1134', deadline: '2 Jun - 11 Jun 2026',     fees: '₹9.18 Lacs'  },
      { short: 'IITKGP', name: 'IIT Kharagpur - Indian Institute of Technology [IITKGP]', loc: 'Kharagpur, West Bengal', rating: 4.9, ranking: '#5 NIRF Engineering 2025',         cutoff: 'JEE-Advanced Cut off 1043', deadline: '2 Jun - 11 Jun 2026',     fees: '₹11.80 Lacs' },
      { short: 'BITS',   name: 'BITS Pilani',                                              loc: 'Pilani, Rajasthan',     rating: 4.9, ranking: '#1 Private Engineering 2025',       cutoff: 'BITSAT Score 320+',         deadline: '15 Dec - 02 May 2026',    fees: '₹25.29 Lacs' }
    ],
    mba:  [],   // apne colleges yahan add karo
    bcom: [],
    bsc:  [],
    ba:   [],
    bba:  [],
    bca:  []
  };

  const body = document.getElementById('topBody');
  const tabs = document.querySelectorAll('.top-tab');

  function stars(r) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<i class="bi bi-star-fill ${i <= Math.round(r) ? '' : 'off'}"></i>`;
    }
    return html;
  }

  function rowHTML(c, i) {
    return `
      <tr>
        <td class="t-rank">#${i + 1}</td>
        <td>
          <div class="t-college">
            <div class="t-logo">${c.short}</div>
            <div>
              <div class="t-name">${c.name}</div>
              <div class="t-loc">${c.loc}</div>
              <div class="t-stars">${stars(c.rating)}<span>${c.rating}/5</span></div>
            </div>
          </div>
        </td>
        <td><div class="t-ranking"><span class="t-cb">CB</span><span>${c.ranking}</span></div></td>
        <td class="t-cutoff">${c.cutoff}</td>
        <td class="t-deadline">${c.deadline}</td>
        <td class="t-fees">${c.fees}</td>
      </tr>`;
  }

  function showCourse(course) {
    const list = topData[course] || [];
    body.innerHTML = list.length
      ? list.map(rowHTML).join('')
      : '<tr><td colspan="6" class="t-empty">The colleges for this course have not been added yet.</td></tr>';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showCourse(tab.dataset.course);
    });
  });

  showCourse('btech');   // page load par B.Tech dikhao
});

/* ---------- Newsletter form validation ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('nlForm');
  const email  = document.getElementById('nlEmail');
  const mobile = document.getElementById('nlMobile');
  const course = document.getElementById('nlCourse');
  const msg    = document.getElementById('nlMsg');

  // mobile mein sirf numbers allow
  mobile.addEventListener('input', () => {
    mobile.value = mobile.value.replace(/\D/g, '');
  });

  function show(text, type) {
    msg.textContent = text;
    msg.className = 'nl-msg ' + type;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
      return show('Please enter a valid email id.', 'error');

    if (!/^[6-9]\d{9}$/.test(mobile.value))
      return show('Please enter a valid 10 digit mobile number.', 'error');

    if (!course.value)
      return show('Please choose your course.', 'error');

    show('Thank you! You have subscribed successfully.', 'success');
    form.reset();
  });
});