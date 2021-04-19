const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Course = require("./models/course");
const Student = require("./models/student");

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);
  next();
});

/* ----- */

// Home
app.get("/", (req, res) => {
  res.json({
    "/courses": "nothing yet",
  });
});

// Get All Courses
app.get("/courses", (req, res) => {
  Course.find().then((courses) => {
    console.log(courses);
    res.json(courses);
    res.status(200);
  });
});

// Get A Single Course
app.get("/courses/:courseId", (req, res) => {
  const { courseId } = req.params;
  Course.findById(courseId).then((course) => {
    if (!course) {
      res.status(404);
      console.log("Not Found!");
      res.json("Not Found!");
    } else {
      res.status(200);
      res.json(course);
      console.log(course);
    }
  });
});

// Get All Students In A Course
app.get("/courses/:courseId/students", (req, res) => {
  const { courseId } = req.params;
  Course.findById(courseId).then(course => {

    if (course) {
    Student.find({ course: courseId }).then((students => {
      console.log(students);
      res.json(students);
      res.status(200);
    });
     else {
        console.log("Not Found!");
        res.json({ error: "Not Found! Please enter a correct courseId" });
        
      };
    )}})}
// Get Single Student From Specific Course
app.get("/courses/:courseId/students/:studentId", (req, res) => {
  const { studentId, courseId } = req.params;
  Student.find({ course: courseId, _id: studentId })
    .then((students) => {
      if (students) {
        console.log(students);
        res.json(students);
        res.status(200);
      } else {
        res.json({
          error: "Pleases specify the correct course and student IDs",
        });
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: `Internal Server Error ${error}, please enter the correct ID details...`,
      });
    });
});

// Get All Students
app.get("/students", (req, res) => {
  Student.find().then((students) => {
    console.log(students);
    res.json(students);
    res.status(200);
  });
});

// Post A Single Course
app.post("/courses", (req, res) => {
  // listening to requests with a POST method for /posts
  if (!req.body.name && !req.body.type) {
    // validating that the title and body is made
    res.status(400);
    res.json({ error: "Pleases specify a course by a name and type" });
  } else {
    Course.create({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
    })
      // insert properties from Postman JSON to the JSON VSC Object
      .then((course) => {
        if (course.location === undefined) {
          course.location = "Remote";
        }
        console.log(course);
        res.json(course); // to see the info we got from Postman, in Postmans Body Response
        res.status(201);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// Post A Single Student To A Specific Course
app.post("/courses/:courseId/students", (req, res) => {
  const { courseId } = req.params;
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    course: courseId,
  })
    .then((student) => {
      console.log(student);
      res.json(student);
      res.status(201);
    })
    .catch((error) => {
      console.error(error);
    });
});

// Patch A Specific Course
app.patch("/courses/:courseId", (req, res) => {
  const { courseId } = req.params;
  Course.findByIdAndUpdate(courseId, req.body, { new: true })
    .then((courseUpdate) => {
      res.status(200);
      res.json(courseUpdate);
      console.log(courseUpdate);
    })
    .catch((error) => {
      res.status(404);
      res.json({
        error: `Not Found: ${error}`,
      });
    });
});

// Patch A Specific Student
app.patch("/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((studentUpdate) => {
      res.status(200);
      res.json(studentUpdate);
      console.log(studentUpdate);
    })
    .catch((error) => {
      res.status(404);
      res.json({
        error: `Not Found: ${error}`,
      });
    });
});

// Delete A Course
app.delete("/courses/:courseId", (req, res) => {
  const { courseId } = req.params;

  Course.findByIdAndDelete(courseId).then(() => {
    res.status(204);
    res.json("deleted!");
    console.log("deleted successfully");
  });
});

/* ----- */

mongoose.connect("mongodb://localhost/Friyay16-Apr-21", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;

mongodb.on("open", () => {
  app.listen(4000, () => {
    console.log("Listening on http://localhost:4000");
  });
});
