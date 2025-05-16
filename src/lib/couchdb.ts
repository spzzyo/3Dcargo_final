
import nano from 'nano';

const couch = nano('http://admin:admin@localhost:5984');
const dbName = 'iitbdb';

export const getCouchDb = async () => {
  const dbList = await couch.db.list();
  if (!dbList.includes(dbName)) {
    await couch.db.create(dbName);
  }
  return couch.use(dbName);
};