export function getImageSource(initValue: string, quality?: number | 'original'): string {
    let value = initValue

    if (quality){
        if (typeof quality === 'number') {
            value = value.replace(/(?<=\/album\/images\/)[\w]+/g, quality.toString())
        } else {
            value = value.replace(/(?<=\/album\/images\/)[\w]+/g, quality)
        }
    }

    return value
}
