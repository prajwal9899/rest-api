import Jwt from 'jsonwebtoken'
import {JWT_SECRET} from '../config'

class JwtService {
    static sign(payload, expipry = '60s',secret = JWT_SECRET ){
        return Jwt.sign(payload, secret, {expiresIn : expipry})
    }

    static verify(token,secret = JWT_SECRET ){
        return Jwt.verify(token,secret)
    }
}

export default JwtService