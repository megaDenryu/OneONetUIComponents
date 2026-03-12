import { path, svg } from "SengenUI/index";


interface IconStyle {
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

export function themedPath(d: string, color: string, style: IconStyle = {}) {
  return path({
    d,
    stroke: color,
    fill: style.fill || 'none',
    strokeWidth: style.strokeWidth || 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  });
}

export function createIcon(size: number, color: string, paths: string[], style: IconStyle = {}) {
  return svg({ width: size, height: size, viewBox: '0 0 24 24' })
    .childs(paths.map(d => themedPath(d, color, style)));
}