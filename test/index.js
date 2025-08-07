const assert = require('assert');
const splitDo = require('../');

async function test1() {
  const input = Array.from({ length: 15 }, (_, i) => i + 1);
  const expected = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
  ];
  const chunks = [];
  const result = splitDo(input.slice(), 3, segment => chunks.push(segment));
  assert.strictEqual(result, undefined);
  assert.strictEqual(chunks.length, expected.length);
  assert.deepStrictEqual(chunks, expected);
}

async function test2() {
  const input = Array.from({ length: 14 }, (_, i) => i + 1);
  const expected = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14],
  ];
  const chunks = [];
  splitDo(input.slice(), 3, segment => chunks.push(segment));
  assert.strictEqual(chunks.length, expected.length);
  assert.deepStrictEqual(chunks, expected);
}

async function test3() {
  const input = Array.from({ length: 16 }, (_, i) => i + 1);
  const expected = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
    [16],
  ];
  const chunks = [];
  let resolved = false;
  const promise = splitDo(input.slice(), 3, (segment, done) => {
    chunks.push(segment);
    done();
  }).then(() => {
    resolved = true;
  });
  assert.strictEqual(resolved, false);
  await promise;
  assert.strictEqual(resolved, true);
  assert.strictEqual(chunks.length, expected.length);
  assert.deepStrictEqual(chunks, expected);
}

async function test4() {
  const input = Array.from({ length: 15 }, (_, i) => [i + 1, 'a', 'b']);
  const expected = [
    [ [1, 'a', 'b'], [2, 'a', 'b'], [3, 'a', 'b'] ],
    [ [4, 'a', 'b'], [5, 'a', 'b'], [6, 'a', 'b'] ],
    [ [7, 'a', 'b'], [8, 'a', 'b'], [9, 'a', 'b'] ],
    [ [10, 'a', 'b'], [11, 'a', 'b'], [12, 'a', 'b'] ],
    [ [13, 'a', 'b'], [14, 'a', 'b'], [15, 'a', 'b'] ],
  ];
  const chunks = [];
  let resolved = false;
  const promise = splitDo(input.slice(), 3, (segment, done) => {
    chunks.push(segment);
    done();
  }).then(() => {
    resolved = true;
  });
  assert.strictEqual(resolved, false);
  await promise;
  assert.strictEqual(resolved, true);
  assert.strictEqual(chunks.length, expected.length);
  assert.deepStrictEqual(chunks, expected);
}

async function test5() {
  const input = Array.from({ length: 15 }, (_, i) => [i + 1, 'a', 'b']);
  const expected = [
    [ [1, 'a', 'b'], [2, 'a', 'b'], [3, 'a', 'b'] ],
    [ [4, 'a', 'b'], [5, 'a', 'b'], [6, 'a', 'b'] ],
    [ [7, 'a', 'b'], [8, 'a', 'b'], [9, 'a', 'b'] ],
    [ [10, 'a', 'b'], [11, 'a', 'b'], [12, 'a', 'b'] ],
    [ [13, 'a', 'b'], [14, 'a', 'b'], [15, 'a', 'b'] ],
  ];
  const chunks = [];
  let resolved = false;
  const promise = splitDo(input.slice(), 3, (segment, done) => {
    setTimeout(() => {
      chunks.push(segment);
      done();
    }, 0);
  }).then(() => {
    resolved = true;
  });
  assert.strictEqual(resolved, false);
  await promise;
  assert.strictEqual(resolved, true);
  assert.strictEqual(chunks.length, expected.length);
  assert.deepStrictEqual(chunks, expected);
}

async function test6() {
  const input = [1, 2, 3, 4, 5, 6];
  const received = [];
  let resolved = false;
  const promise = splitDo(input.slice(), 1, (item, done) => {
    assert.strictEqual(Array.isArray(item), false);
    received.push(item);
    setTimeout(done, 0);
  }).then(() => {
    resolved = true;
  });
  assert.strictEqual(resolved, false);
  await promise;
  assert.strictEqual(resolved, true);
  assert.strictEqual(received.length, input.length);
  assert.deepStrictEqual(received, input);
}

async function test7() {
  const input = [{ a: '1' }, { b: '2' }, { c: '3' }];
  const received = [];
  let resolved = false;
  const promise = splitDo(input.slice(), 1, (item, done) => {
    assert.strictEqual(Array.isArray(item), false);
    received.push(item);
    setTimeout(done, 0);
  }).then(() => {
    resolved = true;
  });
  assert.strictEqual(resolved, false);
  await promise;
  assert.strictEqual(resolved, true);
  assert.strictEqual(received.length, input.length);
  assert.deepStrictEqual(received, input);
}

async function runTests() {
  await test1();
  await test2();
  await test3();
  await test4();
  await test5();
  await test6();
  await test7();
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
