/**
 * Loads and decorates the quote block.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const quoteCell = rows[0]?.firstElementChild;
  const attributionCell = rows[1]?.firstElementChild;

  if (!quoteCell) return;

  const quote = document.createElement('blockquote');
  quote.append(...quoteCell.childNodes);

  const content = [quote];
  if (attributionCell?.textContent.trim()) {
    const footer = document.createElement('footer');
    const cite = document.createElement('cite');
    cite.append(...attributionCell.childNodes);
    footer.append(cite);
    content.push(footer);
  }

  block.replaceChildren(...content);
}
