import React, {useState} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {createNewProject} from "../redux/project/project";

export default function ProjectNew(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');

    let lang;

    switch (props.type) {
        case 'asm':
            lang = 'Z80 Assembler (Pasmo)';
            break;
        case 'basic':
            lang = 'Sinclair BASIC (zmakebas)';
            break;
        case 'c':
            lang = 'C (z88dk)';
            break;
        case 'sdcc':
            lang = 'C (SDCC)';
            break;
        case 'zmac':
            lang = 'Z80 Assembler (zmac)';
            break;
        case 'zxbasic':
            lang = 'Boriel ZX BASIC';
            break;
        default:
            throw `unexpected case: ${props.type}`;
    }

    return (
        <Card className="m-2">
            <h1>New {lang} Project</h1>
            <h3>Project Name</h3>
            <div className="field">
                <InputText
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus={true}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            dispatch(createNewProject(props.type, title));
                        }
                    }}
                />
            </div>
            <Button
                label="Create Project"
                onClick={() => dispatch(createNewProject(props.type, title))}
            />
        </Card>
    )
}

ProjectNew.propTypes = {
    type: PropTypes.string.isRequired,
}
