import { Place } from "../models/index.js"

export default class PlaceService {

  async find(id) {
    const place = await Place.findByPk(id);
    
    if (!place) {
      throw new Error('Lugar não encontrado.');
    }
    
    return place;
  }

  async list(filters) {
    const { company_id } = filters;
    
    const whereClause = company_id ? 
      { company_id, is_deleted: false } : 
      { is_deleted: false };
    
    return await Place.findAll({
      where: whereClause
    });
  }

  async create(placeData) {
    return await Place.create(placeData);
  }

  async update(id, updateData) {
    const place = await this.find(id);
    await place.update(updateData);
    return place;
  }

  async delete(id) {
    const place = await this.find(id);
    await place.update({ is_deleted: true });
    return { message: 'Lugar deletado.' };
  }
} 