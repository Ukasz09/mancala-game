import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './pages/game/game.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular modules
    BrowserModule,
    AppRoutingModule,

    // Custom modules
    GameModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
