'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { NextUIProvider } from '@nextui-org/react'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export function Providers({children}: { children: React.ReactNode }) {
    const queryClient = new QueryClient()
    const router = useRouter()

    return (
        <NextUIProvider navigate={router.push}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </NextUIProvider>
    )
}
