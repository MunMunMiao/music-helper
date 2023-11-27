export interface DownloadOptions {
  type?: string
}

/**
 * 下载数据
 * @param {string} name 名称
 * @param {File | Blob} value 数据
 * @param {DownloadOptions} [options] 选项
 */
export function download(name: string, value: File | Blob | ArrayBuffer, options?: DownloadOptions): void {
  let file: File

  if (value instanceof File) {
    file = value
  } else {
    file = new File([value], name, {
      type: options?.type,
    })
  }

  const element = document.createElement('a')
  const objectUrl = URL.createObjectURL(file)

  element.href = objectUrl
  element.download = file.name
  element.click()
  element.remove()
  URL.revokeObjectURL(objectUrl)
}
