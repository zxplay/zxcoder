import React, {Fragment, useEffect} from "react";
import "../runtime/jsspeccy";
import {ImageButton, SingleWindow} from "../canvasgui/canvasgui";

export default function App() {

    useEffect(() => {

        // _: [space]        space
        // e: [enter]        enter
        // c: [caps   shift] shift
        // s: [symbol shift] ctrl
        //
        const keyCodes = {
            '0': 48, '1': 49, '2': 50, '3': 51, '4': 52,
            '5': 53, '6': 54, '7': 55, '8': 56, '9': 57,
            A: 65, B: 66, C: 67, D: 68, E: 69,
            F: 70, G: 71, H: 72, I: 73, J: 74,
            K: 75, L: 76, M: 77, N: 78, O: 79,
            P: 80, Q: 81, R: 82, S: 83, T: 84,
            U: 85, V: 86, W: 87, X: 88, Y: 89,
            Z: 90, e: 13, c: 16, s: 17, _: 32,
        };

        const imgExceptions = {
            e: 'ENT',
            c: 'CAP',
            s: 'SYM',
            _: 'SPC',
        }

        class MyImageButton extends ImageButton {
            constructor(parent, x, y, w, h, suffix, keyCode) {
                super(parent, x, y, w, h, 'img/key' + suffix + '.png', 'img/keyNONE.png');
                this.keyCode = keyCode;

                this.on_begin = this.on_enter = function () {
                    simulateKey(keyCode, 'down');
                }

                this.on_end = this.on_leave = function () {
                    simulateKey(keyCode, 'up');
                }
            }
        }

        /**
         * Simulate a key event.
         * @param {Number} keyCode The keyCode of the key to simulate
         * @param {String} type (optional) The type of event : down, up or press. The default is down
         */
        function simulateKey(keyCode, type) {
            let evtName = (typeof (type) === "string") ? "key" + type : "keydown";

            let event = document.createEvent("HTMLEvents");
            event.initEvent(evtName, true, false);
            event.keyCode = keyCode;

            document.dispatchEvent(event);
        }

        const emuParams = {
            zoom: 3,
            sandbox: true,
            autoLoadTapes: true,
        };

        let keystr = '1234567890,QWERTYUIOP,ASDFGHJKLe,cZXCVBNMs_';
        // let keystr = '-W-P,ASDe,123456789M';    // snake
        // let keystr = 'GH-e,OP-Z';    // manic miner
        // let keystr = 'OPeZ'; // manic miner simple

        let doFilter = false;

        const url = new URL(window.location.href);
        for (const [key, value] of url.searchParams) {
            if (key === 'm') {
                if (value === '48' || value === '128' || value === '5') {
                    emuParams.machine = value;
                }
            } else if (key === 'k') {
                keystr = value;
            } else if (key === 'u') {
                emuParams.openUrl = value;
            } else if (key === 'f') {
                if (value && value !== '0') {
                    doFilter = true;
                }
            }
            // console.log(key, value);
        }

        window.emu = JSSpeccy(document.getElementById('jsspeccy'), emuParams);
        if (doFilter) {
            document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
        }

        const width = 960;
        let height = 0;

        const btnrows = [];

        const keyrows = keystr.split(',');
        for (let j = 0; j < keyrows.length; j++) {
            const keyrow = keyrows[j];
            let rowlen = keyrow.length;
            if (rowlen === 0) continue;
            if (rowlen > 10) rowlen = 10;
            const d = width / rowlen;
            const btnrow = {d: d, chs: []};
            for (let i = 0; i < rowlen; i++) {
                let ch = keyrow.charAt(i);
                if (!(ch in keyCodes)) {
                    ch = '-';
                }
                btnrow.chs.push(ch);
            }
            btnrows.push(btnrow);
            height += d;
        }

        // console.log(btnrows)

        const win = new SingleWindow('virtkeys');
        win.setTargetSize(width, height);

        let x = 0;
        let y = 0;
        for (let j = 0; j < btnrows.length; j++) {
            const btnrow = btnrows[j];
            const d = btnrow.d;
            x = 0;
            for (let i = 0; i < btnrow.chs.length; i++) {
                const ch = btnrow.chs[i];
                if (ch === '-') {
                    new ImageButton(win, x, y, d, d, 'img/keyNONE.png', 'img/keyNONE.png');
                } else {
                    let suffix = ch;
                    if (suffix in imgExceptions) {
                        suffix = imgExceptions[ch];
                    }
                    let code = keyCodes[ch];
                    new MyImageButton(win, x, y, d, d, suffix, code);
                    // console.log(x, y, d, d, suffix, code);
                }
                x += d;
            }
            y += d;
        }

        win._onload();
    }, []);

    return (
        <Fragment>
            <div id="jsspeccy"/>
            <div id="guiparent">
                <canvas id="virtkeys" width="960"/>
            </div>
        </Fragment>
    )
}
