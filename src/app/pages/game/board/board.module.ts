import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { HoleComponent } from './components/hole/hole.component';
import { StoneComponent } from './components/stone/stone.component';
import { StoreComponent } from './components/store/store.component';



@NgModule({
  declarations: [BoardComponent, HoleComponent, StoneComponent, StoreComponent],
  imports: [
    CommonModule
  ]
})
export class BoardModule { }
