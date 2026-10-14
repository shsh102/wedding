const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

document.querySelectorAll('.heart').forEach((button) => {
  button.addEventListener('click', () => {
    const active = button.classList.toggle('is-active');
    button.setAttribute('aria-label', active ? '찜 해제하기' : '찜하기');
    showToast(active ? '저장 목록에 추가했어요' : '저장 목록에서 삭제했어요');
  });
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('is-active');
  });
});

document.querySelectorAll('.comparison-tabs button').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.comparison-tabs button').forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});

document.querySelectorAll('.sdm-tabs button').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sdm-tabs button').forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});

const shell = document.querySelector('.phone-shell');
const onboardingSteps = {
  a: ['splash', 'start', 'a-vibe', 'a-space', 'guest', 'budget', 'complete'],
  b: ['splash', 'start', 'b-region', 'b-date', 'guest', 'budget', 'complete'],
};
let onboardingBranch = 'a';
let onboardingIndex = 0;
let splashTimer;
let splashTransitionTimer;
let onboardingEnterTimer;

function currentOnboardingPath() {
  return onboardingSteps[onboardingBranch];
}

function showOnboardingStep(index) {
  const path = currentOnboardingPath();
  onboardingIndex = Math.max(0, Math.min(index, path.length - 1));
  const currentStep = path[onboardingIndex];
  clearTimeout(splashTimer);
  clearTimeout(splashTransitionTimer);
  clearTimeout(onboardingEnterTimer);
  shell?.classList.remove('is-splash-leaving');

  document.querySelectorAll('.onboarding-step').forEach((step) => {
    step.classList.toggle('is-active', step.dataset.step === currentStep);
  });
  shell?.classList.toggle('is-splash', currentStep === 'splash');

  const progress = document.querySelector('.onboarding-progress span');
  if (progress) {
    const questionTotal = path.length - 1;
    const questionIndex = Math.max(1, onboardingIndex);
    progress.style.width = `${(questionIndex / questionTotal) * 100}%`;
  }

  const back = document.querySelector('.onboarding-back');
  back?.classList.toggle('is-visible', onboardingIndex > 1);

  const next = document.querySelector('.onboarding-next');
  if (next) next.textContent = currentStep === 'complete' ? '추천 후보 보기' : '다음';

  const helper = document.querySelector('.onboarding-footer p');
  if (helper) helper.textContent = currentStep === 'start' || currentStep === 'complete' ? '나중에 변경할 수 있어요.' : '선택한 기준은 나중에 변경할 수 있어요.';

  if (currentStep === 'splash') {
    splashTimer = setTimeout(() => {
      shell?.classList.add('is-splash-leaving');
      splashTransitionTimer = setTimeout(() => {
        showOnboardingStep(1);
        shell?.classList.add('is-entering-onboarding');
        onboardingEnterTimer = setTimeout(() => {
          shell?.classList.remove('is-entering-onboarding');
        }, 420);
      }, 320);
    }, 2300);
  }
}

function completeOnboarding() {
  shell?.classList.remove('is-onboarding');
  shell?.classList.remove('is-splash');
  shell?.classList.remove('is-splash-leaving');
  shell?.classList.remove('is-entering-onboarding');
  showPage('home');
  document.querySelectorAll('.bottom-nav button').forEach((item) => item.classList.remove('is-active'));
  document.querySelector('.bottom-nav button[data-page-target="home"]')?.classList.add('is-active');
}

function openOnboarding() {
  onboardingBranch = 'a';
  onboardingIndex = 0;
  document.querySelectorAll('.onboarding-choice[data-branch]').forEach((item) => item.classList.remove('is-selected'));
  document.querySelector('.onboarding-choice[data-branch="a"]')?.classList.add('is-selected');
  shell?.classList.add('is-onboarding');
  showOnboardingStep(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.onboarding-choice[data-branch]').forEach((choice) => {
  choice.addEventListener('click', () => {
    onboardingBranch = choice.dataset.branch || 'a';
    document.querySelectorAll('.onboarding-choice[data-branch]').forEach((item) => item.classList.remove('is-selected'));
    choice.classList.add('is-selected');
    showOnboardingStep(onboardingIndex);
  });
});

document.querySelectorAll('.onboarding-options button:not([data-branch]), .visual-options button, .chip-grid button').forEach((choice) => {
  choice.addEventListener('click', () => {
    const group = choice.parentElement;
    const maxSelect = Number(group?.dataset.maxSelect || 1);
    if (maxSelect > 1) {
      const selectedItems = Array.from(group?.querySelectorAll('button.is-selected') || []);
      if (choice.classList.contains('is-selected')) {
        choice.classList.remove('is-selected');
      } else {
        if (selectedItems.length >= maxSelect) selectedItems[0]?.classList.remove('is-selected');
        choice.classList.add('is-selected');
      }
      return;
    }
    group?.querySelectorAll('button').forEach((item) => item.classList.remove('is-selected'));
    choice.classList.add('is-selected');
  });
});

document.querySelector('.onboarding-next')?.addEventListener('click', () => {
  const path = currentOnboardingPath();
  clearTimeout(splashTimer);
  if (onboardingIndex >= path.length - 1) {
    completeOnboarding();
  } else {
    showOnboardingStep(onboardingIndex + 1);
  }
});

document.querySelector('.onboarding-back')?.addEventListener('click', () => {
  clearTimeout(splashTimer);
  showOnboardingStep(onboardingIndex - 1);
});

function showPage(pageName) {
  document.querySelectorAll('.page-view').forEach((page) => {
    page.classList.toggle('is-active', page.dataset.page === pageName);
  });
  const titles = { home: 'WEDDING', sdm: '스드메', guide: '가이드' };
  document.querySelector('.app-title').textContent = titles[pageName] || 'WEDDING';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function moveToSection(target) {
  showPage('home');
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const activeNav = document.querySelector(`.bottom-nav button[data-target="${target}"]`);
  if (activeNav) {
    document.querySelectorAll('.bottom-nav button').forEach((item) => item.classList.remove('is-active'));
    activeNav.classList.add('is-active');
  }
}

document.querySelectorAll('.bottom-nav button').forEach((button) => {
  button.addEventListener('click', () => {
    const pageTarget = button.dataset.pageTarget;
    const target = button.dataset.target;
    if (target) {
      moveToSection(target);
    } else if (pageTarget) {
      showPage(pageTarget);
      document.querySelectorAll('.bottom-nav button').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
    }
  });
});

document.querySelector('[data-open-onboarding]')?.addEventListener('click', () => {
  openOnboarding();
});

document.querySelector('[data-open-guide]')?.addEventListener('click', () => {
  showPage('guide');
  document.querySelectorAll('.bottom-nav button').forEach((item) => item.classList.remove('is-active'));
});

document.querySelectorAll('.quick-pill[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    moveToSection(button.dataset.target);
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

window.addEventListener('DOMContentLoaded', () => {
  showOnboardingStep(0);
  if (window.lucide) window.lucide.createIcons();
});
