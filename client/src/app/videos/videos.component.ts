import { Component, OnInit, Input } from '@angular/core';
import { APIClientService } from '../apiclient.service';
import Video from '../Video';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  providers: [ APIClientService ]
})
export class VideosComponent implements OnInit {
  constructor(private api: APIClientService) { }

  public results: Video[] = [];

  @Input()
  public query: string; 

  @Input()
  public limit: number; 

  @Input()
  public skip: number; 

  async ngOnInit() {
    this.results = await this.api.search(this.limit, this.skip, this.query);
  }

}
