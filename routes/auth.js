const express = require("express")
const router = express.Router()
const {
  otpVerification,
  registerController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller")

const verifyJWT = require("../middlewares/authMiddleware")

const rateLimiter = require("../middlewares/rateLimiter")

// ROOT: /api/auth
router.post("/otp-verify", otpVerification)

router.post(
  "/register",
  // rateLimiter(3600 * 1000, 3, "Otp Limit Exceed! Please try again af an hour."),
  registerController
)

router.post(
  "/login",
  // rateLimiter(60 * 15 * 1000, 5, "Login limit exceed! Please try again later."),
  loginController
)

router.get(
  "/logout",
  // rateLimiter(3600 * 2 * 1000, 4, "Please try again later."),
  logoutController
) // Logout Route

router.get("/check", verifyJWT, (req, res) => {
  res.json({ status: true, user: req.user })
}) // Checking if JWT is valid or not.

module.exports = router
