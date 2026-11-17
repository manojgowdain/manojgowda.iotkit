import { connect } from 'ssdiskdb';
const db = await connect({ path: '/tmp/ssdb-test4' });
const levelDb = db.db;
console.log('get:', typeof levelDb.get);
console.log('put:', typeof levelDb.put);
console.log('del:', typeof levelDb.del);
console.log('has:', typeof levelDb.has);
console.log('keys:', typeof levelDb.keys);
console.log('values:', typeof levelDb.values);
console.log('entries:', typeof levelDb.entries);
console.log('clear:', typeof levelDb.clear);
console.log('batch:', typeof levelDb.batch);
console.log('getMany:', typeof levelDb.getMany);
console.log('putMany:', typeof levelDb.putMany);
console.log('delMany:', typeof levelDb.delMany);
console.log('close:', typeof levelDb.close);

await levelDb.put('test1', JSON.stringify({ hello: 'world' }));
await levelDb.put('test2', JSON.stringify({ foo: 'bar' }));
console.log('get test1:', await levelDb.get('test1'));
console.log('has test1:', await levelDb.has('test1'));
for await (const [k, v] of levelDb.entries()) {
  console.log('entry:', k, v);
}
await levelDb.del('test1');
console.log('after delete has test1:', await levelDb.has('test1'));
await levelDb.clear();
console.log('after clear has test2:', await levelDb.has('test2'));
await levelDb.close();
