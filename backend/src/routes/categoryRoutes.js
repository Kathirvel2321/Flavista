import express from 'express';
import { getCategories, seedCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories);
router.route('/seed').post(seedCategories);

export default router;