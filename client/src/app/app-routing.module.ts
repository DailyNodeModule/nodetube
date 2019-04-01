import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadComponent } from './upload/upload.component';
import { VideoComponent } from './video/video.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
    { 
      path: '',
      redirectTo: '/videos',
      pathMatch: 'full'
    },
    { path: 'videos', component: VideosComponent },
    { path: 'videos/:id', component: VideoComponent },
    { path: 'upload', component: UploadComponent }
];

@NgModule({
  imports: [
	  RouterModule.forRoot(routes)
	],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
