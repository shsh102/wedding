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

document.querySelectorAll('.bottom-nav button').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.bottom-nav button').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
    }
  });
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
});
