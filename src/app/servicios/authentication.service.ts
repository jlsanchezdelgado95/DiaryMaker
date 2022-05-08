import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  datosUsuario: Observable<firebase.User>;
  email: String;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.datosUsuario = this.angularFireAuth.authState;
  }
  accederService(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password)
  }

  registarseService(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  salirSesionService() {
    this.angularFireAuth.signOut();
  }

  logeado() {
    return this.angularFireAuth.authState.pipe(map(auth => auth));
  }
}
