/* eslint-disable import/prefer-default-export */
const getFileSizeUnits = (si) =>
  si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

export const humanFileSize = (kiloBytes, si = false) => {
  const baseLog = Math.floor(Math.log(kiloBytes) / Math.log(1024))

  const fileSizeUnits = getFileSizeUnits(si)
  const resultUnit = fileSizeUnits[baseLog] ?? fileSizeUnits[fileSizeUnits.length - 1]

  return `${(kiloBytes / 1024 ** baseLog).toFixed(2)} ${resultUnit}`
}
