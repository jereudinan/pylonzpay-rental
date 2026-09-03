const header = document.querySelector('#header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((other) => {
      if (other !== detail) other.removeAttribute('open');
    });
  });
});

const legalDialog = document.querySelector('#legal-dialog');
const legalTitle = document.querySelector('#legal-title');
const legalContent = document.querySelector('#legal-content');
const legalDocuments = {
  terms: { title: '이용약관', path: 'assets/legal/terms.txt' },
  privacy: { title: '개인정보처리방침', path: 'assets/legal/privacy.txt' },
};

document.querySelectorAll('[data-document]').forEach((button) => {
  button.addEventListener('click', async () => {
    const documentInfo = legalDocuments[button.dataset.document];
    if (!documentInfo) return;

    legalTitle.textContent = documentInfo.title;
    legalContent.innerHTML = '<p>문서를 불러오는 중입니다.</p>';
    legalDialog.showModal();
    document.body.classList.add('modal-open');

    try {
      const response = await fetch(documentInfo.path);
      if (!response.ok) throw new Error('Document request failed');
      const text = await response.text();
      const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
      if (lines[0]?.replace(/\s/g, '').includes(documentInfo.title.replace(/\s/g, ''))) lines.shift();
      legalContent.textContent = lines.join('\n').trim();
      legalContent.scrollTop = 0;
      legalContent.focus();
    } catch {
      legalContent.innerHTML = '<p>문서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
    }
  });
});

const closeLegalDialog = () => {
  legalDialog.close();
  document.body.classList.remove('modal-open');
};

document.querySelector('.legal-close').addEventListener('click', closeLegalDialog);
legalDialog.addEventListener('click', (event) => {
  if (event.target === legalDialog) closeLegalDialog();
});
legalDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
