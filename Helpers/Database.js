// noinspection ES6CheckImport
import {openDatabase} from 'react-native-sqlite-storage';
const dbName = 'vetus';

export const database = openDatabase({
    name: dbName,
    location: 'default',
}, () => {
    console.log('ok shod');
}, (error) => {
    console.log('db rid');
    console.log(error);
});
