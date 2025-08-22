import express from 'express';
import { PlaceController } from '../controllers/index.js'
import { requireRoot } from '../middlewares/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createPlaceSchema, updatePlaceSchema, listPlacesSchema, idSchema } from '../schema/index.js';

const router = express.Router();
const placeController = new PlaceController();

// GET: lista todos os lugares
router.get('/', validateSchema(listPlacesSchema, 'query'), placeController.list);

// POST: cria um novo lugar (apenas adm)
router.post('/', requireRoot, validateSchema(createPlaceSchema, 'body'), placeController.create);

// GET: obter um lugar por id
router.get('/:id', validateSchema(idSchema, 'params'), placeController.find);

// PUT: atualizar um lugar por id
router.put('/:id', validateSchema(updatePlaceSchema, 'body'), placeController.update);

// DELETE: soft delete (marca is_deleted como TRUE)
router.delete('/:id', validateSchema(idSchema, 'params'), placeController.delete);

export default router; 