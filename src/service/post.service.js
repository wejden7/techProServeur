import postModel from "#models/post.model.js";

export const postUser = async (id, user) => {
  const { etablissement } = user;
  const query = { _id: id, etablissement };
  const post = await postModel.findOne(query);
  if (!post) return false;
  return true;
};
