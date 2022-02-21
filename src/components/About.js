import React from "react";
import {Card} from "primereact/card";

export default function About() {
    return (
        <Card className="m-2">
            <h1>About This Website</h1>
            <p>
                A ZX Spectrum emulator & programming environment for the browser.
            </p>
            <p>
                This site is a work in progress.
                Source available <a href="https://github.com/stever/zxplay" target="_blank">here</a>.
            </p>
            <p>
                Based on <a href="https://github.com/gasman/jsspeccy3" target="_blank">JSSpeccy3</a>.
            </p>
            <h2>Sinclair ROM Copyright Permission</h2>
            <blockquote>
                Amstrad have kindly given their permission for the
                redistribution of their copyrighted material but retain that copyright.
            </blockquote>
            <a href="https://worldofspectrum.net/assets/amstrad-roms.txt" target="_blank">comp.sys.sinclair</a> 1999-08-31
        </Card>
    )
}
