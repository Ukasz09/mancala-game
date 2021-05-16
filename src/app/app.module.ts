import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './pages/game/game.module';
import { HomeModule } from './pages/home/home.module';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    // Angular modules
    BrowserModule,
    AppRoutingModule,

    // Custom modules
    GameModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
