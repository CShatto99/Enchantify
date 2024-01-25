import Server from '../../models/Server';

export default async function getServer(serverId: string) {
  return Server.findOne({ serverId });
}
