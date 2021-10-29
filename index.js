const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

// mongodb clint and uri link;
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jgifu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("TourWebsite");
    const allService = database.collection("services");
    const airlines = database.collection("airlines");
    const booking = database.collection("booking");

    // call all service from ui
    app.get("/services", async (req, res) => {
      const services = await allService.find({}).toArray();

      res.json(services);
    });
    // call all airline from ui
    app.get("/airlines", async (req, res) => {
      const airline = await airlines.find({}).toArray();

      res.json(airline);
    });
    // call single serviece useing id

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await allService.findOne(query);
      res.json(service);
    });

    //   post confirm Booking
    app.post("/confirmBooking", async (req, res) => {
      const bookingData = req.body.data;
      const result = await booking.insertOne(bookingData);
      res.json(result)
    });
// call my booking  data from booking database useing email params
    app.get("/allBooking/:email", async (req, res) => {
      const myemail = req.params.email;
     
      const query = { email: myemail };
      
      const myBookings = await booking.find(query).toArray();
      res.json(myBookings)
    });
    

  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hi.. i am amirul islam shanto");
});
app.listen(port, () => {
  console.log("Your listening port is ", port);
});
