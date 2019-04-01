import { APIClientService } from "./apiclient.service";
class Video {
    constructor(public id: number, public title: string) {

    }

    public get thumbnailUrl() {
        return `${APIClientService.APIURLBase}/api/thumbnail/${this.id}`;
    }

    public get streamUrl() {
        return `${APIClientService.APIURLBase}/api/stream/${this.id}`;
    }
}

export default Video;