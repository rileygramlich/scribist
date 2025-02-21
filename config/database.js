const mongoose = require("mongoose");

// Fix deprecation warning
mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Handle connection events
mongoose.connection.on("error", (err) => {
    console.error("Database error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
