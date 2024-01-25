import mongoose from 'mongoose';
import { ServerModel } from '../@types/custom';

const serverSchema = new mongoose.Schema<ServerModel>({
  serverId: String,
  enchantments: {
    type: Map,
    of: {
      gear: [String],
      level: String,
      price: String,
    },
    default: {},
  },
});

const Server = mongoose.model('Server', serverSchema);

export default Server;
