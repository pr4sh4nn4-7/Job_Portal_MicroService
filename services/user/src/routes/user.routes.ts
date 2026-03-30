import express from 'express'
import { addSkillToUser, applyForJob, deleteSkillFromUser, getAllApplication, getUserProfile, MyProfile, UpdateProfilePic, UpdateResume, updateUserProfile } from '../controllers/user.controller.js'
import { isAuth } from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.get('/profile', isAuth, MyProfile)

router.get('/profile/:userId', isAuth, getUserProfile)
router.put('/profile/pic', upload, isAuth, UpdateProfilePic)
router.put('/profile/resume', upload, isAuth, UpdateResume)
router.post('/profile/skill/add', isAuth, addSkillToUser)
router.post('/profile/skill/delete', isAuth, deleteSkillFromUser)
router.post('/application/apply', isAuth, applyForJob)
router.get('/application/readall', isAuth, getAllApplication)

router.put('/profile/info', isAuth, updateUserProfile)



export default router
