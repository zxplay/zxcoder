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
                Source available <a href="https://github.com/zxplay/zxplay" target="_blank">here</a>.
            </p>
            <h2>Acknowledgements</h2>
            <p>
                Based on <a href="https://github.com/gasman/jsspeccy3" target="_blank">JSSpeccy3</a>
                <span> &amp; </span>
                <a href="https://github.com/dcrespo3d/jsspeccy3-mobile" target="_blank">JSSpeccy3-mobile</a>.
                These are licensed under terms of the GPL version 3 -
                see <a href="https://github.com/gasman/jsspeccy3/blob/main/COPYING" target="_blank">COPYING</a>.
            </p>
            <p>
                Uses <a href="" target="_blank">Pasmo</a> by Julian Albo García, alias "NotFound", to compile assembly.
                Licensed under terms of the GPL version 3 -
                see <a href="https://github.com/zxplay/pasmo/blob/main/COPYING" target="_blank">COPYING</a>.
            </p>
            <p>
                Uses <a href="https://github.com/boriel/zxbasic" target="_blank">Boriel ZX BASIC</a> by Jose Rodriguez.
                Licensed under terms of the GPL version 3 -
                see <a href="https://github.com/boriel/zxbasic/blob/master/LICENSE.txt" target="_blank">LICENSE</a>.
            </p>
            <p>
                Uses <a href="https://github.com/zxplay/zmakebas" target="_blank">zmakebas</a> to
                convert Sinclair BASIC to tape file sent to the ZX Spectrum emulator.
                This is public domain by Russell Marks.
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
