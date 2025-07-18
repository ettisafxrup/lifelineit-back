const express = require("express")
const router = express.Router()
const {
  getCourses,
  getCoursesByName,
  getCoursesBySearch,
  addCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/course.controller")
// ADMIN CONTROLLERS

const rateLimiter = require("../middlewares/rateLimiter")

// ROOT: /api/courses
router.get("/", rateLimiter(60 * 5 * 1000, 60, "Too many Requests"), getCourses) // get All Courses
router.get("/search", getCoursesBySearch) // get Course by Search
router.get("/:name", getCoursesByName) // get Course by route

// ADMIN Operation: Course
router.post("/add", addCourse) // POST
router.delete("/delete/:id", deleteCourse) // DELETE
router.patch("/update/:id", updateCourse)

module.exports = router
