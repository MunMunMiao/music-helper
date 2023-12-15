export function throwError(error: unknown): Response
export function throwError(error: Error): Response
export function throwError(message: string): Response
export function throwError(value: unknown): Response {
    const init: ResponseInit = {status: 500}

    switch (true) {
        case value instanceof Error: {
            return Response.json({
                message: value.message
            }, init)
        }
        case typeof value === 'string': {
            return Response.json({
                message: value
            }, init)
        }
        default: {
            return Response.json({
                message: 'Server Error'
            }, init)
        }
    }
}
