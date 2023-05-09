import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = 'https://teachers-groupb.herokuapp.com/api/users';
  }



  registroUsuario(values: { rol: string, username: string, email: string, password: string }) {
    return firstValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/register`, values)
    )
  }
}
