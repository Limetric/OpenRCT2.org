class Database {
    constructor(socket,
                host,
                port,
                user,
                password,
                databaseName,
                connectionLimit) {
        this.isConnected = false;
        const mysql = require('mysql');
        this.pool = mysql.createPool({
            host,
            user,
            password,
            database: databaseName,
            connectionLimit,
            socketPath: socket,
            debug: false,
            charset: 'utf8mb4',
            supportBigNumbers: true,
            bigNumberStrings: false
        });

        log.info(`Using database: ${databaseName}`);
    }

    connect() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.getConnection(true);
                this.isConnected = true;
                log.info('Connected to database');
                return resolve();
            } catch (error) {
                this.isConnected = false;
                log.error('Database connection problem', error);
                return reject(error);
            }
        });
    }

    escape(value) {
        return this.pool.escape(value);
    }

    getConnection(releaseImmediately) {
        return new Promise((resolve, reject) => {
            try {
                this.pool.getConnection((error, connection) => {
                    if (releaseImmediately && connection)
                        connection.release();

                    if (error)
                        return reject(error);

                    resolve(connection);
                });
            } catch(error) {
                return reject(error);
            }
        });
    }

    promiseQuery(sql, data) {
        return new Promise(async (resolve, reject) => {
            let connection;
            try {
                connection = await this.getConnection();
            } catch (error) {
                return reject(error);
            }

            const query = connection.query(sql, data, (error, results) => {
                //Give connection back to pool
                connection.release();

                if (error)
                    return reject(error);

                resolve(results);
            });
            log.trace('Executed DB query', query.sql);
        });
    }

    async query(sql, data, callbackFn) {
        //Data parameter is optional
        if (typeof(data) === 'function') {
            callbackFn = data;
            data = undefined;
        }

        if (typeof(callbackFn) !== 'function')
            return this.promiseQuery(sql, data);

        let connection;
        try {
            connection = await this.getConnection();
        } catch (error) {
            //Call original callback
            return callbackFn(error);
        }

        const query = connection.query(sql, data, (error, results) => {
            //Give connection back to pool
            connection.release();

            //Call original callback
            callbackFn(error, results);
        });
        log.trace('Executed DB query', query.sql);
    }

    format(sql, inserts) {
        const mysql = require('mysql');
        return mysql.format(sql, inserts);
    }
}

//Export class
module.exports = Database;