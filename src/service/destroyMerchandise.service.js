import destroyMerchandiseModel from "../models/destroyMerchandise.model.js";

export const createNew = async (query) => {
  const data = await destroyMerchandiseModel.create(query);
  return data;
};
export const addDestroy = async(modal,query)=>{
    modal.destroy.push(query);
    const data = await modal.save();
    return data;
}
