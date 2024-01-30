import Server from '../../models/Server';

export default async function createServer(serverId: string) {
  return Server.create({ serverId });
}
