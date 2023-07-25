export const convertHtmlToText = (value) => {
    // console.info(value);
    let str = (typeof value === 'string') ? value : value.toString();
    // console.info(str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' '));
    return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ');
}