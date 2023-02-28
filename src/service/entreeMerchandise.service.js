import entreeMerchandiseModel from "../models/entreeMerchandise.model.js";


export const deletebyMerchandise = async ({ merchandise }) => {
  await entreeMerchandiseModel.deleteMany({ merchandise });
};
