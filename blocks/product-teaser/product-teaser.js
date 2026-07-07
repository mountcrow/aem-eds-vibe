import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [imageRow, nameRow, descriptionRow, priceRow, linkRow] = [...block.children];

  const imageCell = imageRow?.firstElementChild;
  const picture = imageCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  }
  imageCell?.classList.add('product-teaser-image');

  const body = document.createElement('div');
  body.className = 'product-teaser-body';

  const name = nameRow?.querySelector('h1, h2, h3, h4, h5, h6') || nameRow?.firstElementChild;
  if (name) {
    name.classList.add('product-teaser-name');
    body.append(name);
  }

  const description = descriptionRow?.firstElementChild;
  if (description) {
    description.classList.add('product-teaser-description');
    body.append(description);
  }

  const price = priceRow?.firstElementChild;
  if (price) {
    price.classList.add('product-teaser-price');
    body.append(price);
  }

  const link = linkRow?.querySelector('a');
  if (link) {
    link.classList.add('product-teaser-cta', 'button');
    body.append(link.closest('p') || link);
  }

  block.replaceChildren(...[imageCell, body].filter(Boolean));
}
