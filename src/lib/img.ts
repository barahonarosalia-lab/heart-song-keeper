export function resizeImg(url: string, width: number, quality = 80) {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp&default=${encodeURIComponent(url)}`;
}
