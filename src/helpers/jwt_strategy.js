import userModel from "#models/user.model.js";
import employerModel from "#models/employer.model.js";
import JWT from "passport-jwt";
import dotenv from "dotenv";

dotenv.config();

const { Strategy: JwtStrategy, ExtractJwt } = JWT;

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.KEY_JWT,
};

export default new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
  

    if (jwt_payload) {
      return done(null, jwt_payload);
    } else {
      return done(true, false);
      // or you could create a new account
    }
  } catch (error) {
    return done(error, false);
  }
});
