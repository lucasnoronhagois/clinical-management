import { Request, Response } from 'express';
import PlaceService from '../services/placeService';

const placeService = new PlaceService();

export default class PlaceController {

  async find(req: Request, res: Response): Promise<void> {
    try {
      const place = await placeService.find(req.params.id);
      res.json(place);
    } catch (error: any) {
      if (error.message === 'Lugar não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        company_id: req.query.company_id as string
      };
      
      const places = await placeService.list(filters);
      res.json(places);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      let place;
      
      if (Array.isArray(req.body)) {
        place = await placeService.createMultiple(req.body);
      } else {
        place = await placeService.create(req.body);
      }
      
      res.status(201).json(place);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const place = await placeService.update(req.params.id, req.body);
      res.json(place);
    } catch (error: any) {
      if (error.message === 'Lugar não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await placeService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Lugar não encontrado.') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }
}
