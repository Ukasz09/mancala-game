import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { HoleComponent } from './hole/hole.component';
import { StoneComponent } from './stone/stone.component';
import { StoreComponent } from './store/store.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [
    GameComponent,
    HoleComponent,
    StoneComponent,
    StoreComponent,
    BoardComponent,
  ],
  imports: [CommonModule],
  exports: [GameComponent],
})
export class GameModule {}
