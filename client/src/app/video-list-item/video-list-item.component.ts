import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Video from "../Video";

@Component({
  selector: 'app-video-list-item',
  templateUrl: './video-list-item.component.html',
  styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent implements OnInit {
  @Input() 
  public video: Video;

  public imageUrl: SafeUrl;

  setImageUrl() {
  	this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.video.thumbnailUrl);
  }

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.setImageUrl();
  }

}
