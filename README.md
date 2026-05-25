# react-crop-kit

[![npm version](https://img.shields.io/npm/v/react-crop-kit.svg)](https://www.npmjs.com/package/react-crop-kit)
[![license](https://img.shields.io/npm/l/react-crop-kit.svg)](https://github.com/nunesunil/react-crop-kit/blob/main/LICENSE)

A responsive image and video crop component for React 19. Drag to draw, resize with handles, nudge with the keyboard, and keep the selection in pixels or percentages.

## Install

```bash
pnpm add react-crop-kit
# or npm install react-crop-kit / yarn add react-crop-kit
```

Peer dependencies: `react` and `react-dom` (^19).

## Setup

Import the component — default styles are injected automatically at runtime:

```tsx
import { ReactCropKit } from "react-crop-kit";
```

## Basic usage

`ReactCropKit` is controlled: pass `crop` from state and update it in `onChange`.

```tsx
import { useState } from "react";
import { ReactCropKit, type Crop } from "react-crop-kit";

function ImageCropper({ src }: { src: string }) {
  const [crop, setCrop] = useState<Crop>();

  return (
    <ReactCropKit
      crop={crop}
      onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
    >
      <img src={src} alt="Crop me" />
    </ReactCropKit>
  );
}
```

`onChange` receives two shapes:

- **PixelCrop** — `unit: "px"`, useful for canvas export
- **PercentCrop** — `unit: "%"`, scales when the media is resized

Storing the percent crop in state (as above) is the usual choice.

## Fixed aspect ratio

Pass `aspect` (width ÷ height). Examples: `1` for a square, `16 / 9` for landscape.

```tsx
<ReactCropKit
  aspect={16 / 9}
  crop={crop}
  onChange={(_pixel, percent) => setCrop(percent)}
>
  <img src={src} alt="" />
</ReactCropKit>
```

## Initial crop

When you set `crop` for the first time (e.g. after load), `onComplete` runs once if it was previously unset — handy for previews.

```tsx
const [crop, setCrop] = useState<Crop>({
  unit: "%",
  x: 10,
  y: 10,
  width: 80,
  height: 80,
});

<ReactCropKit
  crop={crop}
  onChange={(_, percent) => setCrop(percent)}
  onComplete={(pixel, percent) => {
    console.log("Ready", pixel, percent);
  }}
>
  <img src={src} alt="" />
</ReactCropKit>
```

All of `x`, `y`, `width`, and `height` are required on the crop object when you use one (except you may omit `aspect` on the prop).

## Props

| Prop | Type | Description |
|------|------|-------------|
| `crop` | `Crop` | Controlled selection. Omit to hide the crop UI. |
| `onChange` | `(pixel, percent) => void` | **Required.** Called on every change. |
| `onComplete` | `(pixel, percent) => void` | After drag, resize, or keyboard nudge ends. |
| `onDragStart` | `(e: PointerEvent) => void` | First pointer move after press. |
| `onDragEnd` | `(e: PointerEvent) => void` | Pointer up after drag or resize. |
| `aspect` | `number` | Lock aspect ratio (e.g. `1`, `16/9`). |
| `circularCrop` | `boolean` | Circular mask (oval if aspect ≠ 1). |
| `ruleOfThirds` | `boolean` | Show rule-of-thirds guides. |
| `disabled` | `boolean` | No interaction; adds `ReactCropKit--disabled`. |
| `locked` | `boolean` | No new crop or resize; can still drag selection. |
| `keepSelection` | `boolean` | Clicking outside does not clear the crop. |
| `minWidth` / `minHeight` | `number` | Minimum size in **pixels**. |
| `maxWidth` / `maxHeight` | `number` | Maximum size in **pixels**. |
| `className` | `string` | Extra class on the root element. |
| `styles` | `CSSProperties` | Inline styles on the root. |
| `ariaLabels` | `object` | Override default English a11y strings. |
| `renderSelectionAddon` | `(state) => ReactNode` | Custom overlay inside the selection. |

`ReactCropKitState` passed to `renderSelectionAddon`:

- `cropIsActive` — user is dragging or resizing
- `newCropIsBeingDrawn` — drawing a new region

## Keyboard

Focus the crop area or a handle, then:

| Keys | Action |
|------|--------|
| Arrow keys | Move crop or resize from focused handle |
| Shift + arrows | 10px step |
| Ctrl/Cmd + arrows | 100px step |

## Styling

Styles ship with the bundle and are applied when you import `react-crop-kit` (no separate CSS import required). To load styles as a static stylesheet instead — for example in SSR or when your bundler strips runtime injection — import `react-crop-kit/styles.css` explicitly.

Override defaults via your own CSS targeting classes such as:

- `.ReactCropKit`
- `.ReactCropKit__crop-selection`
- `.ReactCropKit--disabled`, `.ReactCropKit--locked`, `.ReactCropKit--circular-crop`

CSS variables on `:root`:

- `--rck-drag-handle-size`
- `--rck-drag-handle-mobile-size`
- `--rck-border-color`
- `--rck-focus-color`

## Exporting the cropped image

Use the **pixel** crop from `onChange` / `onComplete` with a canvas:

```tsx
function cropImage(
  image: HTMLImageElement,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = pixelCrop.width * scaleX;
  canvas.height = pixelCrop.height * scaleY;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/png"),
  );
}
```

Scale by `naturalWidth / width` when the displayed image is scaled (responsive layouts).

## Development

```bash
pnpm install
pnpm run build      # dist/
pnpm run typecheck
pnpm run dev        # watch build
```

## License

[MIT](LICENSE) © [Sunil Nune](https://github.com/nunesunil)
