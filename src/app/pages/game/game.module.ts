import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { BoardModule } from './board/board.module';

@NgModule({
  declarations: [GameComponent],
  imports: [
    // Angular modules
    CommonModule,

    // Custom modules
    BoardModule,
  ],
  exports: [GameComponent],
})
export class GameModule {}
