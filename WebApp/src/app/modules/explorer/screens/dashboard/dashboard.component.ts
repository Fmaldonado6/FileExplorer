import { MediaResourceTypeUtils } from './../../../../shared/utils/resource_type.utils';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardBlockComponent } from "./components/dashboard-block/dashboard-block.component";
import { MediaResource, MediaResourceType, MoveMediaResource } from 'src/app/core/mapper/resources/media.resource';
import { HttpEventType } from '@angular/common/http';
import { Media, MediaFolder } from 'src/app/core/models/media.types';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MappingProfile } from 'src/app/core/mapper/mapping-profile.service';
import { MediaService } from 'src/app/core/services/media/media.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MediaFilter } from 'src/app/shared/utils/search-filters';
import { forkJoin, lastValueFrom } from 'rxjs';
import { ValidateMediaFile } from 'src/app/shared/utils/file.utils';
import { LoadingSnackbarComponent } from './components/loading-snackbar/loading-snackbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { EmptyMessageComponent } from 'src/app/shared/components/empty-message/empty-message.component';
import { FolderTreeComponent } from './components/folder-tree/folder-tree.component';
import { FolderNameDialogComponent } from './components/folder-name-dialog/folder-name-dialog.component';
import { ActionsMenuComponent } from "./components/actions-menu/actions-menu.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    DashboardBlockComponent,
    MatTableModule,
    LoadingSnackbarComponent,
    MatProgressSpinnerModule,
    CommonModule,
    MatMenuModule,
    EmptyMessageComponent,
    FolderTreeComponent,
    ActionsMenuComponent
  ]
})
export class DashboardComponent implements OnInit {

  Status = Status

  initialStatus = Status.loading
  mediaStatus = Status.loading

  mediaService = inject(MediaService)
  mapper = inject(MappingProfile)
  snackBar = inject(MatSnackBar)
  dialog = inject(MatDialog)


  folderStack: MediaFolder[] = []
  currentFolderName: string = "Inicio"

  totalCount = 0;
  imageCount = 0;
  videoCount = 0;
  fileCount = 0;

  totalMediasInFolder = 0

  items: MediaResource[] = []
  dataSource = new MatTableDataSource<MediaResource>();

  selectedRows = new Map<string, MediaResource>()
  lastSelectedIndex: number | null = null
  lastRow?: MediaResource
  selectMultiple: SelectMultipleTypes = SelectMultipleTypes.disabled
  filesToMove: MediaResource[] = []

  draggingOver?: MediaResource

  displayedColumns = ["name", "lastModified", "more"]

  tablePageOptions: number[] = [5, 10, 20];
  tablePageSize = 5
  tablePageIndex = 0

  DateUtils = DateUtils

  dragType = DragTypes.none
  DragTypes = DragTypes

  isDraggingFiles = false

  MediaResourceType = MediaResourceType
  MediaResourceTypeUtils = MediaResourceTypeUtils

  constructor() { }

  ngOnInit() {
    this.getInitialData();


  }


  async getInitialData() {

    await this.getTotalMediaCount();
    this.initialStatus = Status.loaded
    this.getMediaInFolder();
  }


  moveFilesClicked() {
    this.filesToMove = [...this.selectedRows.values()]
  }

  cancelMove() {
    this.filesToMove = []

  }

  moveFilesHere() {
    const moveFilesResource = new MoveMediaResource()

    for (let media of this.filesToMove) {

      if (media.resourceType == MediaResourceType.folder) {
        const folder = this.mapper.mapResourceToFolder(media)
        moveFilesResource.folderResources.push(folder)
      } else {
        const image = this.mapper.mapResourceToMedia(media)
        moveFilesResource.mediaResources.push(image)
      }
    }


    moveFilesResource.moveToId = this.folderStack.peek()?.id
    this.mediaService.moveFiles(moveFilesResource).subscribe(e => {
      this.getMediaInFolder(this.folderStack.peek())
      this.filesToMove = []
    })


  }

  openCreateFolderDialog() {
    const dialog = this.dialog.open(FolderNameDialogComponent)

    const createSub = dialog.componentInstance.createClicked.subscribe(e => {
      createSub.unsubscribe();
      this.addFolder(e)
      dialog.close();
    })

  }


  async getTotalMediaCount() {
    try {
      const requests = forkJoin([
        this.mediaService.getMediasCount(),
        this.mediaService.getMediasCount([MediaFilter.ImageFilter]),
        this.mediaService.getMediasCount([MediaFilter.VideoFilter]),
        this.mediaService.getMediasCount([MediaFilter.FileFilter])
      ])

      const [total, imageCount, videoCount, fileCount] = await lastValueFrom(requests)
      this.totalCount = total
      this.imageCount = imageCount
      this.videoCount = videoCount
      this.fileCount = fileCount
    } catch (error) {
      console.error(error)
    }
  }

  async getMediaInFolder(folder?: MediaFolder) {
    this.selectedRows.clear()

    const isInStack = this.folderStack.find(e => e.id == folder?.id)
    while (isInStack || folder == null) {
      const currentFolder = this.folderStack.pop();
      if (currentFolder == null || currentFolder.id == folder?.id) break;

    }

    if (folder != null) this.folderStack.push(folder)

    this.currentFolderName = folder?.name ?? "Inicio"

    this.mediaService.getMediaInFolder(folder?.id).subscribe({
      next: (value) => {
        const folders = this.mapper.mapMediaArrayToResource(value.folders)
        const medias = this.mapper.mapMediaArrayToResource(value.medias)
        this.items = [...folders, ...medias]
        this.dataSource = new MatTableDataSource(this.items)
        if (this.items.length == 0) {
          this.mediaStatus = Status.empty
          return;
        }

        this.mediaStatus = Status.loaded;

      },
      error: (error) => {
        this.mediaStatus = Status.error
      }
    })

  }

  async addFolder(name: string) {
    const folder = new MediaFolder();

    const parentFolder = this.folderStack.peek()

    folder.name = name
    folder.parentFolderId = parentFolder?.id

    this.mediaService.createFolder(folder).subscribe({
      next: (val) => {
        this.getMediaInFolder(parentFolder)
      },
      error: (error) => { },
    })
  }

  deleteFolder(folder: MediaFolder) {
    const deleting = this.snackBar.open("Eliminando...")
    this.mediaService.deleteFolder(folder.id!).subscribe({
      next: (val) => {
        this.getMediaInFolder(this.folderStack.peek())
        deleting.dismiss();
        this.snackBar.open("Eliminado exitosamente", "CERRAR", { duration: 2000 })
      },
      error: (error) => {
        deleting.dismiss();

      },
    })
  }

  deleteMedia(media: MediaResource) {
    const deleting = this.snackBar.open("Eliminando...")
    this.mediaService.deleteMedia(media.id!).subscribe({
      next: async (val) => {

        if (val.type != HttpEventType.Response) return;

        deleting.dismiss();

        this.getMediaInFolder(this.folderStack.peek())
        this.snackBar.open("Eliminado exitosamente", "CERRAR", { duration: 2000 })
        await this.getTotalMediaCount();

      },
      error: (error) => {
        deleting.dismiss();

      },
    })
  }
  touchtime = 0

  onRowClicked(row: MediaResource) {
    if (row.resourceType == MediaResourceType.folder && !this.filesToMove.find(e => e.id == row.id))
      this.getMediaInFolder(row)
  }

  onRowSelected(row: MediaResource, index: number) {
    const now = new Date().getTime();
    const touchTimeDifference = now - this.touchtime;
    const isDoubleClick = touchTimeDifference < 400;

    if (this.selectMultiple == SelectMultipleTypes.disabled) {
      this.lastSelectedIndex = null
      this.selectedRows.clear()
      this.selectedRows.set(row.id!, row)
    }

    if (this.selectMultiple == SelectMultipleTypes.range) {

      const selectedIndex = this.lastSelectedIndex ?? index
      const start = selectedIndex > index ? index : selectedIndex
      const end = selectedIndex > index ? selectedIndex : index

      const range = this.items.slice(start, end + 1)
      range.forEach(e => {
        this.selectedRows.set(e.id!, e)
      })

    }

    if (this.selectMultiple == SelectMultipleTypes.individual) {

      if (this.selectedRows.has(row.id!))
        this.selectedRows.delete(row.id!)
      else
        this.selectedRows.set(row.id!, row)
    }

    if (isDoubleClick && this.lastRow == row) {
      this.onRowClicked(row)
      this.touchtime = 0;
    }

    this.touchtime = now;
    this.lastSelectedIndex = index
    this.lastRow = row
  }

  isRowSelected(id: string) {
    return this.selectedRows.has(id)
  }

  deleteClicked(item: MediaResource) {
    if (item.resourceType == MediaResourceType.folder) this.deleteFolder(item)
    else this.deleteMedia(item)

  }


  dragFilesStart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingFiles = true
  }

  dragFilesStop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingFiles = false
  }

  dropFiles(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingFiles = false


    const dropEvent = event as DragEvent
    const file = dropEvent.dataTransfer!.files[0]
    const isFileValid = ValidateMediaFile.isValid(file)

    if (!isFileValid) {
      this.snackBar.open("Archivo inválido", "Aceptar", { duration: 2000 })
      return
    }

    // this.readFile(file)
    this.addMedia(file)


  }

  async addMedia(file: File) {
    const loadingindicator = this.snackBar.openFromComponent(LoadingSnackbarComponent)


    const media = new Media()
    media.mediaFolderId = this.folderStack.peek()?.id

    this.mediaService.addMedia(file, media).subscribe({
      next: async (e) => {
        if (e.type == HttpEventType.UploadProgress) {
          loadingindicator.instance.progress.set(e.loaded)
          return
        }

        if (e.type != HttpEventType.Response) return;

        this.getMediaInFolder(this.folderStack.peek())

        await this.getTotalMediaCount();

        loadingindicator.dismiss();

        this.snackBar.open("Archivo cargado con éxito", "CERRAR", { duration: 2000 })
      },
      error: (error) => {
        console.error("error", error)
        loadingindicator.dismiss();

      }
    })
  }


  fileUpload(event: Event) {
    const fileEvent = event as InputEvent
    const input = fileEvent.target as HTMLInputElement
    const file = input.files![0]

    const isFileValid = ValidateMediaFile.isValid(file)
    input.files = null

    if (!isFileValid) {
      this.snackBar.open("Archivo inválido", "Aceptar", { duration: 2000 })
      return
    }

    this.addMedia(file)
  }


  getLastModified(date: Date) {
    date = new Date(date)
    return date.toLocaleString()
  }



  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: any) {
    if (e.key == 'Shift') this.selectMultiple = SelectMultipleTypes.range
    if (e.key == 'Control') this.selectMultiple = SelectMultipleTypes.individual
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: any) {
    if (e.key == 'Shift') this.selectMultiple = SelectMultipleTypes.disabled
    if (e.key == 'Control') this.selectMultiple = SelectMultipleTypes.disabled
  }
}


enum Status {
  loading,
  loaded,
  error,
  empty,
  emptySearch
}


enum DragTypes {
  none,
  element,
  file
}

enum SelectMultipleTypes {
  disabled,
  range,
  individual
}