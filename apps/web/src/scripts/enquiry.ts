/** Enquiry form — chips + submit (FORMS.md). */

const CHIP_ON = 't-32a902';
const CHIP_OFF = 't-faaab6';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement | string, opts: Record<string, unknown>) => string;
      execute: (widgetId: string) => void;
      ready?: (cb: () => void) => void;
    };
  }
}

function syncHidden(host: HTMLElement, selected: string[]) {
  host.replaceChildren(
    ...selected.map((value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'projectTypes';
      input.value = value;
      return input;
    }),
  );
}

function selectedValues(chips: HTMLButtonElement[]): string[] {
  return chips
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.dataset.value || b.textContent || '');
}

function setPressed(btn: HTMLButtonElement, on: boolean) {
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.classList.toggle(CHIP_ON, on);
  btn.classList.toggle(CHIP_OFF, !on);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function showError(el: HTMLElement | null, text: string) {
  if (!el) return;
  el.textContent = text;
}

function clearError(el: HTMLElement | null) {
  if (!el) return;
  el.textContent = '';
}

function clientValidate(form: HTMLFormElement, allowed: string[]): string | null {
  const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim() || '';
  const artist = (form.elements.namedItem('artist') as HTMLInputElement)?.value.trim() || '';
  const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim() || '';
  const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value.trim() || '';
  const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value.trim() || '';
  const preferredStart = (form.elements.namedItem('preferredStart') as HTMLInputElement)?.value || '';
  const daysRaw = (form.elements.namedItem('days') as HTMLInputElement)?.value || '';
  const consent = (form.elements.namedItem('consent') as HTMLInputElement)?.checked;
  const types = selectedValues([
    ...form.querySelectorAll<HTMLButtonElement>('[data-project-chips] button[data-value]'),
  ]);

  if (name.length < 2 || name.length > 80) return 'Name must be 2–80 characters';
  if (artist.length > 80) return 'Artist must be ≤ 80 characters';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email required';
  if (phone && (phone.length > 30 || !/^[0-9+()\s-]*$/.test(phone))) return 'Invalid phone';
  if (types.length < 1 || types.some((t) => !allowed.includes(t))) return 'Choose at least one project type';
  if (preferredStart && preferredStart < todayISO()) return 'Start date must be today or later';
  if (daysRaw) {
    const n = Number(daysRaw);
    if (!Number.isInteger(n) || n < 1 || n > 60) return 'Days must be 1–60';
  }
  if (message.length > 4000) return 'Message must be ≤ 4000 characters';
  if (!consent) return 'Consent is required';
  return null;
}

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-tems-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('turnstile')));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.dataset.temsTurnstile = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(s);
  });
}

/** Static /enquire cannot see `?room=` at build time — apply from the URL in the browser. */
function applyRoomFromQuery(form: HTMLFormElement) {
  const slug = new URLSearchParams(location.search).get('room');
  if (!slug) return;
  const roomInput = form.querySelector<HTMLInputElement>('input[name="room"]');
  if (roomInput) roomInput.value = slug;

  type RoomMini = { slug: string; name: string };
  let rooms: RoomMini[] = [];
  try {
    rooms = JSON.parse(form.dataset.rooms || '[]') as RoomMini[];
  } catch {
    rooms = [];
  }
  const match = rooms.find((r) => r.slug === slug);
  const ta = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
  if (match && ta) {
    const base = form.dataset.messagePlaceholder || '';
    ta.placeholder = `Room: ${match.name}\n${base}`;
  }
}

function swapToSent(panel: HTMLElement, form: HTMLFormElement) {
  const tpl = panel.querySelector<HTMLTemplateElement>('template[data-enquire-sent-template]');
  const node = tpl?.content.firstElementChild;
  if (!node) return;
  const sent = node.cloneNode(true) as HTMLElement;
  form.replaceWith(sent);
  tpl?.remove();
  const heading = sent.querySelector<HTMLElement>('[data-enquire-thanks-title]');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus();
  sent.querySelector('[data-enquire-again]')?.addEventListener('click', () => {
    location.href = '/enquire';
  });
}

function initForm(form: HTMLFormElement) {
  if (form.dataset.enquiryReady) return;
  form.dataset.enquiryReady = '1';

  applyRoomFromQuery(form);

  const chips = [...form.querySelectorAll<HTMLButtonElement>('[data-project-chips] button[data-value]')];
  const host = form.querySelector<HTMLElement>('[data-project-types]');
  const status = form.querySelector<HTMLElement>('[data-enquire-error]');
  const turnstileEl = form.querySelector<HTMLElement>('.cf-turnstile');
  const allowed = JSON.parse(form.dataset.allowedTypes || '[]') as string[];
  const errorFallback =
    form.dataset.errorText || 'Sorry — your enquiry did not go through. Please try again, or email us.';
  const panel = form.closest<HTMLElement>('[data-enquire-panel]');

  if (host && chips.length) {
    syncHidden(host, selectedValues(chips));
    for (const btn of chips) {
      btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-pressed') === 'true';
        if (on && selectedValues(chips).length <= 1) return;
        setPressed(btn, !on);
        syncHidden(host, selectedValues(chips));
      });
    }
  }

  let widgetId: string | null = null;
  let tokenResolver: ((token: string) => void) | null = null;

  const ensureTurnstile = async () => {
    if (!turnstileEl || widgetId) return;
    await loadTurnstile();
    const sitekey = turnstileEl.dataset.sitekey || '';
    widgetId = window.turnstile!.render(turnstileEl, {
      sitekey,
      size: 'invisible',
      callback: (token: string) => tokenResolver?.(token),
    });
  };

  const executeTurnstile = async (): Promise<string> => {
    await ensureTurnstile();
    if (!widgetId || !window.turnstile) return '';
    return new Promise((resolve, reject) => {
      tokenResolver = resolve;
      window.turnstile!.execute(widgetId!);
      window.setTimeout(() => reject(new Error('turnstile timeout')), 20_000);
    });
  };

  const warm = () => {
    void ensureTurnstile();
  };
  form.addEventListener('focusin', warm, { once: true });
  form.addEventListener('pointerdown', warm, { once: true });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    clearError(status);

    const localErr = clientValidate(form, allowed);
    if (localErr) {
      showError(status, localErr);
      return;
    }

    try {
      const token = await executeTurnstile();
      const fd = new FormData(form);
      const payload: Record<string, unknown> = {
        name: fd.get('name'),
        artist: fd.get('artist'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        projectTypes: fd.getAll('projectTypes').map(String),
        preferredStart: fd.get('preferredStart') || '',
        days: fd.get('days') || '',
        message: fd.get('message'),
        consent: fd.get('consent') === 'true' || fd.get('consent') === 'on',
        room: fd.get('room') || '',
        company: fd.get('company') || '',
        'cf-turnstile-response': token,
      };

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean };

      if (!res.ok || !body.ok) {
        showError(status, errorFallback);
        return;
      }

      if (panel) swapToSent(panel, form);
      history.replaceState(null, '', '/enquire/thanks');
    } catch {
      showError(status, errorFallback);
    }
  });
}

export function initEnquiry() {
  document.querySelectorAll<HTMLFormElement>('form[data-enquire-form]').forEach(initForm);
  document.querySelector('[data-enquire-again]')?.addEventListener('click', () => {
    location.href = '/enquire';
  });
}
