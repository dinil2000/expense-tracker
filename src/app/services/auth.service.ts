import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../user';
export interface CurrentUser {
  name: string;
  email: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
 
  
  private apiUrl = 'http://localhost:5000/api/auth'; // Adjust to match your backend route
  public isLoggedIn = false;
  private currentUser: { name: string; email: string; [key: string]: any } | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Register User
  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response) => console.log('Registration successful:', response)),
      catchError((error) => {
        console.error('Registration failed:', error);
        return of(null); // Return null or handle error appropriately
      })
    );
  }

  // Check if Username Exists
  checkIfUserNameExist(userName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/check-username`, { 
      params: { userName } 
    }).pipe(
      tap((response) => console.log('Username check response:', response)),
      catchError((error) => {
        console.error('Error checking username:', error);
        return of([]); // Return an empty array on error
      })
    );
  }
  

  // Login User  just knew changes in git
  loginUser(userName: string, password: string): Observable<any> {
    const loginData = { userName, password };
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        if (response.token) {
          const expirationTime = Date.now() + 3600 * 1000; // 1-hour expiration
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenExpiry', expirationTime.toString());
          localStorage.setItem('loggedInUser', response.user.userName); // Save username
          localStorage.setItem(
            'currentUser',
            JSON.stringify(response.user.name) // Save the entire user object
          );
          if (response.user.id) {
            localStorage.setItem('userId', response.user.id); // Save userId
          }
          
          this.isLoggedIn = true;
          this.scheduleAutoLogout(3600 * 1000); // Schedule auto logout
        }
        // console.log("current: ", localStorage.getItem('currentUser'));
        
      }),
      catchError((error) => {
        // console.error('Login failed:', error);
        return of(null); // Return null or handle error appropriately
      })
    );
  }
  

  // Schedule Auto Logout
  scheduleAutoLogout(expirationDuration: number) {
    setTimeout(() => {
      this.logout();
      alert('Session expired. You have been logged out.');
    }, expirationDuration);
  }

  // Check Authentication Status
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry) {
      return false;
    }

    const isTokenValid = Date.now() < parseInt(tokenExpiry, 10);
    if (!isTokenValid) {
      this.logout();
    }

    return isTokenValid;

  }

  // Logout User
  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('currentUser');

    this.router.navigate(['/login']);
  }

  // Get Current Logged-In User
// Update the return type of getCurrentUser()
getCurrentUser(): CurrentUser | null {
  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('currentUser');
  return token && currentUser ? JSON.parse(currentUser) : null;
}

  

  // Add Authorization header for protected API calls
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  // Example of making a request to a protected route
  getExpenses(): Observable<any> {
    return this.http.get('http://localhost:5000/api/expenses', { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching expenses:', error);
        return of(null); // Handle error appropriately
      })
    );
  };
  updateUserProfile(profileData: FormData): Observable<any> {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored
    console.log("userid :",userId);

    return this.http.put(`http://localhost:5000/api/user/profile/${userId}`, profileData);
    
  }
  
  getCurrentUserDetails(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.get(`http://localhost:5000/api/user/profile/${userId}`);

  }
  


}
