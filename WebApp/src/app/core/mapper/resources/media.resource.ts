import { Media, MediaFolder } from "src/app/core/models/media.types"

export class MediaResource {
    id?: string
    resourceType?: number
    name?: string
    fileName?: string
    dateCreated?: Date
    dateUpdated?: Date
}

export class FolderResource {
    folders: MediaFolder[] = []
    medias: Media[] = []
    name!: string
}


export enum MediaResourceType {
    folder, image, video,file
}

export class MoveMediaResource {
    public moveToId?: string;
    public mediaResources: Media[] = []
    public folderResources: MediaFolder[] = []
}