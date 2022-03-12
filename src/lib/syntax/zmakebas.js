import * as CodeMirror from "codemirror"

// Based on pascal mode available in the CodeMirror repository:
// https://github.com/codemirror/CodeMirror/blob/master/mode/pascal/pascal.js
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// noinspection JSUnresolvedFunction
CodeMirror.defineMode("zmakebas", function() {

    // noinspection JSCheckFunctionSignatures
    const keywords = new Set([
        "ABS",
        "ACS",
        "AND",
        "ASN",
        "AT",
        "ATN",
        "ATTR",
        "BEEP",
        "BIN",
        "BORDER",
        "BRIGHT",
        "CAT",
        "CHR$",
        "CIRCLE",
        "CLEAR",
        "CLOSE",
        "CLOSE#",
        "CLS",
        "CODE",
        "CONTINUE",
        "COPY",
        "COS",
        "DATA",
        "DEF",
        "DEFFN",
        "DIM",
        "DRAW",
        "ERASE",
        "EXP",
        "FLASH",
        "FN",
        "FOR",
        "FORMAT",
        "GO",
        "GOSUB",
        "GOTO",
        "IF",
        "IN",
        "INK",
        "INKEY$",
        "INPUT",
        "INT",
        "INVERSE",
        "LEN",
        "LET",
        "LINE",
        "LIST",
        "LLIST",
        "LN",
        "LOAD",
        "LPRINT",
        "MERGE",
        "MOVE",
        "NEW",
        "NEXT",
        "NOT",
        "OPEN",
        "OPEN#",
        "OR",
        "OUT",
        "OVER",
        "PAPER",
        "PAUSE",
        "PEEK",
        "PI",
        "PLAY",
        "PLOT",
        "POINT",
        "POKE",
        "PRINT",
        "RANDOMISE",
        "RANDOMIZE",
        "READ",
        "REM",
        "RESTORE",
        "RETURN",
        "RND",
        "RUN",
        "SAVE",
        "SCREEN$",
        "SGN",
        "SIN",
        "SPECTRUM",
        "SQR",
        "STEP",
        "STOP",
        "STR$",
        "TAB",
        "TAN",
        "THEN",
        "TO",
        "USR",
        "VAL",
        "VAL$",
        "VERIFY",
    ])

    // TODO: Are there any atom values to add here?
    // noinspection JSCheckFunctionSignatures
    const atoms = new Set([])

    // TODO: Operators characters to be verified.
    const isOperatorChar = /[+\-*&%=<>!?|\/]/

    function initialTokeniser(stream, state) {

        // noinspection JSValidateTypes
        const c = stream.next()

        if (c === "#") {
            stream.skipToEnd()
            return "comment"
        }

        if (c === '"' || c === "'") {
            state.tokeniser = getStringTokeniser(c)
            return state.tokeniser(stream, state)
        }

        if (/\d/.test(c)) {
            stream.eatWhile(/[\w.]/)
            return "number"
        }

        if (isOperatorChar.test(c)) {
            stream.eatWhile(isOperatorChar)
            return "operator"
        }

        stream.eatWhile(/[\w$_]/)

        const token = stream.current().toUpperCase()
        if (keywords.has(token)) {
            switch (token) {
                case 'REM':
                    // If keyword is 'REM' the rest of the line is a comment.
                    state.tokeniser = getCommentTokeniser()
                    return "keyword"
                case 'OPEN':
                case 'CLOSE':
                    // If keyword is 'OPEN' or 'CLOSE' it is followed by '#'.
                    state.tokeniser = getOpenCloseTokeniser();
                    return "keyword"
                default:
                    return "keyword"
            }
        }

        if (atoms.has(token)) {
            return "atom"
        }

        return "variable"
    }

    function getOpenCloseTokeniser() {
        return function(stream, state) {
            // noinspection JSValidateTypes
            const next = stream.next()
            state.tokeniser = null
            return next === '#' ? "keyword" : null
        }
    }

    function getCommentTokeniser() {
        return function(stream, state) {
            stream.skipToEnd()
            state.tokeniser = null
            return "comment"
        }
    }

    function getStringTokeniser(quote) {
        return function(stream, state) {
            let escaped = false, next, end = false

            // noinspection JSValidateTypes
            while ((next = stream.next()) != null) {
                if (next === quote && !escaped) {
                    end = true; break
                }

                escaped = !escaped && next === "#"
            }

            if (end || !escaped) {
                state.tokeniser = null
            }

            return "string"
        }
    }

    return {
        startState: function() {
            return {tokeniser: null}
        },
        token: function(stream, state) {
            if (stream.eatSpace()) {
                return null
            }

            const getNextToken = state.tokeniser || initialTokeniser

            return getNextToken(stream, state)
        }
    }
})

// noinspection JSUnresolvedFunction
CodeMirror.defineMIME("text/x-zmakebas", "zmakebas")
