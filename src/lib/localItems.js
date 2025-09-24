export const LS_KEY = "local_items_v1";
export function readLocalItems(){try{return JSON.parse(localStorage.getItem(LS_KEY)||"[]")}catch{return[]}}
export function writeLocalItems(arr){localStorage.setItem(LS_KEY,JSON.stringify(arr||[]))}
export function saveLocalItem(item){const a=readLocalItems();const i=a.findIndex(x=>String(x.id)===String(item.id));if(i>=0)a[i]=item;else a.unshift(item);writeLocalItems(a);return item}
export function getLocalItemById(id){return readLocalItems().find(x=>String(x.id)===String(id))}
export function isLocalId(id){return String(id||"").startsWith("local-")}
export function mergeLocalFirst(api=[],local=[]){const m=new Map();for(const it of api){const k=String(it?.id??it?._id??it?.productId??"");if(k)m.set(k,it)}for(const it of local){const k=String(it?.id??"");if(k)m.set(k,it)}return Array.from(m.values()).filter(Boolean)}
