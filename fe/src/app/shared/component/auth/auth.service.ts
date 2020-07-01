import { Observable } from 'rxjs';

export abstract class AuthService {
  abstract isAuthenticated(): boolean;

  abstract logout(): Observable<any>;

  abstract getUsername(): string;

  abstract getUserEmail(): string;
}
