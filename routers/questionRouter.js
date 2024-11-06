const express = require("express");
const questionController = require("../controllers/questionController");
const { identifier } = require("../middlewares/identification");
const router = express.Router();

router.get("/questions/all-questions", identifier, questionController.getQuestions);
router.get("/questions/single-question", identifier, questionController.getSingleQuestion);
router.post("/questions", identifier, questionController.createQuestion);
router.put("/questions/update", identifier, questionController.updateQuestion);
router.delete("/questions/delete", identifier, questionController.deleteQuestion);


module.exports = () => router;
