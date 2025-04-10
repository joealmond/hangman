import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <h1>404: Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a routerLink="/menu">Return to Menu</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }
    
    h1 {
      color: #e74c3c;
    }
    
    a {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    
    a:hover {
      background-color: #2980b9;
    }
  `]
})
export class NotFoundComponent {}