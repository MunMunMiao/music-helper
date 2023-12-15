'use client'

import React from 'react'
import { Navbar, NavbarContent, NavbarItem, Link } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

const menu = [
    {
        name: 'Cover',
        href: '/cover'
    },
    {
        name: 'Lyric',
        href: '/lyric'
    }
]

export function Header() {
    const pathname = usePathname()

    return (
        <Navbar>
            <NavbarContent className="hidden gap-4 sm:flex" justify="start">
                {
                    menu.map(({name, href}, index) => (
                        <NavbarItem key={index} isActive={pathname.startsWith(href)}>
                            <Link color="foreground" href={href}>{name}</Link>
                        </NavbarItem>
                    ))
                }
            </NavbarContent>
        </Navbar>
    )
}
