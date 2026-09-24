import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  let optimizedPicture;
  if (picture) {
    const img = picture.querySelector('img');
    optimizedPicture = createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }, { width: '750' }]);
    picture.replaceWith(optimizedPicture);
    optimizedPicture.remove(); // detach now; re-inserted directly under the block below
  }

  // gather all remaining authored content (headline, copy, CTA) into a single wrapper
  const content = document.createElement('div');
  content.className = 'hero-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
  });

  // drop wrapper elements left empty once the picture was moved out (e.g. its <p>)
  [...content.children].forEach((el) => {
    if (el.tagName === 'P' && !el.textContent.trim() && !el.children.length) el.remove();
  });

  block.replaceChildren(...[optimizedPicture, content].filter(Boolean));
}
