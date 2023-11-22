'use client';

import { RadioGroup, Radio } from '@nextui-org/radio'
import { useState } from 'react'

type Source = 'Bugs' | 'AppleMusic'

function SourceSelect() {
    const [source, setSource] = useState<Source>('Bugs')

    return (
        <RadioGroup label="Select your source" value={source} onValueChange={v => setSource(v as Source)} orientation="horizontal">
            <Radio value="Bugs">Bugs</Radio>
            <Radio value="AppleMusic">Apple Music</Radio>
        </RadioGroup>
    )
}

export default function Page() {
    return (
        <div className="container mx-auto">
            <SourceSelect />
            <div>我是封面</div>
        </div>
    )
}
