import { Product } from "../models"
import multer from 'multer'
import path from 'path'
import CustomErrorHandler from "../services/CustomErrorHandler"
import fs from "fs"
import Joi from 'joi'
import productSchema from "../validators/productValidator"

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const handleMultiPartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image')


const productController = {
    async store(req, res, next) {
        // multiple form data
        handleMultiPartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }

            const filePath = req.file.path

            // valiadte request


            const { error } = productSchema.validate(req.body)

            if (error) {
                // delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                })
                return next(error)
            }

            const { name, price, size } = req.body

            let document;

            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch (error) {
                return next(error)
            }

            res.status(201).json(document)

        })
    },
    async update(req, res, next) {
        handleMultiPartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }

            let filePath
            if (req.file) {
                filePath = req.file.path
            }


            // valiadte request

            const { error } = productSchema.validate(req.body)

            if (error) {
                // delete the uploaded file

                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    })
                }
                return next(error)
            }

            const { name, price, size } = req.body

            let document;

            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true })
            } catch (error) {
                return next(error)
            }

            res.status(201).json(document)

        })
    },
    async delete(req, res, next) {

        const document = await Product.findOneAndRemove({ _id: req.params.id })

        if (!document) {
            return next(new Error("Nothing to delete"))
        }

        // delete image
        const imagePath = document._doc.image;

        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError())
            }
            return res.json(document)
        })


    },
    async index(req, res, next) {
        let documents
        // pagination
        try {
            documents = await Product.find().select('-updatedAt -createdAt -__v').sort({ _id: -1 })
        } catch (error) {
            return next(error)
        }

        return res.json(documents)
    },
    async show(req, res, next) {
        let document
        try {
            document = await Product.findOne({ _id: req.params.id }).select('-updatedAt -createdAt -__v')
        } catch (error) {
            return next(error)
        }

        return res.json(document)
    }
}

export default productController