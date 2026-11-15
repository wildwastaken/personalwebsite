import { memo } from 'react'
import type { ScapeType } from './PixelScape'

type Profile = readonly (readonly [number, number])[]
type Terrain = Exclude<ScapeType, 'none' | 'custom'>
const profiles: Record<Terrain, Profile> = {
  mountains: [[0, 173], [108, 130], [186, 148], [286, 65], [342, 110], [406, 86], [516, 164], [619, 186], [717, 154], [826, 94], [886, 118], [992, 53], [1051, 91], [1200, 143]],
  andes: [[0, 178], [100, 129], [177, 146], [269, 48], [322, 105], [390, 17], [457, 92], [568, 171], [673, 158], [760, 76], [813, 99], [908, 31], [997, 125], [1067, 111], [1200, 179]],
  forest: [[0, 162], [154, 142], [262, 165], [371, 128], [496, 167], [650, 137], [803, 160], [928, 112], [1058, 141], [1200, 118]],
  lake: [[0, 162], [99, 144], [213, 66], [277, 106], [341, 42], [406, 110], [500, 83], [582, 169], [695, 177], [782, 110], [851, 131], [954, 58], [1030, 115], [1120, 96], [1200, 152]],
}

// Three-unit steps keep the drawing deliberately pixel sized at every screen width.
function ridge(profile: Profile, offset = 0, seed = 0) {
  const points: [number, number][] = []
  let segment = 0
  for (let x = 0; x <= 1200; x += 6) {
    while (segment < profile.length - 2 && x > profile[segment + 1][0]) segment++
    const [ax, ay] = profile[segment], [bx, by] = profile[segment + 1]
    const y = ay + (by - ay) * (x - ax) / (bx - ax) + Math.sin(x * 0.083 + seed) * 2 + offset
    points.push([x, Math.round(y / 3) * 3])
  }
  return points
}
function silhouette(points: [number, number][]) {
  return `M 0 320 L 0 ${points[0][1]} ${points.slice(1).map(([x, y]) => `H ${x} V ${y}`).join(' ')} L 1200 320 Z`
}
function pine(x: number, y: number, height: number) {
  const h = Math.round(height / 3) * 3
  const top = y - h
  const rows = Array.from({ length: 6 }, (_, i) => ({
    width: (i + 1) * 3,
    bottom: top + Math.round((h - 9) * (i + 1) / 18) * 3,
  }))
  const right = rows.map(row => `H ${x + row.width} V ${row.bottom}`).join(' ')
  const left = [...rows].reverse().map((row, i) => `H ${x - row.width} V ${i === 5 ? top : rows[4 - i].bottom}`).join(' ')
  return `M ${x} ${top} ${right} H ${x + 1.5} V ${y} H ${x - 1.5} V ${rows[5].bottom} ${left} H ${x} Z`
}

function LandscapeArt({ terrain }: { terrain: Terrain }) {
  const far = ridge(profiles[terrain], 0, 2)
  const middle = ridge([[0, 194], [175, 170], [301, 214], [457, 195], [631, 226], [811, 202], [975, 183], [1200, 192]], 0, 4)
  const near = ridge([[0, 226], [158, 208], [272, 246], [414, 257], [588, 260], [769, 255], [902, 241], [1081, 218], [1200, 236]], 0, 8)
  return (
    <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice" className="landscape-art w-full h-full" shapeRendering="crispEdges" aria-hidden="true">
      <g className="landscape-stars" fill="#e8e3cc">
        {Array.from({ length: 38 }, (_, i) => (
          <rect
            key={i}
            className="landscape-star"
            x={18 + (i * 137) % 1164}
            y={33 + (i * 47) % 114}
            width={i % 5 === 0 ? 3 : 2}
            height={i % 5 === 0 ? 3 : 2}
            style={{ animationDelay: `${i * -1.7}s`, animationDuration: `${9 + i % 5 * 3}s` }}
          />
        ))}
      </g>
      <g className="landscape-distance">
        <path d={silhouette(far)} fill="var(--scape-far)" />
        {terrain !== 'forest' && (
          <path d={`M ${far.map(([x, y]) => `${x} ${y}`).join(' L ')} L ${[...far].reverse().map(([x, y]) => `${x} ${y + 9 + Math.round((Math.sin(x / 31) + 1) * 4 / 3) * 3}`).join(' L ')} Z`} fill="var(--scape-snow)" opacity="0.55" />
        )}
      </g>
      <path className="landscape-foothills" d={silhouette(middle)} fill="var(--scape-middle)" />
      <path d={silhouette(near)} fill="var(--scape-near)" />
      <path d="M 0 267 H 1200 V 320 H 0 Z" fill="var(--scape-water)" />
      <g stroke="var(--scape-middle)" opacity="0.45">
        {[0, 1, 2, 3, 4, 5, 6].map(row => (
          <path key={row} className="landscape-current" style={{ animationDelay: `${row * -2.5}s` }} d={`M ${72 + row * 37} ${275 + row * 6} h ${195 - row * 12} M ${710 + row * 19} ${275 + row * 6} h ${233 - row * 15}`} />
        ))}
      </g>
      <path d="M 0 252 H 75 V 249 H 129 V 255 H 180 V 264 H 225 V 270 H 171 V 273 H 93 V 279 H 0 Z M 1200 246 H 1137 V 252 H 1098 V 258 H 1062 V 267 H 1008 V 273 H 1080 V 276 H 1200 Z" fill="var(--scape-bank)" />
      <g fill="var(--scape-pine)">
        {[0, 21, 48, 72, 105, 138, 167, 195, 1047, 1077, 1104, 1134, 1161, 1191].map((x, i) => (
          <path key={x} d={pine(x, 265 + i % 3 * 3, 57 + (i * 17 % 39))} opacity={0.65 + i % 3 * 0.12} />
        ))}
        {terrain === 'forest' && Array.from({ length: 35 }, (_, i) => (
          <path key={i} d={pine(i * 36, 228 + Math.round(Math.sin(i) * 4) * 3, 57 + i * 13 % 27)} opacity="0.5" />
        ))}
      </g>
      <g fill="var(--scape-bank)" opacity="0.5">
        <path d="M 36 297 h 54 v 3 H 36 Z M 81 306 h 87 v 3 H 81 Z M 1104 294 h 66 v 3 h -66 Z M 1044 306 h 99 v 3 h -99 Z" />
      </g>
      <g className="landscape-birds" stroke="var(--scape-pine)" strokeWidth="1.5" fill="none" opacity="0.45">
        <path d="M 563 136 h 3 v 3 h 3 v -3 h 3 M 581 126 h 3 v 3 h 3 v -3 h 3" />
      </g>
    </svg>
  )
}

export default memo(LandscapeArt)
