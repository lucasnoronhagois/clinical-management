import { Sequelize } from 'sequelize';
import * as Models from '../models/index';

interface ModelsObject {
  [key: string]: any;
}

export const loadModels = (sequelize: Sequelize): ModelsObject => {
  const models: ModelsObject = {};
  
  // carregar em loop do index
  Object.entries(Models).forEach(([modelName, ModelClass]) => {
    models[modelName] = ModelClass.load(sequelize);
  });

  // chamar associate se existir
  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};
