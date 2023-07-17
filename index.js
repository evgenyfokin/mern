import express from 'express'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations.js";
import cors from 'cors'
import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/UserController.js";
import {create, getAll, getLastTags, getOne, remove, update} from "./controllers/PostController.js";
import multer from 'multer'
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
    .connect(process.env.MONGODB_URL).then(() => {
    console.log("DB IS WORKING")
})
    .catch(e => console.log('DB ERROR:', e))
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'upload')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})
const PORT = process.env.PORT || 3004

app.use(express.json())
app.use(cors( ))
app.use('/upload', express.static('upload'))

app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.get('/auth/me', checkAuth, getMe)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`
    });
});

app.get('/tags', getLastTags)
app.get('/posts', getAll)
app.get('/posts/tags', getLastTags)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)

app.listen(PORT, (e) => {
    if (e) {
        return console.log(e)
    }
    console.log(`SERVER IS GOING ON PORT ${PORT}`)
})