"use strict";

import jwt from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler.js";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.service.js";

const EXPIRESIN_ACCESS_TOKEN = "2d";
const EXPIRESIN_REFRESH_TOKEN = "7d";

const HEADER = {
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "refresh-token",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: EXPIRESIN_ACCESS_TOKEN,
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: EXPIRESIN_REFRESH_TOKEN,
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
      1 - Check userId missing?
      2 - get accessToken
      3 - verifyToken
      4 - check user in bds?
      5 - check keyStore with this userId?
      6 - OK all => return next()
   */
  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found KeyStore");

  // console.log("HEADERS:", req.headers);
  // 3
  const authHeader = req.headers[HEADER.AUTHORIZATION];
  if (!authHeader) throw new NotFoundError("Missing Authorization header");

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) throw new NotFoundError("Invalid Request");

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Userid");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
      1 - Check userId missing?
      2 - get accessToken
      3 - verifyToken
      4 - check user in bds?
      5 - check keyStore with this userId?
      6 - OK all => return next()
   */
  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found KeyStore");

  // 3
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid Userid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const authHeader = req.headers[HEADER.AUTHORIZATION];
  if (!authHeader) throw new NotFoundError("Missing Authorization header");

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) throw new NotFoundError("Invalid Request");

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Userid");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySercet) => {
  return jwt.verify(token, keySercet);
};

export { createTokenPair, authentication, verifyJWT, authenticationV2 };
