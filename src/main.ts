import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient

bootstrapApplication(AppComponent , {
  providers: [provideHttpClient(), ...appConfig.providers]  // Add HttpClientModule here
})
  .catch((err) => console.error(err));
