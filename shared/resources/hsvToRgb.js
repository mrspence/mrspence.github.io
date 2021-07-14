export const hsvToRgb = (hue, saturation, value) => {
    let chroma = value * saturation
    let hue1 = ( hue % 360 ) / 60
    let x = chroma * (1- Math.abs((hue1 % 2) - 1))
    let r1, g1, b1

    if (hue1 >= 0 && hue1 <= 1) {
      ([r1, g1, b1] = [chroma, x, 0])
    } else if (hue1 >= 1 && hue1 <= 2) {
      ([r1, g1, b1] = [x, chroma, 0])
    } else if (hue1 >= 2 && hue1 <= 3) {
      ([r1, g1, b1] = [0, chroma, x])
    } else if (hue1 >= 3 && hue1 <= 4) {
      ([r1, g1, b1] = [0, x, chroma])
    } else if (hue1 >= 4 && hue1 <= 5) {
      ([r1, g1, b1] = [x, 0, chroma])
    } else if (hue1 >= 5 && hue1 <= 6) {
      ([r1, g1, b1] = [chroma, 0, x])
    }

    let m = value - chroma
    let [r, g, b] = [r1 + m, g1 + m, b1 + m]

    // Change r, g, b values from [0, 1] to [0, 255]
    return [255 * r, 255 * g, 255 * b,]
}