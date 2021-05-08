import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { StoneComponent } from './stone/stone.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [GameComponent, StoneComponent, BoardComponent],
  imports: [CommonModule],
  exports: [GameComponent],
})
export class GameModule {}
