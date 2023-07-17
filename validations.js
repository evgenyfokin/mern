import {body} from "express-validator";

export const loginValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'password must be longer than 5 characters').isLength({min: 5})
]
export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'password must be longer than 5 characters').isLength({min: 5}),
    body('fullName', 'Enter a name').isLength({min: 3}),
    body('avatarUrl', 'Invalid avatar link').optional().isURL()
]

export const postCreateValidation = [
    body('title', "Введите заголовок статьи").isLength({min: 3}).isString(),
    body('text', "Введите текст статьи").isLength({min: 10}).isString(),
    body('tags', "Неверный формат тэгов (укажите массив)").optional().isArray(),
    body('imageUrl', "Неверная ссылка на изображение").optional().isString(),
]
