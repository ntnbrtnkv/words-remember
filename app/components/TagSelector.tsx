import React, {useEffect, useRef} from 'react';

import type {Tag} from "@prisma/client";
import {useFetcher} from "@remix-run/react";


export default function TagSelector() {
    const fetcher = useFetcher<Tag[]>();

    useEffect(() => {
        if (fetcher.type === "init") {
            fetcher.load('/tags');
        }
    }, [fetcher]);

    return (
        <fetcher.Form method="post" action="/tags">
            <input type="text" list="tags" name="tags"/>
            <datalist id="tags">
                {fetcher.data?.map(tag => (
                    <option key={tag.id} value={tag.name}>{tag.name}</option>
                ))}
            </datalist>
        </fetcher.Form>
    )
}