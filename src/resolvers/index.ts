import { Resolvers } from "../generated/typings.js";
import queries from "./queries/queries.js";
import mutations from "./mutations/mutations.js";

const resolvers: Resolvers = { ...queries, ...mutations };

export default resolvers;
