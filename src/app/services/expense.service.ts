import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api/expenses'; // Replace with your JSON server URL
  private expenseUpdates = new BehaviorSubject<any[]>([]); // BehaviorSubject to hold expenses

  // private apiUrl = `${environment.apiUrl}/expenses`;
  constructor(private http: HttpClient) { }
  private expenses = [];
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }
  
  //for refreshadding expense-------------------------------

  refreshExpenses(): void {
    this.getExpenses().subscribe((expenses) => {
      this.expenseUpdates.next(expenses); // Push updated expenses to the BehaviorSubject
    });
  }
  

  getExpenseUpdates(): Observable<any[]> {
    return this.expenseUpdates.asObservable();
  }

  addExpense(expense: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, expense, { headers }).pipe(
      tap(() => this.refreshExpenses()), // Trigger refresh after adding
      catchError((error) => {
        console.error('Error adding expense:', error);
        return of(null);
      })
    );
  }
  
  
  
  getExpenses(userName?: string): Observable<any[]> {
    const url = userName ? `${this.apiUrl}?userName=${userName}` : this.apiUrl;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching expenses:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
  
  
  getCurrentUser(): string | null {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('loggedInUser'); // Assume we store the username upon login
    return token && userName ? userName : null;
  }
  

  getFilteredExpenses(userName: string, month: number, year: number): Observable<any[]> {
    const url = `${this.apiUrl}?userName=${userName}&month=${month}&year=${year}`;
    return this.http.get<any[]>(url);
  }
  
  updateExpense(id: string, expenseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, expenseData, { headers: this.getAuthHeaders() }).pipe(
    
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating expense:', {
          status: error.status,
          message: error.message,
          error: error.error,
        });
        return throwError(() => new Error('Failed to update expense. Please try again.'));
      })
    );
  }
  
  
  
  
  

// Delete an expense
deleteExpense(id: string): Observable<any> {
  const token = localStorage.getItem('token'); // Replace 'authToken' with your actual token key
  
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
    tap(() => this.refreshExpenses()), // Trigger refresh after deletion
    catchError((error) => {
      console.error('Error deleting expense:', error);
      return throwError(() => new Error(error.message));
    })
  );
}




}
