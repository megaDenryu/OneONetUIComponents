/**
 * Lucide-like SVG Icons.
 * named export関数のため、未使用アイコンはtree-shakingで除去される。
 */

import { createIcon, icon } from "SengenUI/index";


// --- App Specific Icons ---

export const eyeIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
  ] });

export const lockIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M12 1a3 3 0 0 0-3 3v4H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-3V4a3 3 0 0 0-3-3z',
    'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
  ] });

export const brushIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: [
    'm9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08',
    'M7.07 14.94c-3.9 3.91-4.63 5.41-4.03 6.01.6.61 2.1-.13 6.01-4.03'
  ] });

export const lineIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: ['M5 19 19 5'] });

export const eraserIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: [
    'm7 21 14-14c1-1 1-2 0-3l-4-4c-1-1-2-1-3 0L3 11c-1 1-1 2 0 3l7 7Z',
    'M3 21h18'
  ] });

export const flameIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z'
  ] });

export const trashIcon = (size = 18, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M3 6h18',
    'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
    'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
    'M10 11v6',
    'M14 11v6'
  ] });


// --- Video Control Icons ---

export const playIcon = (size = 20, color = 'currentColor') =>
  icon({ size, color, paths: ['m5 3 14 9-14 9V3z'], style: { fill: 'currentColor' } });

export const pauseIcon = (size = 20, color = 'currentColor') =>
  icon({ size, color, paths: ['M6 4h4v16H6z', 'M14 4h4v16h-4z'], style: { fill: 'currentColor' } });

export const volumeIcon = (size = 20, color = 'currentColor') =>
  icon({ size, color, paths: ['M11 5L6 9H2v6h4l5 4V5z', 'M15.54 8.46a5 5 0 0 1 0 7.07'], style: { strokeWidth: 2.5 } });

export const maximizeIcon = (size = 20, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M8 3H5a2 2 0 0 0-2 2v3',
    'M21 8V5a2 2 0 0 0-2-2h-3',
    'M3 16v3a2 2 0 0 0 2 2h3',
    'M16 21h3a2 2 0 0 0 2-2v-3'
  ] });

export const chatIcon = (size = 20, color = 'currentColor') =>
  icon({ size, color, paths: ['M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'] });


// --- UI Common Icons ---

export const messageSquareIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] });

export const codeIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['m18 16 4-4-4-4', 'm6 8-4 4 4 4', 'm14.5 4-5 16'] });

export const fileJsonIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1',
    'M14 12a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1 1 1 0 0 0-1 1v1a1 1 0 0 1-1 1'
  ], style: { stroke: '#fbbf24' } });

export const folderIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'] });

export const folderOpenIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M6 14 1.35-5.41A2 2 0 0 1 9.29 7h10.22a2 2 0 0 1 1.94 2.59L20.1 14',
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'
  ] });

export const uploadIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5-5 5 5', 'M12 15V3'] });

export const fileIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4'] });

export const settingsIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
  ] });

export const downloadIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3'] });

export const sendIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['m22 2-7 20-4-9-9-4Z', 'M22 2 11 13'] });

export const paperclipIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48'] });

export const micIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
    'M19 10v2a7 7 0 0 1-14 0v-2',
    'M12 19v3',
    'M8 22h8'
  ] });

export const terminalIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['m4 17 6-6-6-6', 'M12 19h8'] });

export const xIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M18 6 6 18', 'M6 6l12 12'] });

export const chevronRightIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['m9 18 6-6-6-6'] });

export const chevronDownIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['m6 9 6 6 6-6'] });

export const globeIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z'] });

export const stickyNoteIcon = (size = 14, color = 'currentColor') =>
  createIcon(size, color, [
    'M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z',
    'M15 3v4a2 2 0 0 0 2 2h4'
  ]);

export const externalLinkIcon = (size = 14, color = 'currentColor') =>
  createIcon(size, color, [
    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
    'M15 3h6v6',
    'M10 14 21 3'
  ]);

export const slidersIcon = (size = 14, color = 'currentColor') =>
  createIcon(size, color, [
    'M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3',
    'M2 10h4', 'M10 8h4', 'M18 12h4'
  ]);

export const paletteIcon = (size = 14, color = 'currentColor') =>
  icon({ size, color, paths: [
    'M12 2a10 10 0 0 0-1.16 19.93A2 2 0 0 0 13 20v-1a2 2 0 0 1 2-2h1.17c.94 0 1.67-.72 1.92-1.63A10 10 0 0 0 12 2Z',
    'M6.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    'M10 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    'M14 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    'M17.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'
  ] });
