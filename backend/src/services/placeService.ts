import { Place } from '../models/index';

interface PlaceFilters {
  company_id?: string;
}

export default class PlaceService {
  async find(id: string): Promise<any> {
    const place = await Place.findByPk(id);
    if (!place) {
      throw new Error('Lugar não encontrado.');
    }
    return place;
  }

  async list(filters: PlaceFilters): Promise<any[]> {
    const whereClause: any = { is_deleted: false };
    
    if (filters.company_id) {
      whereClause.company_id = parseInt(filters.company_id);
    }

    return await Place.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
  }

  async create(data: any): Promise<any> {
    return await Place.create({
      ...data,
      is_deleted: false
    });
  }

  async createMultiple(data: any[]): Promise<any[]> {
    const places = [];
    for (const placeData of data) {
      const place = await this.create(placeData);
      places.push(place);
    }
    return places;
  }

  async update(id: string, data: any): Promise<any> {
    const place = await this.find(id);
    await place.update(data);
    return place;
  }

  async delete(id: string): Promise<{ message: string }> {
    const place = await this.find(id);
    await place.update({ is_deleted: true });
    return { message: 'Lugar deletado.' };
  }
}
