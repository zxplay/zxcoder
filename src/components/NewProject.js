import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {createNewProject} from "../redux/actions/project";

export default function NewProject() {
    const dispatch = useDispatch();
    const projectType = useSelector(state => state?.project.type);
    const [title, setTitle] = useState('');

    let lang;

    switch (projectType) {
        case 'asm':
            lang = 'Z80 Assembler';
            break;
        case 'basic':
            lang = 'Sinclair BASIC';
            break;
        case 'zxbasic':
            lang = 'Boriel ZX BASIC';
            break;
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
                            dispatch(createNewProject(title));
                        }
                    }}
                />
            </div>
            <Button
                label="Create Project"
                onClick={() => dispatch(createNewProject(projectType, title))}
            />
        </Card>
    )
}
