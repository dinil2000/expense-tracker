import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private userProfile = { name: 'John Doe', username: 'johndoe' };

  getUserProfile() {
    return this.userProfile;
  }

  updateUserProfile(profile: any) {
    this.userProfile = profile;
  }
}
