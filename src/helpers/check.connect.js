"user strict";

import mongoose from "mongoose";
import os from "os";
import process from "process";
const __SECONDS = 5000;

// count Connect
export const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
};

// check over load
export const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum of connections based on number osf cores
    const maxConnections = numCores * 5;

    console.log(`Menory usage:: ${memoryUsage / 1024 / 1024}MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected!");
    }
  }, __SECONDS); // Monitor every 5 seconds
};
