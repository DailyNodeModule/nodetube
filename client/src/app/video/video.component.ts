import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import Video from '../Video';
import { APIClientService } from "../apiclient.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  constructor(private route: ActivatedRoute, private api: APIClientService, private sanitizer: DomSanitizer) { }

  public video: Video;
  public imageUrl: SafeUrl;

  setUrls() {
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.video.thumbnailUrl);
  }

  async ngOnInit() {
    const id = this.route.snapshot.params["id"];
    this.video = await this.api.findById(id);
    this.setUrls();
  }
}
