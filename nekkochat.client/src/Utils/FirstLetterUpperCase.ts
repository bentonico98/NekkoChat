export default function FirstLetterUpperCase(str:string){
    return str[0].toUpperCase() + str.slice(1, str.length);
}