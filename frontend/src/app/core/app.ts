import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
 templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {}

