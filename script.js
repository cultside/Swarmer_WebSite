// Аккордезон: открытый вопрос закрывает предыдущий
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item[open]').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});
