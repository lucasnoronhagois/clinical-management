import express from 'express';
import { PlaceController } from '../controllers/index';
import { validateSchema } from '../middlewares/validateSchema';
import { placeSchema } from '../schema/index';

const router = express.Router();
const placeController = new PlaceController();

router.get('/', placeController.list.bind(placeController));
router.get('/:id', placeController.find.bind(placeController));
router.post('/', validateSchema(placeSchema), placeController.create.bind(placeController));
router.put('/:id', validateSchema(placeSchema), placeController.update.bind(placeController));
router.delete('/:id', placeController.delete.bind(placeController));

export default router;
