export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
  gitType: string;
  actorId?: number | null;
  actor?: string | null;
}
