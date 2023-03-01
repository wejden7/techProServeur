import model from "../models/pointPreparation.model.js";

export const openClose = async (req, res, next) => {
  try {
    const { id } = req.params;

    const point = await model.findById(id);
    point.ferme = !point.ferme;
    await point.save();
    return res.status(200).json(true);
  } catch (error) {
    return next(error);
  }
};
