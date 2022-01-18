import Joi from 'joi'
import { RefreshToken, User } from '../../models'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtService'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import {REFRESH_SECRET } from '../../config'

const registerController = {
   async register(req,res,next){

    //   validtae the request
        const registerSchema = Joi.object({
            name : Joi.string().min(3).max(20).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password : Joi.ref('password')
        })

        const {error} = registerSchema.validate(req.body)

        if(error) {
            return next(error)
        }

        // check if user alreday registered

        const {name,email,password} = req.body
        console.log(req.body.password);

        try {
            const exist = await User.exists({email : req.body.email})

            if(exist) {
                return next(CustomErrorHandler.alreadyExist('This is alreday taken'))
            }
        } catch (error) {
           return next(error)
        }

        // hash password 
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

       
        const user = new User({
            name,
            email,
            password : hashedPassword
        })

        let access_token
        let refresh_token

        try {
            const result = await user.save()

            // Token
             access_token = JwtService.sign({_id: result._id, role: result.role})
             refresh_token = JwtService.sign({_id: result._id, role: result.role},'1y',REFRESH_SECRET)

            //  store refresh token in databbase
           await RefreshToken.create({token : refresh_token})

        } catch (err) {
            return next(err)
        }

        res.json({access_token, refresh_token})
    }
}

export default registerController