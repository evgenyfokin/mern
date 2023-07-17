import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to get tags"
        })
    }
}
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to get posts"
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: "after"
            }
        )
        if (!post) {
            return res.status(404).json({
                message: "Failed to get the post"
            })
        }
        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to get posts"
        })
    }
}
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        const post = await doc.save()
        res.json(post)
    } catch (e) {
        res.status(500).json({
            message: "Failed to post"
        })
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        const removedPost = await PostModel.findByIdAndRemove(postId)
        if (!removedPost) {
            return res.status(404).json({
                message: "Here is nothing to remove"
            })
        }
        res.json({
            success: true
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to remove the post"
        })
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne({
                _id: postId
            }, {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            }
        )
        res.json({
            success: true
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Failed to update the post"
        })
    }
}
