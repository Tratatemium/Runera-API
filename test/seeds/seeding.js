const { getCollection } = require("../../src/database");

const seedRuns = async () => {
    const runs = getCollection("runs");
    await runs.insertOne(
        {
            "runId": "dc9822e7-72d6-4cc8-b6da-c1c5208d6109",
            "userId": "1d9a8400-07cd-466a-9d13-843a544a5b09",
            "startTime": "2026-01-19T12:25:44.822Z",
            "durationSec": 457,
            "distanceMeters": 1574
        }
    );
};

module.exports = { seedRuns };