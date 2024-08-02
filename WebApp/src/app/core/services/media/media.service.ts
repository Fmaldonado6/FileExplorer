import { environment } from 'src/environments/environment';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpEvent, HttpParams } from '@angular/common/http';
import { FolderResource, MoveMediaResource } from 'src/app/core/mapper/resources/media.resource';
import { Media, MediaFolder } from 'src/app/core/models/media.types';
import { Serialization } from 'src/app/shared/utils/serialization.utils';
import { MediaFilter, SearchFilter } from 'src/app/shared/utils/search-filters';

@Injectable({
  providedIn: 'root'
})
export class MediaService extends DataService {

  constructor() {
    super(environment.backEnd.baseUrl + '/Medias');
  }


  getMediaInFolder(folder?: string) {

    let url = `${this.url}/Folder`

    if (folder != null) url += "/" + folder

    return this.http.get<FolderResource>(url).pipe(
      map(e => {
        const folderResource = Serialization.toInstance(FolderResource, e)
        folderResource.medias = Serialization.toInstanceArray(Media, folderResource.medias)
        folderResource.folders = Serialization.toInstanceArray(MediaFolder, folderResource.folders)
        return folderResource;
      }),
      catchError(this.handleError)
    )
  }


  createFolder(folder: MediaFolder) {
    return this.http.post(`${this.url}/Folder`, folder).pipe(catchError(this.handleError))

  }

  moveFiles(moveMediaResource: MoveMediaResource) {
    return this.http.post(`${this.url}/MoveHere`, moveMediaResource).pipe(catchError(this.handleError))

  }

  deleteFolder(folderId: string) {
    return this.http.delete(`${this.url}/Folder/${folderId}`).pipe(catchError(this.handleError))

  }

  addMedia(file: File, media: Media): Observable<HttpEvent<Media>> {
    const formData = new FormData();

    formData.append('file', file, file.name)
    formData.append('mediaResource', JSON.stringify(media))

    return this.http.post<Media>(`${this.url}`, formData,
      { reportProgress: true, observe: 'events' })
      .pipe(
        catchError(this.handleError)
      )

  }

  deleteMedia(mediaId: string) {
    return this.http.delete(`${this.url}/${mediaId}`, { reportProgress: true, observe: 'events' })
      .pipe(catchError(this.handleError))

  }

  getMediasCount(filters: MediaFilter[] = []) {
    let params = new HttpParams()

    const searchFilters = SearchFilter.ToHttpParam(filters)

    if (searchFilters != null)
      params = params.append("$filter", searchFilters)

    return this.http.get<number>(`${this.url}/Count`, { params })
      .pipe(catchError(this.handleError))
  }

}
