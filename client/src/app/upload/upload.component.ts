import { Component, OnInit } from '@angular/core';
import { APIClientService } from "../apiclient.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(private api: APIClientService, private router: Router) { }

  private status: string;

  ngOnInit() {
  }

  async doUpload(event) {
    event.preventDefault();

    const body = new FormData(event.target);
    const upload = await this.api.upload(body);

    this.router.navigate([`/videos/${upload.id}`]);
  }

}
