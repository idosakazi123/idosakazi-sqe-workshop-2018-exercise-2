import assert from 'assert';
import {makeTable} from '../src/js/code-analyzer';

describe('regular function', () => {
    it('just function', () => {
        assert.equal(
            JSON.stringify(makeTable('""','function foo(){}')),
            '"<tr><td>function foo(){</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with condition if', () => {
    it('just if', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1,y=2,z=3','function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '}\n' +
                '\n' +
                '}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor=#FF0000><td>&nbsp;&nbsp;&nbsp;if(x + 1 + y < z ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + 5);</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with if', () => {
    it('if return true', () => {
        assert.equal(
            JSON.stringify(makeTable('""','function foo(){\n' +
                'let a =3;\n' +
                'if(a>2){\n' +
                'return true;\n' +
                '}\n' +
                '}')),
            '"<tr><td>function foo(){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(3 > 2 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return true;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with condition if else if and else', () => {
    it('if else if and else', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1,y=2,z=3','function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b < z) {c = c + 5;return x + y + z + c;} else if (b < z * 2) {c = c + x + 5;return x + y + z + c;} else {c = c + z + 5;return x + y + z + c;}}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor=#FF0000><td>&nbsp;&nbsp;&nbsp;if(x + 1 + y < z ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + 5);</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;}else if(x + 1 + y < z * 2){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + x + 5);</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}else{</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + z + 5);</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with while', () => {
    it('while return true', () => {
        assert.equal(
            JSON.stringify(makeTable('""','function foo(){\n' +
                'let a =4;\n' +
                'while(a>2){\n' +
                'a--;\n' +
                '}\n' +
                'return true;\n' +
                '}')),
            '"<tr><td>function foo(){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;while(4 > 2){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return true;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with condition while green', () => {
    it('while green', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1,y=2,z=3','function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;while(x + 1 < z){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z=((x + 1) + (x + 1 + y)) * 2;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return z;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with condition while', () => {
    it('while red', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1,y=2,z=1','function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor=#FF0000><td>&nbsp;&nbsp;&nbsp;while(x + 1 < z){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z=((x + 1) + (x + 1 + y)) * 2;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return z;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with condition while and  if', () => {
    it('while red and  if green', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1,y=2,z=1','function foo(x, y, z){\n let a = x + 1;\n    let b = a + y;\nlet c = b +2;\n\nwhile (a < z) {\nif(c>3){\nc = a + b;\nz = c * 2;\n}\n\n}\n\nreturn z;\n}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor=#FF0000><td>&nbsp;&nbsp;&nbsp;while(x + 1 < z){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(x + 1 + y + 2 > 3 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z=((x + 1) + (x + 1 + y)) * 2;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return z;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with condition if', () => {
    it('if in if', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1,y=2,z=1','function foo(x, y, z){\nlet a = x + 1;\nlet b = a + y;\nlet c = b +2;\n\nif (a < z) {\nif(c>3){\nc = a + b;\nz = c * 2;\n}\n\n}\n\nreturn z;\n}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor=#FF0000><td>&nbsp;&nbsp;&nbsp;if(x + 1 < z ){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(x + 1 + y + 2 > 3 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z=((x + 1) + (x + 1 + y)) * 2;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return z;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with array', () => {
    it('if in if', () => {
        assert.equal(
            JSON.stringify(makeTable('x = [1,2,3]','function foo(x){\n' +
                '    let a = x[0] + 1;\n' +
                '    let b = x[2] + 3;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b > a) {\n' +
                '        c= x[1]\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(x[2] + 3 > x[0] + 1 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c=x[1];</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return x[1];</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with array', () => {
    it('array green', () => {
        assert.equal(
            JSON.stringify(makeTable('x = [1,2,3]','function foo(x){\n' +
                '    let a = x[0] + 1;\n' +
                '    let b = x[2] + 3;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b > a) {\n' +
                '        c= x[1]\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(x[2] + 3 > x[0] + 1 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c=x[1];</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return x[1];</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with array', () => {
    it('array red', () => {
        assert.equal(
            JSON.stringify(makeTable('x = [1,2,3]','function foo(x){let a = x[2] + 1;let b = x[0] + 3;let c = 0;if (b > a) {c= x[1]}return c;}')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#FF0000><td>&nbsp;&nbsp;&nbsp;if(x[0] + 3 > x[2] + 1 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c=x[1];</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return x[1];</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with array boolean', () => {
    it('boolean is green', () => {
        assert.equal(
            JSON.stringify(makeTable('x = [true,false]','function foo(x){\n' +
                '    let c =10;\n' +
                '    if (x[0]) {\n' +
                '        c= 100;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(x[0] ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c=100;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return 100;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with if', () => {
    it('if variable deceleration', () => {
        assert.equal(
            JSON.stringify(makeTable('x=1','function foo(x){let c =10;if (x>0) {let a= 100;c = a}return c;}')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(x > 0 ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c=100;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return 100;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with array and global var', () => {
    it('array and golbal var', () => {
        assert.equal(
            JSON.stringify(makeTable('x[1]','let a = 10;\nfunction foo(x){\n\nreturn a + x[0];\n}')),
            '"<tr><td>function foo(x){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return (a) + x[0];</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('function with if an local variable', () => {
    it('assignment variable in if ', () => {
        assert.equal(
            JSON.stringify(makeTable('x=[3,5]','function foo(x){\n' +
                'let a = x[1];\n' +
                'let b = x[0];\n' +
                'if(a>b){\n' +
                'a=b;\n' +
                '}\n' +
                'return a;\n' +
                '\n' +
                '}\n')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(x[1] > x[0] ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a=x[0];</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return x[0];</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('assignment of global variable', () =>     {
    it('global variable', () => {
        assert.equal(
            JSON.stringify(makeTable('""','function foo(x){\n' +
                'let a =4;\n' +
                'while(a>2){\n' +
                ' x = x + x + a +1\n' +
                '}\n' +
                'return x;\n' +
                '}')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;while(4 > 2){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x=(x) + (x) + (4) + 1;</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>&nbsp;&nbsp;&nbsp;return x;</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('check array', () => {
    it('array with boolean and numbers', () => {
        assert.equal(
            JSON.stringify(makeTable('x = [true,2,4]','function foo(x){let a =4;if(x[0]){a = x[1] + a +x[2];return a;}}')),
            '"<tr><td>function foo(x){</td></tr><tr bgcolor=#00FF00><td>&nbsp;&nbsp;&nbsp;if(x[0] ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x[1] + 4 + x[2];</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>}</td></tr>"'
        );
    });
});














