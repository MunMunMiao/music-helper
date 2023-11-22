

export function getThumbnail(id: number, quality: number | 'original') {
    return `https://image.bugsm.co.kr/album/images/${quality}/${id}.jpg`
}
