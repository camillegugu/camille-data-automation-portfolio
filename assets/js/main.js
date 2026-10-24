(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
      themeButton.title = `Switch to ${next} theme`;
      themeButton.querySelector('.theme-text').textContent = next === 'light' ? 'Light' : 'Dark';
      themeButton.querySelector('.theme-icon').textContent = next === 'light' ? '☼' : '☾';
    }
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#10151e' : '#f2f5f8';
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('camille-portfolio-theme'); } catch (_) { /* Storage may be unavailable in private contexts. */ }
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('camille-portfolio-theme', next); } catch (_) { /* The toggle still works for this page view. */ }
  });

  if (menuButton && navigation) {
    const closeMenu = (returnFocus = false) => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      if (returnFocus) menuButton.focus();
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const cards = [...document.querySelectorAll('.project-card')];
  const filters = [...document.querySelectorAll('.filter-button')];
  const count = document.querySelector('.filter-count');
  filters.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visible = 0;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}`;
  }));

  const periodButton = document.querySelector('.period-toggle');
  const cohorts = [
    { name: 'COHORT', employed: 72, response: 64, study: 18, seeking: 10 },
    { name: 'SAMPLE B', employed: 61, response: 78, study: 24, seeking: 15 }
  ];
  let cohortIndex = 0;
  periodButton?.addEventListener('click', () => {
    cohortIndex = (cohortIndex + 1) % cohorts.length;
    const cohort = cohorts[cohortIndex];
    periodButton.dataset.period = cohortIndex ? 'sample-b' : 'cohort';
    periodButton.innerHTML = `${cohort.name} <span aria-hidden="true">⌄</span>`;
    periodButton.setAttribute('aria-label', `Sample dashboard period: ${cohort.name}. Activate to change period.`);
    document.querySelector('[data-kpi="employed"]').textContent = `${cohort.employed}%`;
    document.querySelector('[data-kpi="response"]').textContent = `${cohort.response}%`;
    ['employed', 'study', 'seeking'].forEach((key) => {
      document.querySelector(`[data-bar="${key}"]`).style.setProperty('--bar', `${cohort[key]}%`);
      document.querySelector(`[data-bar-label="${key}"]`).textContent = `${cohort[key]}%`;
    });
  });

  const workflowStages = [
    { kicker: 'STAGE 01 / DISCOVERY', title: 'Understand the work as it happens.', copy: 'Start with the people, steps, and handoffs involved. Where does information arrive, and where does the work slow down?' },
    { kicker: 'STAGE 02 / STRUCTURE', title: 'Make information easier to use.', copy: 'Clarify what needs to be captured and how it should be organized. A consistent structure supports useful reporting and follow-through.' },
    { kicker: 'STAGE 03 / IMPROVEMENT', title: 'Automate the repeatable parts.', copy: 'Use practical tools to reduce repetitive effort while keeping decisions visible and the process understandable.' },
    { kicker: 'STAGE 04 / FEEDBACK', title: 'Learn, adjust, and keep improving.', copy: 'Review whether the new approach supports the need. Keep useful changes, refine friction points, and make the next step clear.' }
  ];
  const steps = [...document.querySelectorAll('.workflow-step')];
  steps.forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.step);
    const stage = workflowStages[index];
    if (!stage) return;
    steps.forEach((step) => {
      const active = step === button;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#workflow-kicker').textContent = stage.kicker;
    document.querySelector('#workflow-stage-title').textContent = stage.title;
    document.querySelector('#workflow-stage-copy').textContent = stage.copy;
  }));

  const revealItems = document.querySelectorAll('.project-card, .section-heading, .about-copy, .contact-panel');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((item) => item.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const visual = document.querySelector('.hero-visual');
  if (visual && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('has-pointer');
    visual.addEventListener('pointermove', (event) => {
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty('--px', `${event.clientX - rect.left}px`);
      visual.style.setProperty('--py', `${event.clientY - rect.top}px`);
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--px', '50%');
      visual.style.setProperty('--py', '50%');
    });
  }

  const matchScenario = document.querySelector('#match-scenario');
  const matchResults = {
    multiple: { title: 'Potential match signal', copy: 'Two synthetic reference fields agree. This is a review candidate only; matching rules cannot establish that two records belong to the same person.' },
    partial: { title: 'No strong match signal', copy: 'Only a broad synthetic field agrees. That alone is not enough to flag a likely match; review additional context if appropriate.' },
    incomplete: { title: 'Insufficient information', copy: 'One or more comparison fields are missing. The rule cannot make a useful assessment, so a person must verify the source information.' }
  };
  matchScenario?.addEventListener('change', () => {
    const result = matchResults[matchScenario.value];
    if (!result) return;
    document.querySelector('#match-result-title').textContent = result.title;
    document.querySelector('#match-result-copy').textContent = result.copy;
  });

  const employmentData = {
    a: { name: 'Sample cohort A', known: 45, values: { employed: 32, study: 11, seeking: 2 } },
    b: { name: 'Sample cohort B', known: 58, values: { employed: 36, study: 14, seeking: 8 } }
  };
  const cohortSelect = document.querySelector('#employment-cohort');
  const outcomeSelect = document.querySelector('#employment-outcome');
  const outcomeNames = { employed: 'Employed', study: 'Further study', seeking: 'Seeking work' };
  const rateLabel = document.querySelector('#employment-rate-label');
  const countLabel = document.querySelector('#employment-count-label');
  const rateValue = document.querySelector('#employment-rate');
  const countValue = document.querySelector('#employment-count');
  const updateEmploymentDemo = () => {
    if (!cohortSelect || !outcomeSelect) return;
    const cohort = employmentData[cohortSelect.value];
    if (!cohort) return;
    const selected = outcomeSelect.value;
    const total = cohort.known;
    const pct = (value) => `${(value / total * 100).toFixed(1)}%`;
    Object.entries(cohort.values).forEach(([key, value]) => {
      document.querySelector(`[data-lab-bar="${key}"]`)?.style.setProperty('--bar', pct(value));
      const barValue = document.querySelector(`[data-lab-value="${key}"]`);
      if (barValue) barValue.textContent = `${value} · ${pct(value)}`;
      document.querySelector(`[data-outcome-row="${key}"]`)?.classList.toggle('is-muted', selected !== 'all' && key !== selected);
    });
    const chart = document.querySelector('.lab-chart');
    if (chart) chart.setAttribute('aria-label', `${cohort.name}, synthetic outcomes among ${total} respondents with known employment status`);
    if (selected === 'all') {
      rateLabel.textContent = 'Employment rate';
      countLabel.textContent = 'Employed / known status';
      rateValue.textContent = pct(cohort.values.employed);
      countValue.textContent = `${cohort.values.employed} / ${total}`;
    } else {
      const count = cohort.values[selected];
      rateLabel.textContent = `${outcomeNames[selected]} share`;
      countLabel.textContent = `${outcomeNames[selected]} / known status`;
      rateValue.textContent = pct(count);
      countValue.textContent = `${count} / ${total}`;
    }
    const denominatorNote = document.querySelector('.lab-denominator');
    if (denominatorNote) { const numerator = selected === 'all' ? 'employed' : outcomeNames[selected].toLowerCase(); const value = selected === 'all' ? cohort.values.employed : cohort.values[selected]; denominatorNote.innerHTML = `<strong>Rate denominator:</strong> ${numerator} count ÷ respondents with a known employment status. ${cohort.name}: ${value} ÷ ${total}. Respondents with unknown status are excluded.`; }
  };
  cohortSelect?.addEventListener('change', updateEmploymentDemo);
  outcomeSelect?.addEventListener('change', updateEmploymentDemo);

  const labSteps = [
    { kicker: '01 / INTAKE', title: 'Collect structured inputs', copy: 'Bring approved source information into a consistent working format. Keep sensitive source records in their authorized environment.' },
    { kicker: '02 / NORMALIZE', title: 'Align fields and formats', copy: 'Standardize field formats and document what is missing. Consistent structure makes review easier without changing source meaning.' },
    { kicker: '03 / REVIEW', title: 'Flag possible matches', copy: 'Apply transparent rules to surface candidates for review. A shared field or matching signal is not proof that two records are duplicates.' },
    { kicker: '04 / VERIFY', title: 'Verify and maintain', copy: 'A person checks relevant source context, records the outcome through the proper process, and maintains the approved dataset.' }
  ];
  const previousLabStep = document.querySelector('#lab-step-back');
  const nextLabStep = document.querySelector('#lab-step-next');
  let currentLabStep = 0;
  const renderLabStep = () => {
    const step = labSteps[currentLabStep];
    if (!step) return;
    document.querySelector('#lab-step-count').textContent = `STEP ${currentLabStep + 1} OF ${labSteps.length}`;
    document.querySelector('#lab-step-kicker').textContent = step.kicker;
    document.querySelector('#lab-step-title').textContent = step.title;
    document.querySelector('#lab-step-copy').textContent = step.copy;
    document.querySelector('#lab-progress-fill').style.width = `${(currentLabStep + 1) / labSteps.length * 100}%`;
    previousLabStep.disabled = currentLabStep === 0;
    nextLabStep.disabled = currentLabStep === labSteps.length - 1;
    nextLabStep.textContent = currentLabStep === labSteps.length - 1 ? 'End of workflow' : 'Next step →';
  };
  previousLabStep?.addEventListener('click', () => {
    if (currentLabStep > 0) { currentLabStep--; renderLabStep(); }
  });
  nextLabStep?.addEventListener('click', () => {
    if (currentLabStep < labSteps.length - 1) { currentLabStep++; renderLabStep(); }
  });
  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
