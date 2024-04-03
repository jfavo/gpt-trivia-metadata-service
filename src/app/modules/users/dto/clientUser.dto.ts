import { User } from './user.dto';

/**
 * User object that is safe to send to the client
 * (Doesn't contain sensitive info like passwords)
 */
export class ClientUser {
  id: number;
  username: string;
  email: string;
  birthDate: Date;
  role: string;
}

export function MapClientUserFromUser(user: User): ClientUser {
  const clientUser = new ClientUser();
  clientUser.id = user.id;
  clientUser.username = user.username;
  clientUser.email = user.email;
  clientUser.birthDate = user.birthDate;
  clientUser.role = user.role;
  return clientUser;
}
