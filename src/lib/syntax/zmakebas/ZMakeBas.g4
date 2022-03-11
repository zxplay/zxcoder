// Grammar based on public domain LittleBasic (https://github.com/mateiw/littlebasic)

grammar ZMakeBas;

prog: block EOF;

statement
    : letstmt
    | printstmt
    | inputstmt
    | ifstmt
    | forstmt
    | whilestmt
    | repeatstmt
    | continuestmt
    | exitstmt
    | COMMENT
    ;

block
    : (statement (NEWLINE+ | EOF))*
    ;

letstmt
    : LET? vardecl EQ expression
    ;

vardecl
    : varname varsuffix?
    ;

varname
    : ID
    ;

varsuffix
    : DOLLAR
    ;

printstmt
    : PRINT expression;

inputstmt
    : INPUT string vardecl
    ;

ifstmt
    : IF expression NEWLINE* THEN NEWLINE+ block elifstmt* elsestmt? END
    ;

elifstmt
    : ELSE IF expression NEWLINE* THEN NEWLINE+ block
    ;

elsestmt
    : ELSE NEWLINE+ block
    ;

forstmt
    : FOR vardecl EQ expression TO expression (STEP expression)? NEWLINE+ block NEXT
    ;

whilestmt
    : WHILE expression NEWLINE+ block END
    ;

repeatstmt
    : REPEAT NEWLINE+ block NEWLINE* UNTIL expression
    ;

continuestmt
    : CONTINUE
    ;

exitstmt
    : EXIT
    ;

expression
    : string                                    # StringExpr
    | number                                    # NumberExpr
    | func                                      # FuncExpr
    | id                                        # IdExpr
    | (LPAREN expression RPAREN)                # ParenExpr
    | expression op=(MUL|DIV|MOD) expression    # MulDivExpr
    | expression op=(ADD|SUB) expression        # AddSubExpr
    | expression op=(GTE|GT|LTE|LT|EQ|NEQ) expression   # RelExpr
    | NOT expression                            # NotExpr
    | expression AND expression                 # AndExpr
    | expression OR expression                  # OrExpr
    | <assoc=right> expression EXP expression   # ExpExpr
    ;

func
    : lenfunc
    | valfunc
    | isnanfunc
    ;

string
    : STRINGLITERAL
    ;

number
    : NUMBER
    ;

id
    : ID
    ;

lenfunc
    : LEN LPAREN expression RPAREN
    ;

valfunc
    : VAL LPAREN expression RPAREN
    ;

isnanfunc
    : ISNAN LPAREN expression RPAREN
    ;

// Operators
MUL : '*' ;
DIV : '/' ;
ADD : '+' ;
SUB : '-' ;
EXP : '^' ;
MOD : M O D ;

// Logical
NEQ : '<>' ;
GTE : '>=' ;
LTE : '<=' ;
GT  : '>' ;
LT  : '<' ;
EQ  : '=' ;

// Relational
AND : A N D ;
OR  : O R ;
NOT : N O T ;

// Other
COMMA  : ',' ;
LPAREN : '(' ;
RPAREN : ')' ;

// Functions
LEN      : L E N ;
VAL      : V A L ;
ISNAN    : I S N A N ;

// Keywords
PRINT    : P R I N T ;
INPUT    : I N P U T ;
LET      : L E T ;
REM      : R E M ;
IF       : I F ;
THEN     : T H E N ;
ELSE     : E L S E ;
END      : E N D;
FOR      : F O R ;
WHILE    : W H I L E ;
REPEAT   : R E P E A T ;
UNTIL    : U N T I L ;
STEP     : S T E P ;
NEXT     : N E X T ;
TO       : T O ;
CONTINUE : C O N T I N U E ;
EXIT     : E X I T ;

// Comments
COMMENT : REM ~[\r\n]* ;

// Literals
ID            : [a-zA-Z]+ ; // Identifiers
NUMBER        : [0-9]+ ('.' [0-9]+)?; // Integers
STRINGLITERAL : '"' ~ ["\r\n]* '"' ;
DOLLAR        : '$' ;
NEWLINE       : '\r'? '\n' ; // Newlines end statement
WS            : [ \t]+ -> skip ; // Ignore whitespace

/* Lexer fragments */
fragment A:('a'|'A');
fragment B:('b'|'B');
fragment C:('c'|'C');
fragment D:('d'|'D');
fragment E:('e'|'E');
fragment F:('f'|'F');
fragment G:('g'|'G');
fragment H:('h'|'H');
fragment I:('i'|'I');
fragment J:('j'|'J');
fragment K:('k'|'K');
fragment L:('l'|'L');
fragment M:('m'|'M');
fragment N:('n'|'N');
fragment O:('o'|'O');
fragment P:('p'|'P');
fragment Q:('q'|'Q');
fragment R:('r'|'R');
fragment S:('s'|'S');
fragment T:('t'|'T');
fragment U:('u'|'U');
fragment V:('v'|'V');
fragment W:('w'|'W');
fragment X:('x'|'X');
fragment Y:('y'|'Y');
fragment Z:('z'|'Z');
