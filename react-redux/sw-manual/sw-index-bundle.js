(function(){"use strict";function a(a){var b;switch(a.arrayFormat){case"index":return function(a,c,d){return b=/\[(\d*)\]$/.exec(a),a=a.replace(/\[\d*\]$/,""),b?void(void 0===d[a]&&(d[a]={}),d[a][b[1]]=c):void(d[a]=c)};case"bracket":return function(a,c,d){return b=/(\[\])$/.exec(a),a=a.replace(/\[\]$/,""),b&&void 0!==d[a]?void(d[a]=[].concat(d[a],c)):void(d[a]=c)};default:return function(a,b,c){return void 0===c[a]?void(c[a]=b):void(c[a]=[].concat(c[a],b))};}}function b(a){if(Array.isArray(a))return a.sort();return"object"==typeof a?b(Object.keys(a)).sort(function(c,a){return+c-+a}).map(function(b){return a[b]}):a}function c(c,d){d=Object.assign({arrayFormat:"none"},d);var e=a(d),f=Object.create(null);// Create an object with no prototype
// https://github.com/sindresorhus/query-string/issues/47
return"string"==typeof c?(c=c.trim().replace(/^(\?|#|&)/,""),!c)?f:(c.split("&").forEach(function(a){var b=a.replace(/\+/g," ").split("="),c=b.shift(),d=0<b.length?b.join("="):void 0;// Firefox (pre 40) decodes `%3D` to `=`
// https://github.com/sindresorhus/query-string/pull/37
d=void 0===d?null:decodeURIComponent(d),e(decodeURIComponent(c),d,f)}),Object.keys(f).sort().reduce(function(a,c){var d=f[c];return a[c]=!d||"object"!=typeof d||Array.isArray(d)?d:b(d),a},Object.create(null))):f}function d(a,b,c,{transformItem:d=a=>a}={}){return new Promise(e=>{function f(){let h=b[g++];if(!h)return e();let i=a.transaction(c,"readwrite"),j=i.objectStore(c);j.add(d(h)).onsuccess=f}if(!b)return e();let g=0;f()})}function e(a,b){let c=a.transaction("syncInfo","readwrite"),d=c.objectStore("syncInfo"),e=d.get(1);return new Promise(a=>{e.onsuccess=({target:{result:c}})=>{Object.assign(c,b),d.put(c).onsuccess=a}})}function f(a,b){let c=indexedDB.open("books",1);return new Promise(d=>{c.onsuccess=()=>{let e=c.result,f=e.transaction(b,"readwrite"),g=f.objectStore(b);g.delete(a).onsuccess=d}})}function g(a=1){let b=indexedDB.open("books",1);// Set up the database schema
b.onsuccess=()=>{let a=b.result;Promise.all([new Promise(b=>h(a,b)),i(a),j(a),k(a)]).then(()=>{e(a,{lastSync:+new Date})})}}function h(a,b,c=1){n(5,{page:c,pageSize:50},"allBooks","Books").then(e=>{d(a,e,"books",{transformItem:a=>Object.assign(a,{imgSync:0,title_ci:(a.title||"").toLowerCase()})}).then(()=>{e.length==50?h(a,b,c+1):l(a,b)})})}function i(a,b=1){return n(18,{},"allSubjects","Subjects").then(b=>d(a,b,"subjects"))}function j(a,b=1){return n(23,{},"allTags","Tags").then(b=>d(a,b,"tags"))}function k(a,b=1){return n(13,{},"allLabelColors","LabelColors").then(b=>d(a,b,"labelColors"))}async function l(a,b){async function c(){}let d=a.transaction("books"),e=d.objectStore("books"),f=e.index("imgSync"),g=f.openCursor(0),h=[];g.onsuccess=a=>{let b=a.target.result;if(!b)return c();let d=b.value;h.push({_id:d._id,smallImage:d.smallImage}),b.continue()}}async function m(a){let b=a.smallImage;if(b){let a=await caches.match(b);if(!a){if(/https:\/\/s3.amazonaws.com\/my-library-cover-uploads/.test(b)){let a=await caches.open("local-images1"),c=await fetch(b,{mode:"cors",credentials:"omit"});return await a.put(b,c),!0}if(/https:\/\/images-na\.ssl-images-amazon\.com/.test(b)){let a=await caches.open("amazon-images1"),c=await fetch(b,{mode:"cors",credentials:"omit"});return await a.put(b,c),!0}if(/https:\/\/ecx\.images-amazon\.com/.test(b)){let a=await caches.open("amazon-images2"),c=await fetch(b,{mode:"cors",credentials:"omit"});return await a.put(b,c),!0}}}}function n(a,b,c,d){return w(`/graphql/?query=${a}&variables=${JSON.stringify(b)}`).then(a=>a.json()).then(a=>a.data&&a.data[c]&&a.data[c][d])}function o(a){let b,c,d=JSON.parse(a),{page:g=1,pageSize:h=50,title_contains:e,sort:f}=d,i=null,j=(g-1)*h;if(e){let a=new RegExp(escapeRegex(e),"i");i=b=>a.test(b.title),c=0,b=j}else c=j,b=0;let k=f?Object.keys(f)[0]:null,l=f&&"_id"!=k?"pages"==k?"pages":"title_ci":"dateAdded",m=k&&-1==f[k]?"prev":void 0;return p("books",l,{predicate:i,skip:b,cursorSkip:c,limit:h,idxDir:m}).then(x("allBooks","Books",{Meta:{count:12}}))}function p(a,b=null,{predicate:c,idxDir:d,cursorSkip:e,skip:f,limit:g}={}){let h=indexedDB.open("books",1);return c||(c=()=>!0),new Promise(i=>{h.onsuccess=()=>{let j=h.result,k=j.transaction(a),l=k.objectStore(a),m=b?l.index(b).openCursor(null,d):l.openCursor(d),n=[],o=0,p=!1;m.onsuccess=a=>{let b=a.target.result;if(e&&!p)return p=!0,b.advance(e);if(!b)return i(n);let d=b.value;return c(d)&&(f&&o<f?o++:n.push(d),g&&n.length==g)?i(n):void b.continue()}}})}async function q({request:a,response:b},c,d=a=>a){let e=`create${c}`;b&&b.data&&b.data[e]&&b.data[e][c]&&u(d(b.data[e][c]),`${c.toLowerCase()}s`);let g=`update${c}`;b&&b.data&&b.data[g]&&b.data[g][c]&&u(d(b.data[g][c]),`${c.toLowerCase()}s`);let h=`update${c}s`;b&&b.data&&b.data[h]&&b.data[h][c+"s"]&&b.data[h][c+"s"].forEach(a=>u(d(a),`${c.toLowerCase()}s`));if(b&&b.data&&b.data[`delete${c}`]){let b=await a.json();f(b.variables._id,c.toLowerCase()+"s")}}function r(a){a&&a.data&&a.data.updateSubject&&a.data.updateSubject.forEach(a=>u(a,`subjects`))}function u(a,b,c=a=>a){let d=indexedDB.open("books",1);return new Promise(e=>{d.onsuccess=()=>{let f=d.result,g=f.transaction(b,"readwrite"),h=g.objectStore(b);h.get(a._id).onsuccess=({target:{result:b}})=>{b?(Object.assign(b,c(a)),h.put(b).onsuccess=e):h.add(c(a)).onsuccess=e}}})}// 10 seconds
function v(){let a=indexedDB.open("books",1);a.onsuccess=async()=>{let b=a.result;if(b.objectStoreNames.contains("syncInfo")){let[a={}]=await p("syncInfo");if(Date.now()-a.lastSync>z){let c=`/graphql/?query=${14}&variables=${JSON.stringify({timestamp:a.lastSync})}`,{data:d}=await w(c).then(a=>a.json());for(let a of d.allBooks.Books)await u(a,"books",y);for(let a of d.allSubjects.Subjects)await u(a,"subjects");for(let a of d.allTags.Tags)await u(a,"tags");for(let{_id:a}of d.deletedBooks._ids)await deleteItem(a,"books");for(let{_id:a}of d.deletedSubjects._ids)await deleteItem(a,"subjects");for(let{_id:a}of d.deletedTags._ids)await deleteItem(a,"tags");await e(b,{lastSync:+new Date}),console.log("SYNC COMPLETE")}}},a.onupgradeneeded=b=>{let c=a.result;if(!c.objectStoreNames.contains("books")){let a=c.createObjectStore("books",{keyPath:"_id"});a.createIndex("imgSync","imgSync",{unique:!1}),a.createIndex("title_ci","title_ci",{unique:!1}),a.createIndex("dateAdded","dateAdded",{unique:!1}),a.createIndex("pages","pages",{unique:!1})}if(c.objectStoreNames.contains("syncInfo")||(c.createObjectStore("syncInfo",{keyPath:"id"}),b.target.transaction.objectStore("syncInfo").add({id:1})),!c.objectStoreNames.contains("subjects")){let a=c.createObjectStore("subjects",{keyPath:"_id"});a.createIndex("name","name",{unique:!1})}if(!c.objectStoreNames.contains("tags")){let a=c.createObjectStore("tags",{keyPath:"_id"});a.createIndex("name","name",{unique:!1})}if(!c.objectStoreNames.contains("labelColors")){let a=c.createObjectStore("labelColors",{keyPath:"_id"});a.createIndex("order","order",{unique:!1})}b.target.transaction.oncomplete=g}}const w=a=>fetch(a,{method:"get",credentials:"include",headers:{Accept:"application/json","Content-Type":"application/json"}}),x=(a,b)=>c=>new Response(JSON.stringify({data:{[a]:{[b]:c}}})),y=a=>Object.assign(a,{title_ci:(a.title||"").toLowerCase()});self.addEventListener("message",a=>{"sw-update-accepted"==a.data&&self.skipWaiting().then(()=>{self.clients.claim().then(()=>{self.clients.matchAll().then(a=>{a.forEach(a=>a.postMessage("sw-updated"))})})})}),self.addEventListener("push",()=>{self.registration.showNotification("Push notification received!")}),self.addEventListener("message",a=>{a.data&&"do-sync"==a.data.command&&v()}),self.addEventListener("activate",v),workbox.routing.registerRoute(/graphql/,({url:a,event:b})=>fetch(b.request).catch(()=>{let{query:b,variables:d}=c(a.search);return b==13?p("labelColors","order").then(x("allLabelColors","LabelColors")):18==b?p("subjects","name").then(x("allSubjects","Subjects")):b==23?p("tags","name").then(x("allTags","Tags")):b==4?o(d):void 0}),"GET"),workbox.routing.registerRoute(/graphql$/,({url:a,event:b})=>{let c=b.request.clone();return fetch(b.request).then(a=>{let b=a.clone();return b.json().then(a=>{q({request:c,response:a},"Book",y),q({request:c,response:a},"Tag"),r(a)}),a})},"POST");const z=15000})();
