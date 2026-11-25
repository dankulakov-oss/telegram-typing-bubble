// The host calls setTyping on typing events and receive on message delivery.
class IncomingBubble {
  constructor(thread) {
    this.thread = thread;
    this.pending = null;
  }

  setTyping(active) {
    if (!active) {
      this.pending?.remove();
      this.pending = null;
      return;
    }
    if (this.pending) return;
    const bubble = document.createElement('div');
    bubble.className = 'message';
    bubble.setAttribute('aria-label', 'Собеседник печатает');
    const dots = document.createElement('span');
    dots.className = 'dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) dots.append(document.createElement('i'));
    bubble.append(dots);
    this.thread.append(bubble);
    this.pending = bubble;
    bubble.scrollIntoView({block:'nearest'});
  }

  receive(text) {
    if (!text.trim()) return;
    this.setTyping(true);
    const bubble = this.pending;
    this.pending = null;
    const before = bubble.getBoundingClientRect();
    bubble.removeAttribute('aria-label');
    const content = document.createElement('span');
    // ASVS 1.2.1: messages are rendered as plain text.
    content.textContent = text;
    bubble.replaceChildren(content);
    const after = bubble.getBoundingClientRect();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const motion = bubble.animate([
        {width:before.width+'px', height:before.height+'px'},
        {width:after.width+'px', height:after.height+'px'}
      ], {duration:330, easing:'cubic-bezier(.18,.78,.25,1)'});
      content.animate([{opacity:0, offset:0},{opacity:0, offset:.3},{opacity:1}],330);
      motion.onfinish = () => {
        if (bubble === this.thread.lastElementChild) bubble.scrollIntoView({block:'nearest'});
      };
    }
    bubble.scrollIntoView({block:'nearest'});
  }
}

const receiver = new IncomingBubble(document.querySelector('.thread'));
const draft = document.querySelector('#draft');
const send = document.querySelector('button');
const statusLine = document.querySelector('#status');
draft.addEventListener('input', () => {
  const active = Boolean(draft.value.trim());
  receiver.setTyping(active);
  send.disabled = !active;
  statusLine.textContent = active ? 'печатает…' : 'в сети';
});
draft.form.addEventListener('submit', event => {
  event.preventDefault();
  if (!draft.value.trim()) return;
  receiver.receive(draft.value);
  draft.value = '';
  send.disabled = true;
  statusLine.textContent = 'в сети';
  draft.focus();
});
draft.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (!send.disabled) draft.form.requestSubmit();
  }
});
