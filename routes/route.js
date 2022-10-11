import {Router} from 'express'
import { online, login } from '../controllers/mongo.js'
const router = Router()


router.get('/api/mongo',online)
router.post('/api/mongo', login)

// router.post('/api/mongo/update', disabled)


router.get("/jhk", (req,res) => {
    res.json()
})


export default router