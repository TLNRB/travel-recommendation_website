export const normalize = (value: string): string => {
   /**
    * trim() – removes leading/trailing spaces
    * replace(/\s+/g, ' ') – removes extra spaces between words
    * replace(/\b\w/g, c => c.toUpperCase()) – capitalizes first letter of each word
   */

   return value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}