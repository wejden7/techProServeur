import outMerchandiseModel from "../models/outMerchandise.model.js";
import moment from "moment-timezone";
export const create = async (req, res, next) => {
  try {
    const { out, merchandise } = req.body;
    const month = moment().startOf("month").format();
    const existe = await outMerchandiseModel.findOne({ merchandise, month });
    let data;
    if (!existe) {
      const query = { month, out, merchandise };
      data = await outMerchandiseModel.create(query);
    } else {
      existe.out.push(out);
      data = await existe.save();
    }

    return res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const findByMerchandise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await outMerchandiseModel.find({ merchandise: id });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await outMerchandiseModel.findById(id);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { out } = req.body;
    const { _id, count, demond } = out;
    const data = await outMerchandiseModel.findOneAndUpdate(
      { _id: id, "out._id": _id },
      {
        $set: {
          "out.$.count": count,
          "items.$.demond": demond,
        },
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id, outId } = req.params;
    let data = await outMerchandiseModel.findById(id);
    data.out.pull({ _id: outId });
    data = await data.save();
    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};
