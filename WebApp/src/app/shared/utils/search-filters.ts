import { MediaType } from "src/app/core/models/media.types";

export abstract class SearchFilter {
    /**Id to identify filter if multiple filters are needed */
    id?: number;

    /**Filter name in case it need to be shown in a filter search bar */
    name?: string

    /**Disables delete button in filter search bar */
    canBeRemoved = true

    /**Filter color for search bar pill */
    color?: string

    /**Property that the filter will use */
    searchProperty?: string

    static DefaultColor = "#42a6f5"

    /**Disables delete button in filter search bar */
    setCanbeRemoved(canBeRemoved: boolean) {
        this.canBeRemoved = canBeRemoved;
        return this
    }

    /**Filter name in case it need to be shown in a filter search bar */
    setName(name: string) {
        this.name = name
        return this;
    }


    /**Value of the property that the filter will use */
    setSearchProperty(searchProperty: string) {
        this.searchProperty = searchProperty
        return this;
    }

    /**Filter color for search bar pill */
    setColor(color: string) {
        this.color = color
        return this;
    }

    /**Id to identify filter if multiple filters are needed */
    setId(id: number) {
        this.id = id
        return this;
    }

    abstract getProperty(id: number, value: string): string

    static ToHttpParam<T extends SearchFilter>(filters: T[]) {
        let filterParams: string[] = []

        const filterMap = new Map<number, T[]>()

        for (let filter of filters) {
            if (filterMap.has(filter.id!)) filterMap.get(filter.id!)?.push(filter)
            else filterMap.set(filter.id!, [filter])

        }

        filterMap.forEach((v, k) => {

            let newFilter: string[] = []

            v.forEach(filter => {
                const filterParam = filter.getProperty(filter.id!, filter.searchProperty!)
                newFilter.push(filterParam)
            })

            filterParams.push("(" + newFilter.join(" or ") + ")")
        })

        return filterParams.length > 0 ? filterParams.join(" and ") : null
    }
}



export class MediaFilter extends SearchFilter {

    static WrittenFilterId = 1;
    static MediaTypeFilterId = 2;


    static VideoFilter = new MediaFilter()
        .setName("Videos")
        .setId(this.MediaTypeFilterId)
        .setSearchProperty(MediaType.Video.toString())

    static ImageFilter = new MediaFilter()
        .setName("Imágenes")
        .setId(this.MediaTypeFilterId)
        .setSearchProperty(MediaType.Image.toString())

    static FileFilter = new MediaFilter()
        .setName("Archivos")
        .setId(this.MediaTypeFilterId)
        .setSearchProperty(MediaType.File.toString())

    private static properties = {
        [this.WrittenFilterId]: (value: string) => {
            return `contains(tolower(name),'${value.toLowerCase()}') `
        },

        [this.MediaTypeFilterId]: (value: string) => {
            return `mediaTypeId eq ${value}`
        },
    }

    getProperty(id: number, value: string): string {
        return MediaFilter.properties[id]?.(value)
    }

}