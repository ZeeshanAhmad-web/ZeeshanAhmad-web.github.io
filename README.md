# zeeshanahmad.art

Portfolio of Zeeshan Ahmad, concept artist and illustrator. A single page site hosted on GitHub Pages. No build step: edit the files and push.

## Structure

```
index.html                  The whole site: work grid, sketchbook, about, CV, contact
assets/css/style.css        All styles
assets/js/main.js           Filters, viewer, sketchbook drag, animations
assets/img/                 Artwork. Each piece has a full size file (name.jpg) and a grid size file (name-800.jpg)
assets/Zeeshan-Ahmad-CV.pdf CV for the Download CV buttons (no phone number or street address)
assets/og.jpg               Preview image for links shared on social media
game/ publishing/ product/ personal/   Short links that open the matching filter (zeeshanahmad.art/game)
about.html contact.html portfolio.html sketchbook.html work/*.html   Old addresses, now redirect to the new page
404.html                    Shown for any address that does not exist
```

## Links to send

- Studios: https://zeeshanahmad.art/game
- Publishers: https://zeeshanahmad.art/publishing
- Everything: https://zeeshanahmad.art/#all-work

## Add a piece

1. Export the artwork as JPG twice: `my-piece.jpg` at about 1600px on the long side, and `my-piece-800.jpg` at about 900px. Put both in `assets/img/`.
2. In `index.html`, copy any `<article class="card" ...>` block inside `<div class="grid" id="grid">` and change:
   - `data-cat`: `game`, `publishing`, `product` or `personal`
   - `data-title`, `data-year`, `data-scope`, the tag text and the `alt` text
   - the three image paths
3. Optional:
   - `data-feat="5"` shows it on the homepage. The number sets its place in the order. Number 1 is the large top image.
   - `data-gallery="assets/img/a.jpg|assets/img/b.jpg"` adds extra images (mockups, spots, letters) to the viewer.
   - `data-also="personal"` shows it in a second section too.
   - `data-desc="..."` adds a short paragraph in the viewer.
   - `style="object-position:50% 20%"` on the `<img>` moves the crop in the grid.

Cards pair up automatically, so the layout stays balanced whatever you add or remove.

## Sketchbook

Images are listed inside `<div class="track" id="track">`. The list appears twice so the strip can loop: add or remove each image in both halves.

## Old files you can delete

The new site does not use these. Deleting them makes the repository much smaller:

- `styles.css`
- `script.js`
- `images/` (the whole folder)
- `work/images/` (the whole folder, many files are 10 to 40 MB)

Keep the `work/*.html` files: they redirect old links to the new site.
