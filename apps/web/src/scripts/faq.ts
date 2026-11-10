/** FAQ accordion: one open row at a time per `[data-faq]` list. */

function setOpen(btn: HTMLButtonElement, answer: HTMLElement, sign: HTMLElement, open: boolean) {
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  answer.hidden = !open;
  sign.textContent = open ? '−' : '+';
}

function initFaq(root: HTMLElement) {
  if (root.dataset.faqReady) return;
  root.dataset.faqReady = '1';
  const rows = [...root.querySelectorAll<HTMLElement>('.t-4fb45a')];
  for (const row of rows) {
    const btn = row.querySelector<HTMLButtonElement>('button[aria-expanded]');
    const answer = row.querySelector<HTMLElement>('p');
    const sign = btn?.querySelector<HTMLElement>('[aria-hidden="true"]');
    if (!btn || !answer || !sign) continue;

    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      for (const other of rows) {
        const ob = other.querySelector<HTMLButtonElement>('button[aria-expanded]');
        const oa = other.querySelector<HTMLElement>('p');
        const os = ob?.querySelector<HTMLElement>('[aria-hidden="true"]');
        if (!ob || !oa || !os) continue;
        setOpen(ob, oa, os, willOpen && other === row);
      }
    });
  }
}

export function initFaqs() {
  document.querySelectorAll<HTMLElement>('[data-faq]').forEach(initFaq);
}
