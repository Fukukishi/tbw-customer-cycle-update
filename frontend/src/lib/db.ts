import mysql from 'mysql2/promise';

export const db =await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '_@rHVaajU/XJpnOB',
    database: 'tbw_cycle',
});