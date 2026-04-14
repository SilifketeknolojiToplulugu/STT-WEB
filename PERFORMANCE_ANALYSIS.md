# Performance Analysis & Optimization Suggestions

## Identified Issues

### 1. Heavy Background Animations
The application uses intensive background animations that run continuously:
- **MatrixRain**: Renders falling characters on a canvas. This is CPU/GPU intensive.
- **InteractiveDots**: Calculates and renders connecting lines between dots based on mouse position. This is also computationally expensive.

**Impact**: High CPU usage, GPU strain, laptop fans spinning up, battery drain, and potential browser tab freezing on lower-end devices.

### 2. Large Asset Sizes
- **Images**: Some images in the `public` folder (e.g., `bahadirgemalmaz.png` is ~1.5MB, `vadikaral.png` is ~675KB) are quite large.
- **Optimization**: These should be converted to WebP format and resized to the actual display dimensions.

## Recommendations

### 1. Implement "Low Power Mode" / Performance Toggle
Add a setting (auto-detected or manual) to disable heavy animations.
- **Auto-detection**: Use `navigator.hardwareConcurrency` or monitor frame rates to automatically disable effects on slow devices.
- **Manual Toggle**: Add a "Performance Mode" switch in the UI (e.g., in the footer or settings).

### 2. Optimize Animations
- **Reduce Density**: Decrease the number of drops in `MatrixRain` and dots in `InteractiveDots`.
- **Pause when out of view**: Ensure animations stop rendering when the component is not in the viewport (using `IntersectionObserver`).
- **Pause when tab hidden**: Ensure animations stop when the user switches tabs (using `document.visibilityState`).

### 3. Image Optimization
- Convert all PNG/JPG images to WebP.
- Use `srcset` to serve smaller images for mobile devices.
- Lazy load images that are not in the initial viewport (already partially implemented).

### 4. Code Splitting
- Continue using `React.lazy` for heavy components (already implemented for `MatrixRain` and `InteractiveDots`).
- Ensure that these components are only loaded when absolutely necessary.

## Immediate Action Plan (Next Steps)
1.  **Optimize Images**: Resize and convert large team images to WebP.
2.  **Performance Toggle**: Add a simple toggle to the footer to turn off background effects.
3.  **Animation Tuning**: Reduce the default particle count for `MatrixRain` and `InteractiveDots` by 30-50%.
