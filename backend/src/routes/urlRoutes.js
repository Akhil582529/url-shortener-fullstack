import express from 'express';
import validator from '../middlewares/validator.js';
import { urlController } from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', validator, urlController);

export default router;
