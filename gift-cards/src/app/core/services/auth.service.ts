import { Injectable } from "@angular/core";
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { BehaviorSubject } from "rxjs";
import { User } from "../../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private user$ = new BehaviorSubject<User | null>(null);

  async signIn(email: string, password: string) {
    return await signIn({
      username: email,
      password: password,
    })
  }

  async signOut() {
    return await signOut({ global: true });
  }

  async getCurrentUser() {
    const { username, userId } = await getCurrentUser();
    this.user$.next(new User(username, userId));
  }

  async getTokenSession() {
    const { tokens } = await fetchAuthSession();
    return tokens?.idToken?.toString();
  }
  
}
