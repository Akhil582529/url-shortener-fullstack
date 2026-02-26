import express from 'express'
import { redirectUrl } from '../controllers/redirectUrl.js';
const router = express.Router();

router.get("/:shortCode", redirectUrl);

export default router;