import { MutationResolvers } from "../../generated/typings";
import User from "../../db/models/User.js";

const mutations: MutationResolvers = {
  Mutation: {
    async register(
      _,
      { registerInputs: { username, email, password, configmPassword } }
    ) {
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      return {
        ...res,
        id: res._id,
      };
    },
  },
};

export default mutations;
