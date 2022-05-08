import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private firestore: AngularFirestore) { }

  getTarea(documentId: string) {
    return this.firestore.collection("tareas").doc(documentId).snapshotChanges();
  }

  getTareas() {
    return this.firestore.collection("tareas").snapshotChanges();
  }
//   Modificar para que apunten al usuario
  createTarea(data: { nombre: string, fecha: Data, detalle: string, /*usuario: string*/ }) {
    return this.firestore.collection("tareas").add(data);
  }

  updateTarea(documentId: string, data: any) {
    return this.firestore.collection("tareas").doc(documentId).set(data);
  }

  deleteTarea(documentId: string) {
    return this.firestore.collection("tareas").doc(documentId).delete();
  }

}
