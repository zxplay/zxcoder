import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import {BasicEditor} from "./BasicEditor";
import {AssemblyEditor} from "./AssemblyEditor";
import {Emulator} from "./Emulator";
import {setSelectedTabIndex} from "../redux/actions/jsspeccy";

export function MainCode() {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state?.jsspeccy.selectedTabIndex);
    const zoom = 2;
    const width = zoom * 320;

    return (
        <div className="grid"
             style={{width: "100%", padding: 0, margin: 0}}>
            <div className="col" style={{padding: 0}}>

            </div>
            <div className="col-fixed"
                 style={{width: `${width}px`, padding: '4px 0 0 0'}}>
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => dispatch(setSelectedTabIndex(e.index))}>
                    <TabPanel header="Emulator">
                        <Emulator zoom={zoom} width={width}/>
                    </TabPanel>
                    <TabPanel header="Sinclair Basic">
                        <BasicEditor code={'10 PRINT "Hello"\n20 GO TO 10'}/>
                    </TabPanel>
                    <TabPanel header="Z80 Assembler">
                        <AssemblyEditor code={asm}/>
                    </TabPanel>
                </TabView>
            </div>
            <div className="col" style={{padding: 0}}>

            </div>
        </div>
    )
}

const asm = `    org 30000

tv_flag    equ 5C3Ch

start
    ; Directs rst 10h output to main screen.
    xor a
    ld (tv_flag),a

    ld b, 50

another

    push bc

    ld hl,hello
again    ld a,(hl)
    cp 0
    jr z, exit
    push hl
    rst 10h
    pop hl
    inc hl
    jr again

exit
    pop bc
    djnz another
    ret

hello    db "Hello, world.", 0Dh, 0

    end start`;
