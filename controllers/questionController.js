const Question = require("../models/questionModel");
const { createQuestionSchema } = require("../middlewares/validator");

require('dotenv').config();
const axios = require('axios');

exports.getQuestions = async (req, res) => {
    const { page } = req.query;
    const questionPerPage = 10;

    try {
        let pageNum = 0;
        if (page <= 1) {
            pageNum = 0;
        } else {
            pageNum = page - 1;
        }
        const result = await Question.find()
            .sort({ createdAt: -1 })
            .skip(pageNum * questionPerPage)
            .limit(questionPerPage)
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

// Function to call Anthropic API and generate an answer
exports.createQuestion = async (req, res) => {
	const { title, description } = req.body;
	const { userId } = req.user;
	try {
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

		const result = await Question.create({
			title,
			description,
			userId,
		});
		res.status(201).json({ success: true, message: 'created', data: result });
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
        const extQuestion = await Post.findOne({ _id });
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
