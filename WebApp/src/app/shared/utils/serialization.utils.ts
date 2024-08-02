export class Serialization {
    static toInstance<T extends Object>(c: new () => T, data: any): T {
        return Object.assign(new c(), data);
    }
    static toInstanceArray<T extends Object>(c: new () => T, data: any): T[] {
        var array: Array<T> = [];
        data.map((x: any) => array.push(Object.assign(new c(), x)));
        return array;
    }
    static toInstanceConstructor<T extends Object>(c: new (x: any) => T, data: any): T {
        return new c(data);
    }
    static toInstanceConstructorArray<T extends Object>(c: new (x: any) => T, data: any): T[] {
        var array: Array<T> = [];
        data.map((y: any) => array.push(new c(y)));
        return array;
    }
}