import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeacherroleGuard implements CanActivate {

  constructor(
    private router: Router,
    ) { }

  canActivate(): boolean | UrlTree {
    let role: string | null = localStorage.getItem('user_role');
    let token: string | null = localStorage.getItem('token_login');

    if(role === 'profesor' && token ){
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}