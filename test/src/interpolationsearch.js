import test from 'ava';
import * as search from '../../src';


import util from "util" ;
import * as array from "@aureooms/js-array" ;
import * as random from "@aureooms/js-random" ;

var check = function(ctor, n, diff) {
	var name = util.format("interpolationsearch (new %s(%d), %s)", ctor.name, n, diff);
	test(name, t => {

		// ALIASES
		var randint = random.randint;

		var copy = array.copy;

		var interpolationsearch = search.interpolationsearch;

		// SETUP REF ARRAY
		var ref = new ctor(n);
		for(var j = 0; j < n; ++j) ref[j] = randint(0, n);
		Array.prototype.sort.call ( ref, diff );

		// SETUP TEST ARRAY
		var a = new ctor(n);
		copy(ref, 0, n, a, 0);

	// TEST SEARCH
		var i = a.length;

		if(i > 0){
			// CHECK > OUTER BOUND
			var s = interpolationsearch( diff, a, 0, n, n);
			t.deepEqual(s[0], 0, 'not found ' + n);
			var x = (n * (diff(-1, 0) < 0));
			t.deepEqual(s[1], x, 'where === ' + x);

			// CHECK BODY
			while (i--) {
				s = interpolationsearch( diff, a, 0, n, a[i]);
				t.deepEqual(s[0], 1, 'find  a[' + i + ']');
				t.deepEqual(a[s[1]], a[i], 'val  === ' + a[i]);
			}

			// CHECK < OUTER BOUND
			s = interpolationsearch( diff, a, 0, n, -1);
			t.deepEqual(s[0], 0, 'not found -1');
			x = (n * (diff(-1, 0) > 0));
			t.deepEqual(s[1], x, 'where === ' + x);
		}
		else{
			var s = interpolationsearch( diff, a, 0, n, -1);
			t.deepEqual(s[0], 0, 'not found -1');
			t.deepEqual(s[1], 0, 'where === ' + 0);
		}


		// CHECK NOT MODIFIED
		t.deepEqual(a.length, n, 'length check');

		var notmodified = true;
		i = a.length;
		while(i--){
			if(a[i] !== ref[i]){
				notmodified = false;
				break;
			}
		}

		t.truthy(notmodified, 'not modified check');
	});
};

var DIFF = [
	function(a, b){ return a - b; },
	function(a, b){ return b - a; }
];

var N = [0, 1, 2, 10, 31, 32, 33];

var CTOR = [
	Array,
	Int8Array,
	Uint8Array,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
];

for (var k = 0; k < CTOR.length; k++) {
	for (var j = 0; j < N.length; j++) {
		if(CTOR[k].BYTES_PER_ELEMENT &&
			N[j] > Math.pow(2, CTOR[k].BYTES_PER_ELEMENT * 8)){
				continue;
		}
		for (var i = 0; i < DIFF.length; ++i) {
			check(CTOR[k], N[j], DIFF[i]);
		}
	}
}

