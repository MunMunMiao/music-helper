'use client'

import { Tabs, Tab } from '@nextui-org/tabs'
import { Bugs } from '@/components/cover/bugs'
import { AppleMusic } from '@/components/cover/apple_music'

export default function Page() {
    return (
        <div className="container mx-auto p-4">
            <Tabs>
                <Tab title="Bugs">
                    <Bugs />
                </Tab>
                <Tab title="Apple Music">
                    <AppleMusic />
                </Tab>
            </Tabs>
        </div>
    )
}
