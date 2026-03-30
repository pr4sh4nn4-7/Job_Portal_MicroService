import express from 'express'
import { isAuth } from '../middleware/auth.js'
import { createJob, deleteJOb, getallActiveJobs, getAllApplicationForjob, getSingleJOb, updateJob } from '../controllers/job.controllers.js'
import { updateApplication } from '../controllers/application.controller.js'

const router = express.Router()

router.post('/create', isAuth, createJob)
router.post('/update/:jobId', isAuth, updateJob)
router.delete('/delete/:jobId', deleteJOb)
router.get('/readall', getallActiveJobs)
router.get('/read/:jobId', getSingleJOb)
router.get('/application/readall/:jobId', isAuth, getAllApplicationForjob)
router.put('/application/update/:id', isAuth, updateApplication)

export default router
