# PWA Splash Video Setup

## How to Replace the Splash Video

The PWA splash screen currently shows an animated placeholder. To use your own custom video:

### 1. Prepare Your Video
- **Format**: MP4 (H.264 codec)
- **Aspect Ratio**: 9:16 portrait (1080x1920 recommended)
- **Duration**: 3-10 seconds, seamless loop
- **Size**: Keep under 5MB for fast loading
- **Content**: Your factory intro, logo animation, or brand video

### 2. Place Video Files
Copy your video to the `public/` directory:
```
public/
├── splash-video.mp4      (required)
└── splash-poster.jpg     (optional - shows before video loads)
```

### 3. Verify
1. Build the app: `npm run build`
2. Open in PWA mode (standalone)
3. Video will auto-play on first launch per session

### Technical Details
- Video plays in `PWASplash.jsx` component
- Shows only in PWA standalone mode (not in browser)
- Auto-hides after 3 seconds
- Uses `sessionStorage` to show once per session
- Falls back to animated D1 logo if video not found

### Optional: Customize Duration
Edit `src/components/shared/PWASplash.jsx` line 22:
```jsx
const timer = setTimeout(() => setShow(false), 3000) // Change 3000 to desired ms
```

---
**Current placeholder**: Animated teal gradient with pulsing D1 logo
**After you add video**: Your video replaces the gradient background
