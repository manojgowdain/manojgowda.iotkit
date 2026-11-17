import { connect } from 'ssdiskdb';
const db = await connect({ path: '/tmp/ssdb-test3' });
console.log('DB.db methods:', Object.keys(db.db));
console.log('DB.db:', db.db);
await db.close();
