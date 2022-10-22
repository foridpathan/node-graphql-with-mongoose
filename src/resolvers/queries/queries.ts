import { QueryResolvers } from "../../generated/typings";
import User from "../../db/models/User.js";

const queries: QueryResolvers = {
  Query: {
    getUsers: async () => {
      const res = await User.find();
      return res;
    },
  },
};

export default queries;
