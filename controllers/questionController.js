const Question = require("../models/questionModel");
const { createQuestionSchema } = require("../middlewares/validator");

// for openAi integration
const { OpenAI } = require('openai');
const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });
const axios = require('axios');

// for gemini integration
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


//Gemini integration
exports.createQuestion = async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.user;
  
    try {
      // Validate input
      const { error, value } = createQuestionSchema.validate({
        title,
        description,
        userId,
      });
      if (error) {
        return res
          .status(401)
          .json({ success: false, message: error.details[0].message });
      }
  
      // Generate AI answer using Gemini API
      const prompt = `Question: ${title}\nDescription: ${description}\nAnswer:`;
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);
  
      // Extract the answer from the Gemini response
      const aiAnswer = response.response.text();

      // Create question in database
      const result = await Question.create({
        title,
        description,
        userId,
        answer: aiAnswer,
      });
  
      // Respond with the created question and AI answer
      res.status(201).json({
        success: true,
        message: 'created',
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

exports.getQuestions = async (req, res) => {
    try {
        const result = await Question.find()
            .populate({
                path: "userId",
                select: "email",
            });
        res.status(200).json({ success: true, message: "Questions", data: result });
    } catch (error) {
        console.log(error);
    }
};

exports.getSingleQuestion = async (req, res) => {
    const { _id } = req.query;
    try {
        const result = await Question.findOne({ _id }).populate({
            path: "userId",
            select: "email",
        });

        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Post unavailable" });
        }
        res.status(200).json({ success: true, message: "Question", data: result });
    } catch (error) {
        console.log(error);
    }
};

exports.updateQuestion = async (req, res) => {
    const { _id } = req.query;
    const { title, description } = req.body;
    const { userId } = req.user;
    try {
        const { error, value } = createQuestionSchema.validate({
            title,
            description,
            userId
        });
        if (error) {
            return res.status(401).json({ success: false, error: error.details[0].message });
        }
        const extQuestion = await Question.findOne({ _id });
        if (!extQuestion) {
            return res.status(404).json({ success: false, message: "Question unavailable" });
        }
        if (extQuestion.userId.toString() != userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        extQuestion.title = title;
        extQuestion.description = description;

        const result = await extQuestion.save();
        res.status(200).json({ success: true, message: "Updated", data: result });
    } catch (error) {
        console.log(error);
    }
}

exports.deleteQuestion = async (req, res) => {
    const { _id } = req.query;
    const { userId } = req.body;
    try {
        const extQuestion = await Question.findOne({ _id });
        if (!extQuestion) {
            return res
                .status(404)
                .json({ success: false, message: "Question doesn't exist." });
        }
        if (extQuestion.userId.toString() != userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized to delete this Question" });
        }
        await extQuestion.deleteOne({ _id });
        res.status(200).json({
            success: true,
            message: "Question deleted successfully."
        })
    } catch (error) {
        console.log(error);
    }
};

// OpenAi integration : Not used due to rate limiter
// exports.createQuestion = async (req, res) => {
// 	const { title, description } = req.body;
// 	const { userId } = req.user;

// 	try {
// 		// Validate input
// 		const { error, value } = createQuestionSchema.validate({
// 			title,
// 			description,
// 			userId,
// 		});
// 		if (error) {
// 			return res
// 				.status(401)
// 				.json({ success: false, message: error.details[0].message });
// 		}

// 		// Create question in database
// 		const result = await Question.create({
// 			title,
// 			description,
// 			userId,
// 		});

// 		// Generate AI answer
// 		const prompt = `Question: ${title}\nDescription: ${description}\nAnswer:`;
// 		const response = await openai.chat.completions.create({
// 			model: "gpt-3.5-turbo",
// 			messages: [{ role: "user", content: prompt }],
// 		});

// 		// Extract the answer from the OpenAI response
// 		const aiAnswer = response.choices[0].message.content.trim();

// 		// Respond with the created question and AI answer
// 		res.status(201).json({
// 			success: true,
// 			message: 'created',
// 			data: result,
// 			aiAnswer,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({ success: false, message: "Internal Server Error" });
// 	}
// };
