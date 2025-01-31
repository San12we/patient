const express = require("express");
const router = express.Router();
const insuranceController = require("../controller/insurance"); // Import insurance controller

// Define insurance routes
router.get("/", insuranceController.getAllInsuranceProviders); // Use controller function
router.post("/", insuranceController.createInsuranceProviders); // Use controller function
router.get("/:id", insuranceController.getInsuranceProviderById); // Use controller function
router.put("/:id", insuranceController.updateInsuranceProvider); // Use controller function
router.delete("/:id", insuranceController.deleteInsuranceProvider); // Use controller function
router.put("/", insuranceController.updateInsuranceData); // Add route for updating insurance data
router.get("/user/:userId", insuranceController.getInsuranceByUserId); // Add route for getting insurance by userId

module.exports = router;