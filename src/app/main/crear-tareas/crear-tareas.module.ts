import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTareasPageRoutingModule } from './crear-tareas-routing.module';

import { CrearTareasPage } from './crear-tareas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTareasPageRoutingModule
  ],
  declarations: [CrearTareasPage]
})
export class CrearTareasPageModule {}
