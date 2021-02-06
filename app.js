const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const { join } = require("path");

//to post you must use bodyParser

app.use(express.static("assets"));
app.use(bodyParser.json("assets"));  // check again when fo post
//app.use(bodyParser.json)

app.get("/", (req, res) => {
  res.end(fs.readFileSync("./instruction.html"));
});

//implement your api here
//follow instruction in http://localhost:8000/

// const flie = fs.readFileSync('myCourses.json','utf8')

app.get("/courses",(req,res) => {
  const file = fs.readFileSync('myCourses.json','utf8')
  const data = JSON.parse(file)
  res.json(data)
});

app.get("/courses/:id",(req,res) => {
  const {id} = req.params
  console.log(id);
  const file = fs.readFileSync('myCourses.json','utf8')
  const data = JSON.parse(file)
  //res.json(data.courses[1].courseId);
  const courseid = data.courses.find(date => date.courseId === Number(id))
  if(!courseid){
    res.status(404)
    res.json({message: `courseId: ${id} not found`})
    return
  }
  res.json(courseid);

})

app.delete("/courses/:id",(req,res) => {
  const {id} = req.params
  // console.log(id);
  const file = fs.readFileSync('myCourses.json','utf8')
  const data = JSON.parse(file)

  data.courses = data.courses.filter(date => date.courseId !== Number(id))

  let sum = 0;
  let i = 0;
  data.courses.map(date => {
    sum += (date.gpa*date.credit);
    i += date.credit;
    //console.log(date.gpa)
  })
  // console.log(sum/i)
  data.gpax = (sum/i);
  fs.writeFileSync('myCourses.json',JSON.stringify(data))
  res.json(data)

})

app.post("/addCourse",(req,res) => {
  const course = req.body
  const file = fs.readFileSync('myCourses.json','utf8')
  const data = JSON.parse(file)

  if(course.courseId === null || course.courseName === null ||
    course.credit === null || course.gpa === null){
      res.status(422);
      res.json({message: 'data not complete'})
    }

  data.courses.push({
    ...course,
  })

  let sum = 0;
  let i = 0;
  data.courses.map(date => {
    sum += (date.gpa*date.credit);
    i += date.credit;
    //console.log(date.gpa)
  })
  data.gpax = (sum/i);
  fs.writeFileSync('myCourses.json',JSON.stringify(data))
  res.json(course)
})



const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server started on port:${port}`));
