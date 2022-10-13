import {Router} from 'express'
import { online, login, disabled} from '../controllers/mongo.js'
const router = Router()


router.get('/api/mongo',online)
router.post('/api/mongo', login)

router.post('/api/mongo/dics', disabled)


router.get("/jhk", (req,res) => {
    res.json()
})


export default router