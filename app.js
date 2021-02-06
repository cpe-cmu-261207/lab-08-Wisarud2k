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
  res.json(data.courses)

})



const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server started on port:${port}`));
