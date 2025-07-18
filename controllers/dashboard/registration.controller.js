const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")
const Course = require("../../models/Course")

const generateRegistrationPDF = require("../../utils/registrationTemplate")
const getSession = require("../../utils/sessionGen")
const client = require("../../utils/redisClient")

exports.registrationController = async (req, res) => {
  try {
    const { studentId, courseId } = sanitize(req.body)

    const CACHE_DATA = `student:${studentId}`
    const cachedData = await client.get(CACHE_DATA)

    let studentData
    
    if (cachedData) {
      studentData = JSON.parse(cachedData)
    } else {
      studentData = await Student.findOne({ _id: studentId })
    }

    const {
      name,
      image,
      father,
      mother,
      gender,
      phone,
      dateOfBirth,
      sid,
      totalOrders,
    } = studentData

    const matchedCourse = totalOrders.find(
      (order) => order.courseId.toString() === courseId.toString()
    )
    const { registrationId, enrolledAt } = matchedCourse

    const findCourse = await Course.findOne({ _id: courseId }, { duration: 1 })
    const courseDuration = findCourse ? findCourse.duration : "Unknown"

    const courseSession = getSession(
      enrolledAt,
      Number(courseDuration.split(" ")[0])
    )

    const pdfBuffer = await generateRegistrationPDF(
      image,
      name,
      father,
      mother,
      gender,
      dateOfBirth,
      phone,
      registrationId,
      sid,
      courseSession
    )

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${name
        .split(" ")
        .join("_")}-registration-card.pdf`,
      "Content-Length": pdfBuffer.length,
    })

    res.end(pdfBuffer)
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
}
