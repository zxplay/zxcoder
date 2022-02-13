import Module from "bas2tap";

export function bas2tap(input) {
    return new Promise((resolve, reject) => {
        Module({
            'input': input,
            'resolve': resolve,
            'arguments': ['input.bas', 'output.tap', '-a']
        });
    });
}
