"use strict";

import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect.js";
import config from "../configs/config.mongodb.js";

const {
  db: { host, name, port },
} = config;
const connectString = `mongodb://${host}:${port}/${name}`;

console.log(connectString);

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log("Connected Mongodb Success PRO", countConnect()))
      .catch((err) => console.log("Error Connect"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongdb = Database.getInstance();
export default instanceMongdb;
