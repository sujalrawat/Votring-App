import express from 'express';
import {protect} from '../controllers/authController.js'
import {addCandidate, updateCandidate, deleteCandidate,voteCandidate, voteCount, getCandidate} from '../controllers/candidateController.js'

const router = express.Router();

router.post('/',protect,addCandidate)
router.patch('/:id',protect,updateCandidate)
router.delete('/:id',protect,deleteCandidate)
router.post('/vote/:id',protect,voteCandidate)
router.get('/votecount',voteCount)
router.get('/',getCandidate)

export default router;
