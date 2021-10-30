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

    // call single Data from All booking
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await booking.findOne(query);
      res.json(service);
    });

    // Update Booking information
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const options = { upsert: true };
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          fullname: body.fullname,
          email: body.email,
          person:body.person,
            serviceName: body.serviceName,
          
          date:body.date,
          phone: body.phone,
          address: body.address,
          photo: body.photo,
          price: body.price,
          totalPrice: body.totalPrice,
          duration: body.duration,
          status:body.status
        }
      };
 const result = await booking.updateOne(filter, updateDoc, options);
      res.send(result)
    });

    // call all booing from manage all bookings
    app.get("/allBooking", async (req, res) => {
      const allbooking = await booking.find({}).toArray();
      res.json(allbooking);
    });

    //   post confirm Booking
    app.post("/confirmBooking", async (req, res) => {
      const bookingData = req.body.data;
      const result = await booking.insertOne(bookingData);
      res.json(result);
    });

    // add a new service

    app.post("/addNewSevice", async (req, res) => {
      const newService = req.body.data;
      const result = await allService.insertOne(newService);
      res.json(result);
    });

    // call my booking  data from booking database useing email params
    app.get("/allBooking/:email", async (req, res) => {
      const myemail = req.params.email;

      const query = { email: myemail };

      const myBookings = await booking.find(query).toArray();
      res.json(myBookings);
    });

    // Delete a booking service
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booking.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hi... i am amirul islam shanto");
});
app.listen(port, () => {
  console.log("Your listening port is ", port);
});
