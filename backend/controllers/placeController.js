import PlaceService from '../services/placeService.js';

const placeService = new PlaceService();

export default class PlaceController {

  async find(req, res) {
    try {
      const place = await placeService.find(req.params.id);
      res.json(place);
    } catch (error) {
      if (error.message === 'Lugar não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const filters = {
        company_id: req.query.company_id
      };
      
      const places = await placeService.list(filters);
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      let place;
      
      if (Array.isArray(req.body)) {
        place = await placeService.createMultiple(req.body);
      } else {
        place = await placeService.create(req.body);
      }
      
      res.status(201).json(place);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const place = await placeService.update(req.params.id, req.body);
      res.json(place);
    } catch (error) {
      if (error.message === 'Lugar não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await placeService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Lugar não encontrado.') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
} 