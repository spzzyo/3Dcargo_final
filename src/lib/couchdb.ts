
import nano from 'nano';

const couch = nano('http://admin:admin123@10.119.11.41:5984');
const dbName = 'cargodb';

export const getCouchDb = async () => {
  const dbList = await couch.db.list();
  if (!dbList.includes(dbName)) {
    await couch.db.create(dbName);
  }
  return couch.use(dbName);
};