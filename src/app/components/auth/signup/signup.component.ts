import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        userName: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordChecker() }
    );
  }

  // Custom validator for password match
  passwordChecker(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      if (!password || !confirmPassword) {
        return null; // Skip validation if either field is empty
      }

      if (password !== confirmPassword) {
        return { passwordMismatch: true }; // Passwords do not match
      }

      return null; // Validation passed
    };
  }

  registerUser() {
    const { userName } = this.signupForm.value;
    const user = this.signupForm.value;

    if (this.signupForm.invalid) {
      alert('Please fill all fields correctly.');
      return;
    }

    this.authService.checkIfUserNameExist(userName).subscribe((users: any[]) => {
      if (users.length) {
        alert('Username already exists');
      } else {
        this.authService.registerUser(user).subscribe((result) => {
          console.log('Registration successful:', result);
          alert('Successfully registered');
          this.signupForm.reset(); // Reset the form
          this.router.navigate(['/login']);
        });
      }
    });
  }

  get f() {
    return this.signupForm.controls;
  }
}
