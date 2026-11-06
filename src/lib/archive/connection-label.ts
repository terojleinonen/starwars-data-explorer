/** Catalogue field names stay catalogue links; they do not imply a story event. */
export function connectionLabel(relation:string):string {
 const catalogue:Record<string,string>={films:"film catalogue link",characters:"character catalogue link",people:"character catalogue link",planets:"world catalogue link",starships:"starship catalogue link",vehicles:"vehicle catalogue link",species:"species catalogue link",residents:"resident catalogue link",pilots:"pilot catalogue link"};
 return catalogue[relation]??relation.replaceAll("_"," ");
}
