export class DateUtils {


    static getUTCNow() {
        var date = new Date();
        var now_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds());

        return now_utc
    }

    static fromUtcToLocal(utcDate?: Date) {
        if (utcDate == null) return null;
        utcDate = new Date(utcDate);
        var newDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }

    static toUTC(date: Date) {
        const newDate = new Date(date);
        var now_utc = new Date(newDate.getUTCFullYear(), newDate.getUTCMonth(),
            newDate.getUTCDate(), newDate.getUTCHours(),
            newDate.getUTCMinutes(), newDate.getUTCSeconds());

        return now_utc
    }

    static getShortDate(date: Date) {
        const newDate = new Date(date)
        return newDate.toLocaleString()
    }

    static getShortDateWithTime(date: Date) {
        const newDate = new Date(date)
        return newDate.toLocaleString()
    }

    static getTime(date: Date) {
        const newDate = new Date(date)
        let minutes = newDate.getMinutes().toString();

        if (minutes.length == 1)
            minutes = "0" + minutes

        return newDate.getHours() + ":" + minutes
    }

    static getTime12Hours(date: Date) {
        const newDate = new Date(date)

        const amPm = newDate.getHours() >= 12 ? 'PM' : 'AM'
        const hours = newDate.getHours() > 12 ? newDate.getHours() - 12 : newDate.getHours()

        let minutes = newDate.getMinutes().toString();

        if (minutes.length == 1)
            minutes = "0" + minutes

        return hours + ":" + minutes + " " + amPm
    }
}
