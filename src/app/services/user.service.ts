import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<User | null>(null);
  private uniqueId = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.getUniqueId().subscribe(id => this.uniqueId.next(id));
  }

  login(name: string, password: string): Observable<User> {
    return this.http.post<User>('/api/user/login', { name, password });
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/user/register', { name, email, password });
  }

  getUniqueId(): Observable<string> {
    return this.http.get<{ uuid: string }>('/api/user/uniqueid').pipe(
        map(response => response.uuid)  // Extract the 'uuid' property as a string
    );
  }


  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  setCurrentUser(user: User | null): void {
    this.currentUser.next(user);
  }

  getCurrentUniqueId(): Observable<string> {
    return this.uniqueId.asObservable();
  }
}