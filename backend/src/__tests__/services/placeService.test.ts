import PlaceService from '../../services/placeService';
import { Place } from '../../models/index';

// Mock do modelo Place
jest.mock('../../models/index', () => ({
  ...jest.requireActual('../../models/index'),
  Place: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

describe('PlaceService', () => {
  let placeService: PlaceService;
  let mockPlace: any;

  beforeEach(() => {
    // Setup antes de cada teste
    placeService = new PlaceService();
    
    // Mock do local
    mockPlace = {
      id: 1,
      name: 'Sala de Consulta 1',
      description: 'Sala para consultas médicas',
      capacity: 1,
      company_id: 1,
      is_deleted: false,
      update: jest.fn()
    };

    // Limpar todos os mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('deve retornar um local quando encontrado', async () => {
      // Arrange
      const placeId = '1';
      (Place.findByPk as jest.Mock).mockResolvedValue(mockPlace);

      // Act
      const result = await placeService.find(placeId);

      // Assert
      expect(Place.findByPk).toHaveBeenCalledWith(placeId);
      expect(result).toEqual(mockPlace);
    });

    it('deve lançar erro quando local não encontrado', async () => {
      // Arrange
      const placeId = '999';
      (Place.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(placeService.find(placeId)).rejects.toThrow('Lugar não encontrado.');
    });
  });

  describe('list', () => {
    it('deve retornar lista de locais ativos com filtro de empresa', async () => {
      // Arrange
      const filters = { company_id: '1' };
      const mockPlaces = [mockPlace];
      
      (Place.findAll as jest.Mock).mockResolvedValue(mockPlaces);

      // Act
      const result = await placeService.list(filters);

      // Assert
      expect(Place.findAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false,
          company_id: 1
        },
        order: [['name', 'ASC']]
      });
      expect(result).toEqual(mockPlaces);
    });

    it('deve retornar lista sem filtro de empresa quando não fornecido', async () => {
      // Arrange
      const filters = {};
      const mockPlaces = [mockPlace];
      
      (Place.findAll as jest.Mock).mockResolvedValue(mockPlaces);

      // Act
      const result = await placeService.list(filters);

      // Assert
      expect(Place.findAll).toHaveBeenCalledWith({
        where: { 
          is_deleted: false
        },
        order: [['name', 'ASC']]
      });
      expect(result).toEqual(mockPlaces);
    });

    it('deve converter company_id para número quando fornecido', async () => {
      // Arrange
      const filters = { company_id: '5' };
      const mockPlaces = [mockPlace];
      
      (Place.findAll as jest.Mock).mockResolvedValue(mockPlaces);

      // Act
      await placeService.list(filters);

      // Assert
      const callArgs = (Place.findAll as jest.Mock).mock.calls[0][0];
      expect(callArgs.where.company_id).toBe(5);
      expect(typeof callArgs.where.company_id).toBe('number');
    });
  });

  describe('create', () => {
    it('deve criar um novo local com sucesso', async () => {
      // Arrange
      const placeData = {
        name: 'Sala de Consulta 2',
        description: 'Sala para consultas pediátricas',
        capacity: 2,
        company_id: 1
      };
      
      const expectedPlaceData = {
        ...placeData,
        is_deleted: false
      };
      
      (Place.create as jest.Mock).mockResolvedValue({
        id: 2,
        ...expectedPlaceData
      });

      // Act
      const result = await placeService.create(placeData);

      // Assert
      expect(Place.create).toHaveBeenCalledWith(expectedPlaceData);
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('name', 'Sala de Consulta 2');
    });

    it('deve definir is_deleted como false por padrão', async () => {
      // Arrange
      const placeData = {
        name: 'Sala de Exame',
        capacity: 1,
        company_id: 1
      };
      
      (Place.create as jest.Mock).mockResolvedValue({
        id: 3,
        ...placeData,
        is_deleted: false
      });

      // Act
      await placeService.create(placeData);

      // Assert
      const callArgs = (Place.create as jest.Mock).mock.calls[0][0];
      expect(callArgs.is_deleted).toBe(false);
    });
  });

  describe('createMultiple', () => {
    it('deve criar múltiplos locais', async () => {
      // Arrange
      const placesData = [
        {
          name: 'Sala 1',
          capacity: 1,
          company_id: 1
        },
        {
          name: 'Sala 2',
          capacity: 2,
          company_id: 1
        }
      ];
      
      (Place.create as jest.Mock)
        .mockResolvedValueOnce({ id: 1, ...placesData[0], is_deleted: false })
        .mockResolvedValueOnce({ id: 2, ...placesData[1], is_deleted: false });

      // Act
      const result = await placeService.createMultiple(placesData);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[1]).toHaveProperty('id', 2);
      expect(Place.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('deve atualizar local existente', async () => {
      // Arrange
      const placeId = '1';
      const updateData = {
        name: 'Sala de Consulta 1 Atualizada',
        capacity: 3
      };
      
      (Place.findByPk as jest.Mock).mockResolvedValue(mockPlace);
      mockPlace.update.mockResolvedValue({
        ...mockPlace,
        ...updateData
      });

      // Act
      const result = await placeService.update(placeId, updateData);

      // Assert
      expect(Place.findByPk).toHaveBeenCalledWith(placeId);
      expect(mockPlace.update).toHaveBeenCalledWith(updateData);
      expect(Place.findByPk).toHaveBeenCalledWith(placeId);
      expect(mockPlace.update).toHaveBeenCalledWith(updateData);
    });

    it('deve lançar erro quando local não encontrado para atualização', async () => {
      // Arrange
      const placeId = '999';
      const updateData = { name: 'Nome Atualizado' };
      
      (Place.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(placeService.update(placeId, updateData)).rejects.toThrow('Lugar não encontrado.');
    });
  });

  describe('delete', () => {
    it('deve deletar local (soft delete)', async () => {
      // Arrange
      const placeId = '1';
      (Place.findByPk as jest.Mock).mockResolvedValue(mockPlace);
      mockPlace.update.mockResolvedValue({
        ...mockPlace,
        is_deleted: true
      });

      // Act
      const result = await placeService.delete(placeId);

      // Assert
      expect(Place.findByPk).toHaveBeenCalledWith(placeId);
      expect(mockPlace.update).toHaveBeenCalledWith({ is_deleted: true });
      expect(result).toEqual({ message: 'Lugar deletado.' });
    });

    it('deve lançar erro quando local não encontrado para deletar', async () => {
      // Arrange
      const placeId = '999';
      (Place.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(placeService.delete(placeId)).rejects.toThrow('Lugar não encontrado.');
    });
  });
});
