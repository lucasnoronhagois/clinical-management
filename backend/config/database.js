import * as Models from '../models/index.js';

export const loadModels = (sequelize) => {
  const models = {};
  // const fileNames = fs.readdirSync('./models')
  // console.log(Models);
  
  // fileNames .forEach((fileName) => {
  //     if (fileName === 'index.js') {
  //       return;
  //     }

  //   const filePath = `../models/${fileName}`;
  //   const model = require(filePath).default;

  //   models[modelName] = model.load(sequelize);
  // })

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

//ainda vou precisar importar/exportar um por um no index

/* outra forma seria nao usar o import models;
usar filesystem (fs);
// fs.readdirSync
*/