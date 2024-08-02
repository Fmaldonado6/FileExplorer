export class Media {
    id?: string

    filename?: string
    originalFilename?: string

    mediaTypeId?: number
    mediaType?: MediaType

    mediaFolderId?: string
    mediaFolder?: MediaFolder

    dateCreated?: Date
}


export class MediaFolder {
    id?: string
    name?: string

    parentFolderId?: string
    
    dateCreated?: Date
    dateUpdated?: Date

    medias?: Media[]
    folders?: MediaFolder[]
}

export class MediaType {
    id?: number
    name?: string


    static Image = 1
    static Video = 2
    static File = 3
}