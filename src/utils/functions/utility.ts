import { glpi_itilcategories } from "src/modules/glpi-api-rest/domain/model/glpi_itilcategories.entity";

export const convertHtmlToText = (value) => {
    // console.info(value);
    let str = (typeof value === 'string') ? value : value.toString();
    // console.info(str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' '));
    return str.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ');
}

function attachChildrenByItem(item: glpi_itilcategories, data: glpi_itilcategories[]) {
    const children = data
      .filter(d => d.itilcategories_id === item.id)
      .map(d => attachChildrenByItem(d, data))
    return children.length ? { ...item, children } : item
  }
  
export function attachChildren(data: glpi_itilcategories[]) {
    return data.filter(item => {
      const index = data.findIndex(itemNested => itemNested['id'] === item.itilcategories_id)
      if (index <= -1) {
        return true
      }
    }).map(d => attachChildrenByItem(d, data))
  }