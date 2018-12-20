import assert from 'assert';
import {makeTable} from '../src/js/code-analyzer';

describe('regular function', () => {
    it('is parsing an empty code correctly', () => {
        assert.equal(
            JSON.stringify(makeTable('""','function foo(){}')),
            '"<tr><td>function foo(){</td></tr><tr><td>}</td></tr>"'
        );
    });
});

describe('regular function', () => {
    it('is parsing an empty code correctly', () => {
        assert.equal(
            JSON.stringify(makeTable('""','function foo(){}')),
            '"<tr><td>function foo(){</td></tr><tr><td>}</td></tr>"'
        );
    });
});


describe('regular function', () => {
    it('is parsing an empty code correctly', () => {
        assert.equal(
            JSON.stringify(makeTable('"x=1,y=2,z=3"','function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b < z) {c = c + 5;return x + y + z + c;}}')),
            '"<tr><td>function foo(x,y,z){</td></tr><tr bgcolor="red"><td>&nbsp;&nbsp;&nbsp;if(x + 1 + y < z ){</td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + 5);</td></tr><tr><td>&nbsp;&nbsp;&nbsp;}</td></tr><tr><td>}</td></tr>"'
        );
    });
});







