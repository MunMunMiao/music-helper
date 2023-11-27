export type ToNumberOptions = {
    optional?: boolean
}

export function toNumber(inputValue: unknown): number
export function toNumber(inputValue: unknown, options: ToNumberOptions & { optional: false }): number
export function toNumber(inputValue: unknown, options: ToNumberOptions & { optional: true }): number | undefined
export function toNumber(inputValue: unknown, options?: ToNumberOptions): number | undefined {
    if (typeof inputValue === 'number') {
        return inputValue
    }

    if (options?.optional && typeof inputValue !== 'string') {
        return undefined
    }

    const result = Number(inputValue)
    return Number.isNaN(result) ? 0 : result
}

export function toString(inputValue: unknown): string {
    if (typeof inputValue === 'string') {
        return inputValue
    }

    return String(inputValue)
}
