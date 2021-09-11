const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//Level 1-a Create a new booking

app.post("/bookings/", (req, res) => {
  const addBooking = req.body;
  addBooking.id = bookings.length;
  const newBookings = bookings.push(addBooking);
  res.status(200).json(newBookings);
});

//Level 1-b Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

//Level 1-c Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const requestedId = req.params.id;
  const findBooking = bookings.find(
    (booking) => booking.id === parseInt(requestedId)
  );
  if (findBooking) {
    res.status(200).json(findBooking);
  } else res.status(404).send(`No booking with this id:${requestedId}`);
});

//Level 1-d Delete a booking, specified by an ID

app.delete("/bookings/:id", (req, res) => {
  const requestedId = +req.params.id;
  const findBooking = bookings.find((booking) => booking.id !== requestedId);
  if (findBooking) {
    newBookings = bookings.filter((booking) => booking.id !== requestedId);
    res.status(200).json(newBookings);
  } else res.status(404).send(`No booking with this id:${requestedId}`);
});

// TODO add your routes and helper functions here

const PORT = 3000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
