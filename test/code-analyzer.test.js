import assert from 'assert';
import {parseCode,getElementFromParseCode,createTable} from '../src/js/code-analyzer';


describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });

});

describe('Check functions', () => {
    it('check function declaration', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('function binarySearch(X, V, n){\n}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>function declaration</td><td>binarySearch</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>X</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>V</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>n</td><td></td><td></td></tr>'
        );
    });
});

describe('check variable declaration', () => {
    it('check variable declaration without value', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('let low, high, mid;'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>variable declaration</td><td>low</td><td></td><td>null</td></tr><tr><td>1</td><td>variable declaration</td><td>high</td><td></td><td>null</td></tr><tr><td>1</td><td>variable declaration</td><td>mid</td><td></td><td>null</td></tr>'
        );
    });
    it('check variable declaration with value', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('let x = 0;'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>variable declaration</td><td>x</td><td></td><td>0</td></tr>'
        );
    });
});

describe('check variable declaration2', () => {
    it('check variable declaration with value', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('let temp = arr[j];'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>variable declaration</td><td>temp</td><td></td><td>arr[j]</td></tr>'
        );
    });
});

describe('check while', () => {
    it('check while statement', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('while (low <= high) {\n' +
                '}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>while statement</td><td></td><td>low <= high</td><td></td></tr>'
        );
    });

});

describe('check if and else', () => {
    it('check if and else statement', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('if (X < V[mid]){\n' +
                'high = mid - 1;\n' +
                '}else if (X > V[mid]){\n' +
                'low = mid + 1;\n' +
                '}else{\n' +
                '   mid=0;\n' +
                '}       \n'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>if statement</td><td></td><td>X < V[mid]</td><td></td></tr><tr><td>2</td><td>assignment expression</td><td>high</td><td></td><td>mid-1</td></tr><tr><td>3</td><td>else if statement</td><td></td><td>X > V[mid]</td><td></td></tr><tr><td>4</td><td>assignment expression</td><td>low</td><td></td><td>mid+1</td></tr><tr><td>5</td><td>else statement</td><td></td><td></td><td></td></tr><tr><td>6</td><td>assignment expression</td><td>mid</td><td></td><td>0</td></tr>'
        );
    });

});

describe('check return', () => {
    it('check return statement', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('function binarySearch(X, V, n){return -1;}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>function declaration</td><td>binarySearch</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>X</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>V</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>n</td><td></td><td></td></tr><tr><td>2</td><td>return statement</td><td></td><td></td><td>-1</td></tr>'
        );
    });

    it('check return statement', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('function foo(){\n' +
                'return;\n' +
                '}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>function declaration</td><td>foo</td><td></td><td></td></tr><tr><td>2</td><td>return statement</td><td></td><td></td><td></td></tr>'
        );
    });

});

describe('check for', () => {
    it('check for statement in init variableDeclaration with value in update updateExpression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('for(let i =0; i<10; i++){}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>for statement</td><td></td><td>i < 10</td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>i</td><td></td><td>0</td></tr><tr><td>1</td><td>UpdateExpression</td><td>i++</td><td></td><td></td></tr>'
        );
    });
    it('check for statement in init AssignmentExpression in update AssignmentExpression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('for(i =0; i<10; i=2){}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>for statement</td><td></td><td>i < 10</td><td></td></tr><tr><td>1</td><td>AssignmentExpression</td><td>i</td><td></td><td>0</td></tr><tr><td>1</td><td>AssignmentExpression</td><td>i</td><td></td><td>2</td></tr>'
        );
    });
});

describe('check for continue', () => {
    it('check for statement in init variableDeclaration without value in update updateExpression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('for(let i; i<10; i++){}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>for statement</td><td></td><td>i < 10</td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>i</td><td></td><td>null</td></tr><tr><td>1</td><td>UpdateExpression</td><td>i++</td><td></td><td></td></tr>'
        );
    });
    it('check for statement in init in type else', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('for(i; i<10; i++){}'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>for statement</td><td></td><td>i < 10</td><td></td></tr><tr><td>1</td><td>Identifier</td><td>i</td><td></td><td></td></tr><tr><td>1</td><td>UpdateExpression</td><td>i++</td><td></td><td></td></tr>'
        );
    });
});

describe('check member', () => {
    it('check member expression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('V[mid] = 0'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>assignment expression</td><td>V[mid]</td><td></td><td>0</td></tr>'
        );
    });

});

describe('check unary', () => {
    it('check unary expression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('j = -j'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>assignment expression</td><td>j</td><td></td><td>-j</td></tr>'
        );
    });

});

describe('check assignment', () => {
    it('check assignment expression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('low = 0;'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>assignment expression</td><td>low</td><td></td><td>0</td></tr>'
        );
    });

});

describe('check binary', () => {
    it('check binary expression', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('mid = (low + high)/2;'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>assignment expression</td><td>mid</td><td></td><td>(low+high)/2</td></tr>'
        );
    });

});

describe('check update', () => {
    it('check update Handel', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('h  = --h;'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>assignment expression</td><td>h</td><td></td><td>--h</td></tr>'
        );
    });

});

describe('check binary', () => {
    it('check binary right', () => {
        assert.equal(
            createTable(getElementFromParseCode(parseCode('mid = 2*(low + high);'))),
            '<tr><th> Line </th><th> Type </th><th> Name </th><th> Condition </th><th> Value </th></tr><tr><td>1</td><td>assignment expression</td><td>mid</td><td></td><td>2*(low+high)</td></tr>'
        );
    });

});







