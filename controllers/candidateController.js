import Candidate from '../models/candidateSchema.js';
import User from '../models/userSchema.js';
import { checkAdminRole } from './authController.js';

export async function addCandidate(req, res) {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({
        status: 'unauthorized',
        message: 'You are not admin',
      });
    }
    const newCandidate = await Candidate.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newCandidate,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function updateCandidate(req, res) {
  try {
    let id = req.params.id;
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({
        status: 'unauthorized',
        message: 'You are not admin',
      });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({
        status: 'fail',
        message: 'candidate not found',
      });
    }

    await Candidate.findByIdAndUpdate(id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'candidate updated',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function deleteCandidate(req, res) {
  try {
    let id = req.params.id;
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({
        status: 'unauthorized',
        message: 'You are not admin',
      });
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({
        status: 'fail',
        message: 'candidate not found',
      });
    }

    await Candidate.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'candidate deleted',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function voteCandidate(req, res) {
  const candidateId = req.params.id;
  const userId = req.user.id;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        status: 'fail',
        message: 'candidate not found',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found',
      });
    }
    if (user.role === 'admin') {
      return res.status(403).json({
        message: 'only voters can vote not admin',
      });
    }
    if (user.isVoted) {
      return res.status(400).json({
        message: 'User already voted',
      });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'vote successfully registered',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function voteCount(req, res) {
  try {
    const candidates = await Candidate.find().sort({ voteCount: 'desc' });

    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function getCandidate(req, res) {
  try {
    const candidates = await Candidate.find();
    const records = candidates.map(data => {
      return {
        Name: data.name,
        Party: data.party
      }
    })
    res.status(200).json({
      TotalCandidate: records.length,
      Record : records
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
}
