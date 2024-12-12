import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface User {
  name: string;
  email: string;
  mobile: string;
  profileImage?: string | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profileImage: string | ArrayBuffer | null = null;
  defaultImage = 'https://via.placeholder.com/100';

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfileData();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
    });
  }

  private loadProfileData(): void {
    this.authService.getCurrentUserDetails().subscribe((user: User) => {
      this.profileForm.patchValue(user);
      this.profileImage = user.profileImage || this.defaultImage;
    });
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.profileImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.entries(this.profileForm.value).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });
    if (this.profileImage && typeof this.profileImage === 'string') {
      formData.append('profileImage', this.profileImage);
    }

    this.authService.updateUserProfile(formData).subscribe((response: any) => {
      alert('Profile updated successfully!');
      localStorage.removeItem('currentUser');

      this.router.navigate(['/dashboard'])
      
    });
  }
}
