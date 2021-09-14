const express = require("express");
const cors = require("cors");
const moment = require("moment");
moment().format();
const validator = require("email-validator");

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

  //Level 2- Server must reject requests to create bookings if any property of the booking object is missing or empty.
  if (
    !req.body.title ||
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.roomId ||
    !req.body.checkInDate ||
    !req.body.checkOutDate
  )
    res.status(404).send(`Please fill all the required fields`);

  //Level 4 e-mail and check-in checkout date control
  if (!validator.validate(req.body.email)) {
    res.status(400).json(`Please enter a valid email address!`);
  }
  if (moment(req.body.checkInDate) > moment(req.body.checkOutDate)) {
    res.status(400).json(`checkoutDate can not be before than checkinDate`);
  } else res.status(200).json(newBookings);
});

//Level 1-b Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Level 1-c Read one booking, specified by an id
app.get("/bookings/:id", (req, res) => {
  const requestedId = req.params.id;
  const findBooking = bookings.find(
    (booking) => booking.id === parseInt(requestedId)
  );
  if (findBooking) {
    res.status(200).json(findBooking);
  } else res.status(404).send(`No booking with this id:${requestedId}`);
});

//Level 1-d Delete a booking, specified by an id

app.delete("/bookings/:id", (req, res) => {
  const requestedId = +req.params.id;
  const findBooking = bookings.find((booking) => booking.id !== requestedId);
  if (findBooking) {
    newBookings = bookings.filter((booking) => booking.id !== requestedId);
    res.status(200).json(newBookings);
  } else res.status(404).send(`No booking with this id:${requestedId}`);
});

//  Level3-Level 5 Search with term and date
app.get("/bookings/search", (req, res) => {
  const { term, date } = req.query; //It works for /bookings/search?term=jones and /bookings/search?date=2018-02-15

  //  Level 5- Search for bookings which match a given search term
  if (term) {
    const filteredBooking = bookings.filter(
      (booking) =>
        booking.firstName.toUpperCase().includes(term.toUpperCase()) ||
        booking.surname.toUpperCase().includes(term.toUpperCase()) ||
        booking.email.toUpperCase().includes(term.toUpperCase())
    );

    if (filteredBooking.length > 0) {
      res.json(filteredBooking);
    } else {
      res.status(404).json(`No booking found`);
    }
  }

  // Level 3 -Search for bookings which span a date (given by the client)
  if (date) {
    const filteredBookings = bookings.filter(
      (entry) =>
        entry.checkInDate.includes(date) || entry.checkOutDate.includes(date)
    );

    if (filteredBookings.length > 0) {
      res.json(filteredBookings);
    } else {
      res.status(404).json(`No booking found`);
    }
  }
});

// TODO add your routes and helper functions here

const PORT = 3000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
