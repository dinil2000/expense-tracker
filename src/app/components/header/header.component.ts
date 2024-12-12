import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatToolbarModule,MatButtonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  userName: string | null =localStorage.getItem('currentUser')

  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.setUserName();
console.log("name:  ",    this.userName);
  }
  setUserName(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser); // Parse the JSON string
      this.userName = parsedUser || null; // Safely access the name property
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
