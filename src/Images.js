import html, { useMemo } from './html.js';

import { Checkbox } from './components/Checkbox.js';
import {
  DownloadImageButton,
  ImageUrlTextbox,
  OpenImageButton,
} from './ImageActions.js';
import { isNotStrictEqual, stopPropagation } from './utils.js';

// TODO: Disable Download button based on how many images are selected
export const Images = ({
  options,
  visibleImages,
  selectedImages,
  setSelectedImages,
  style,
  ...props
}) => {
  const containerStyle = useMemo(() => {
    const columns = parseInt(options.columns, 10);
    return {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      width: `calc(2 * var(--images-container-padding) + ${columns} * ${
        options.image_max_width
      }px + ${columns - 1} * var(--images-container-gap))`,
      ...style,
    };
  }, [options.columns, options.image_max_width, style]);

  const show_image_url = useMemo(() => options.show_image_url === 'true', [
    options.show_image_url,
  ]);

  const show_open_image_button = useMemo(
    () => options.show_open_image_button === 'true',
    [options.show_open_image_button]
  );

  const show_download_image_button = useMemo(
    () => options.show_download_image_button === 'true',
    [options.show_download_image_button]
  );

  const { allImagesAreSelected, allImagesAreUnselected } = useMemo(() => {
    let allImagesAreSelected = visibleImages.length > 0;
    let allImagesAreUnselected = true;
    for (const imageUrl of visibleImages) {
      if (selectedImages.includes(imageUrl)) {
        allImagesAreUnselected = false;
      } else {
        allImagesAreSelected = false;
      }
      // Exit the loop early
      if (!(allImagesAreSelected || allImagesAreUnselected)) break;
    }

    return { allImagesAreSelected, allImagesAreUnselected };
  }, [visibleImages, selectedImages]);

  return html`
    <div id="images_container" style=${containerStyle} ...${props}>
      <div style=${{ gridColumn: '1 / -1', fontWeight: 'bold' }}>
        <${Checkbox}
          checked=${allImagesAreSelected}
          indeterminate=${!(allImagesAreSelected || allImagesAreUnselected)}
          onChange=${() => setSelectedImages(visibleImages)}
        >
          Select all (${visibleImages.length})
        <//>
      </div>

      ${visibleImages.map(
        (imageUrl, index) => html`
          <div
            id=${`card_${index}`}
            class="card ${selectedImages.includes(imageUrl) ? 'checked' : ''}"
            style=${{ minHeight: `${options.image_max_width}px` }}
            onClick=${(e) => {
              setSelectedImages((selectedImages) =>
                selectedImages.includes(imageUrl)
                  ? selectedImages.filter(isNotStrictEqual(imageUrl))
                  : [...selectedImages, imageUrl]
              );
            }}
          >
            <img
              src=${imageUrl}
              style=${{
                minWidth: `${options.image_min_width}px`,
                maxWidth: `${options.image_max_width}px`,
              }}
            />

            <div class="checkbox"></div>

            ${(show_open_image_button || show_download_image_button) &&
            html`<div class="actions">
              ${show_open_image_button &&
              html`<${OpenImageButton}
                imageUrl=${imageUrl}
                onClick=${stopPropagation}
              />`}
              ${show_download_image_button &&
              html`<${DownloadImageButton}
                imageUrl=${imageUrl}
                onClick=${stopPropagation}
              />`}
            </div>`}
            ${show_image_url &&
            html`<div class="image_url_container">
              <${ImageUrlTextbox}
                value=${imageUrl}
                onClick=${stopPropagation}
              />
            </div>`}
          </div>
        `
      )}
    </div>
  `;
};
