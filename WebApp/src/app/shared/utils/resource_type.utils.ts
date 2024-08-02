import { MediaResourceType } from "src/app/core/mapper/resources/media.resource";

export class MediaResourceTypeUtils {

    static colors = {
        [MediaResourceType.folder]: "#7a7a7a",
        [MediaResourceType.image]: "#d4554c",
        [MediaResourceType.video]: "#4c97d4",
        [MediaResourceType.file]: "#4c97d4",
    }

    static icons = {
        [MediaResourceType.folder]: "folder",
        [MediaResourceType.image]: "image",
        [MediaResourceType.video]: "video",
        [MediaResourceType.file]: "insert_drive_file",
    }

    static getColor(id: MediaResourceType) {
        return MediaResourceTypeUtils.colors[id]
    }

    static getIcon(id: MediaResourceType) {
        return MediaResourceTypeUtils.icons[id]
    }
}