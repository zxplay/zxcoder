import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {createNewProject} from "../redux/actions/project";

export default function NewProject() {
    const dispatch = useDispatch();
    const projectType = useSelector(state => state?.project.type);
    const [name, setName] = useState('');

    let title;

    switch (projectType) {
        case 'asm':
            title = 'Z80 Assembler';
            break;
        case 'basic':
            title = 'Sinclair BASIC';
            break;
        case 'zxbasic':
            title = 'Boriel ZX BASIC';
            break;
    }

    return (
        <Card className="m-2">
            <h1>New {title} Project</h1>
            <h3>Project Name</h3>
            <div className="field">
                <InputText
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus={true}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            dispatch(createNewProject(projectType, name));
                        }
                    }}
                />
            </div>
            <Button
                label="Create Project"
                onClick={() => dispatch(createNewProject(projectType, name))}
            />
        </Card>
    )
}
