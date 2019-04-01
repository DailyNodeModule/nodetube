import { Injectable } from '@angular/core';
import * as qs from "qs";
import Video from './Video';

@Injectable({
  providedIn: 'root'
})
export class APIClientService {
  constructor() { }

  public static get APIURLBase(): string {
    return localStorage.API_URL_BASE || '';
  }

  public async search(limit: number = 20, skip: number = 0, query?: string): Promise<Video[]> {
    const response = await fetch(`${APIClientService.APIURLBase}/api/search?${qs.stringify({ limit, skip, query })}`);
    
    const raw = await response.json();
    
    return raw.map((rawVideoObj) => {
      return new Video(rawVideoObj.id, rawVideoObj.title);
    });
  }

  public async findById(id: string): Promise<Video> {
    const response = await fetch(`${APIClientService.APIURLBase}/api/videos/${id}`);
    const rawVideoObj = await response.json();
    return new Video(rawVideoObj.id, rawVideoObj.title);
  }

  public async upload(body: FormData): Promise<Video> {
    const response = await fetch(`${APIClientService.APIURLBase}/api/upload`, {
      body,
      method: 'POST'
    });
    const rawVideoObj = await response.json();
    return new Video(rawVideoObj.id, rawVideoObj.title);
  }
}
