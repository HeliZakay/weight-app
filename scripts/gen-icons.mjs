// Generates simple placeholder PWA icons: a clay rounded square with a serif
// "C" on a paper field. Pure Node (zlib) — no image deps. Swap for real art later.
import zlib from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const PAPER = [244, 238, 228];
const CLAY = [192, 107, 78];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const px = (x, y) => {
    // rounded-square clay tile with padding on paper
    const pad = size * 0.08;
    const r = size * 0.22;
    const inX = x >= pad && x <= size - pad;
    const inY = y >= pad && y <= size - pad;
    // rounded corners
    const cx = Math.min(Math.max(x, pad + r), size - pad - r);
    const cy = Math.min(Math.max(y, pad + r), size - pad - r);
    const inCorner = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
    const inTile =
      inX &&
      inY &&
      (x >= pad + r && x <= size - pad - r
        ? true
        : y >= pad + r && y <= size - pad - r
          ? true
          : inCorner);

    if (!inTile) return PAPER;

    // draw a rough "C": a ring arc, paper-colored, centered
    const mx = size / 2;
    const my = size / 2;
    const dx = x - mx;
    const dy = y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const rOuter = size * 0.26;
    const rInner = size * 0.15;
    const ang = Math.atan2(dy, dx); // -PI..PI
    const inRing = dist <= rOuter && dist >= rInner;
    const mouth = ang > -0.6 && ang < 0.6; // opening on the right
    if (inRing && !mouth) return PAPER;
    return CLAY;
  };

  const raw = Buffer.alloc((size * 4 + 1) * size);
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = px(x, y);
      raw[o++] = r;
      raw[o++] = g;
      raw[o++] = b;
      raw[o++] = 255;
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(new URL("../public/icons/", import.meta.url), { recursive: true });
for (const size of [192, 512]) {
  const out = new URL(`../public/icons/icon-${size}.png`, import.meta.url);
  writeFileSync(out, png(size));
  console.log("wrote", out.pathname);
}
