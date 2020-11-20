const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const { DATABASE_CONNECTION_STRING = '' } = require('../configuration');
const log = require('../utilities/log');

const basename = path.basename(__filename);

// connect to the database
mongoose.connect(
  DATABASE_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

const { connection } = mongoose;

if (!connection) throw new Error('-- database: connection failed');

connection.on('error', (error) => log(`-- database: ERROR\n${error}`));
connection.on('disconnected', () => log('-- database: disconnected'));
connection.once('open', () => log('-- database: connected'));

// handle process termination: close database connection
process.on('SIGINT', () => connection.close(() => log('-- database: closing connection')));

// load schemas and create models
fs.readdirSync(`${__dirname}/schemas`)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const [schema] = file.split('.');
    const name = `${schema[0].toUpperCase()}${schema.slice(1)}`;

    connection[name] = mongoose.model(name, require(`./schemas/${file}`)(mongoose));
  });

module.exports = connection;
