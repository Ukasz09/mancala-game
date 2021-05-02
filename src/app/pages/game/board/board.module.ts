import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { HoleComponent } from './components/hole/hole.component';
import { StoreComponent } from './components/store/store.component';

@NgModule({
  declarations: [BoardComponent, HoleComponent, StoreComponent],
  imports: [CommonModule],
  exports: [BoardComponent, HoleComponent, StoreComponent],
})
export class BoardModule {}
