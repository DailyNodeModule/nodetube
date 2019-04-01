import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';

import { 
  MatToolbarModule, 
  MatSidenavModule, 
  MatIconModule, 
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

import { MatVideoModule } from "mat-video";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { VideoComponent } from './video/video.component';
import { VideosComponent } from './videos/videos.component';
import { VideoListItemComponent } from './video-list-item/video-list-item.component';
import { APIClientService } from './apiclient.service';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    VideoComponent,
    VideosComponent,
    VideoListItemComponent
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule, 
    MatListModule,
    MatButtonModule,
    AppRoutingModule,
    MatCardModule,
    MatVideoModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    APIClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
