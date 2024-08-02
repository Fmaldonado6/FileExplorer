export class ValidateMediaFile {

    private static validFileExtensions: string[] = [
        "jpg", "jpeg", "png", "mp4", "pdf"
    ];

    private static maxBytes = 1e9;

    public static isValid(file: any): boolean {

        // File Size Validation
        if (file.size > this.maxBytes)
            return false;

        // File Extension Validation
        var extension = this.getFileExtension(file.name);
        if (!extension) return false
        var isValid = this.validFileExtensions.indexOf(extension) !== -1;
        return isValid;
    }

    private static getFileExtension(filename: string): string | undefined {
        return filename.split('.').pop();
    }

}
