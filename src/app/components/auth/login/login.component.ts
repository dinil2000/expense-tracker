import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user = {
    userName: '',
    password: '',
  };

  loading = false; // Show a loading state during login attempts

  constructor(private authService: AuthService, private router: Router) {}

  loginUser() {
    // Validate inputs
    if (!this.user.userName.trim() || !this.user.password.trim()) {
      alert('Please enter both username and password');
      return; // Exit if inputs are invalid
    }

    this.loading = true; // Start loading

    this.authService.loginUser(this.user.userName, this.user.password).subscribe(
      (response) => {
        this.loading = false; // Stop loading

        if (response && response.token) {
          alert('Login successful');
          this.authService.isLoggedIn = true; // Update service state
          this.router.navigate(['/dashboard']).then((success) => {
            if (success) {
              console.log('Navigation to dashboard successful');
            } else {
              console.error('Navigation to dashboard failed');
            }
          });
        } else {
          alert('Invalid credentials. Please try again.');
          this.user = { userName: '', password: '' }; // Reset form
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.loading = false; // Stop loading
        alert('Login failed. Please check your credentials or try again later.');
        this.user = { userName: '', password: '' }; // Reset form
      }
    );
  }
}
