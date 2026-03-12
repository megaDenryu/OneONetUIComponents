

/**
 * Lucide-like SVG Icons .
 */

import { createIcon } from "./base";




// --- App Specific Icons ---

// Eye icon for WATCH mode
export const eyeIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, [
    'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
  ]);

// Lock icon for visibility toggle hidden state
export const lockIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, [
    'M12 1a3 3 0 0 0-3 3v4H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-3V4a3 3 0 0 0-3-3z',
    'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
  ]);

// Brush icon for PEN mode
export const brushIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, [
    'm9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08',
    'M7.07 14.94c-3.9 3.91-4.63 5.41-4.03 6.01.6.61 2.1-.13 6.01-4.03'
  ]);

export const lineIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, ['M5 19 19 5']);

export const eraserIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, [
    'm7 21 14-14c1-1 1-2 0-3l-4-4c-1-1-2-1-3 0L3 11c-1 1-1 2 0 3l7 7Z',
    'M3 21h18'
  ]);

export const flameIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, [
    'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z'
  ]);

export const trashIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, [
    'M3 6h18',
    'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
    'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
    'M10 11v6',
    'M14 11v6'
  ]);

export const sendIcon = (size = 18, color = 'currentColor') => 
  createIcon(size, color, ['m22 2-7 20-4-9-9-4Z', 'M22 2 11 13']);

// --- Video Control Icons ---

export const playIcon = (size = 20, color = 'currentColor') => 
    createIcon(size, color, ['m5 3 14 9-14 9V3z'], { fill: 'currentColor' });

export const pauseIcon = (size = 20, color = 'currentColor') => 
    createIcon(size, color, ['M6 4h4v16H6z', 'M14 4h4v16h-4z'], { fill: 'currentColor' });

export const volumeIcon = (size = 20, color = 'currentColor') => 
    createIcon(size, color, ['M11 5L6 9H2v6h4l5 4V5z', 'M15.54 8.46a5 5 0 0 1 0 7.07'], { strokeWidth: 2.5 });

export const maximizeIcon = (size = 20, color = 'currentColor') => 
    createIcon(size, color, [
        'M8 3H5a2 2 0 0 0-2 2v3',
        'M21 8V5a2 2 0 0 0-2-2h-3',
        'M3 16v3a2 2 0 0 0 2 2h3',
        'M16 21h3a2 2 0 0 0 2-2v-3'
    ]);

export const chatIcon = (size = 20, color = 'currentColor') => 
    createIcon(size, color, ['M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z']);
