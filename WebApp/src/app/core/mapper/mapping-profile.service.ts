import { Injectable } from "@angular/core";
import { MediaResource, MediaResourceType } from "./resources/media.resource";
import { Media, MediaFolder, MediaType } from "../models/media.types";
import { DateUtils } from "src/app/shared/utils/date.utils";


//Aqui tambien se configura un mapper pero la verdad me dio flojera para este repo asi que lo hice manual
@Injectable({
    providedIn: 'root'
})
export class MappingProfile {

    mapMediaToResource(data: Media | MediaFolder): MediaResource {
        const mediaResource = new MediaResource();

        mediaResource.id = data.id;

        mediaResource.dateCreated = DateUtils.fromUtcToLocal(data.dateCreated)!
        mediaResource.dateUpdated = DateUtils.fromUtcToLocal(data.dateCreated)!

        if (data instanceof Media) {
            mediaResource.fileName = data.filename
            mediaResource.name = data.originalFilename
            if (data.mediaTypeId == MediaType.Image) mediaResource.resourceType = MediaResourceType.image
            else if (data.mediaTypeId == MediaType.Video) mediaResource.resourceType = MediaResourceType.video
            else if (data.mediaTypeId == MediaType.File) mediaResource.resourceType = MediaResourceType.file

        } else {
            mediaResource.name = data.name
            mediaResource.resourceType = MediaResourceType.folder
        }

        return mediaResource
    }

    mapResourceToMedia(data: MediaResource) {
        const media = new Media()
        media.id = data.id
        media.originalFilename = data.name
        media.filename = data.fileName
        media.dateCreated = data.dateCreated
        media.mediaTypeId = data.resourceType == MediaResourceType.image
            ? MediaType.Image
            : MediaType.Video
        return media
    }


    mapResourceToFolder(data: MediaResource) {
        const folder = new MediaFolder()
        folder.id = data.id
        folder.name = data.name
        folder.dateCreated = data.dateCreated
        folder.dateUpdated = data.dateUpdated
        return folder
    }

    mapMediaArrayToResource(data: Media[]): MediaResource[] {
        return data.map(e => this.mapMediaToResource(e))
    }
}