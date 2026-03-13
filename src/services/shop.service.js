"user strict";

import shopModel from "../models/shop.model.js";

export const findByEmail = async ({
  email,
  select = { email: 1, password: 2, name: 1, status: 1, roles: 1 },
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};
