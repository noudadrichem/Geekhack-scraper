import { Sequelize } from "sequelize";
import { Environment } from "../utils/constants";

const connectURL = `${Environment.dbDialect}://${Environment.dbUser}:${Environment.dbPassword}@${Environment.dbHost}:${Environment.dbPort}/${Environment.dbName}`
console.log({ connectURL })
const init = new Sequelize(connectURL);

export default init;