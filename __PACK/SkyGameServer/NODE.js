SkyGameServer.RankModel=OBJECT({preset:()=>{return SkyGameServer.MODEL},params:()=>{let e={name:{notEmpty:!0,size:{max:255}},point:{notEmpty:!0,integer:!0}};return{name:"Rank",methodConfig:{create:{valid:VALID(e)},update:!1,remove:!1}}}}),SkyGameServer("ROLE").ADMIN="Admin";SkyGameServer.AdminRoom=OBJECT({init:(e,n)=>{let o=SkyGameServer.DB("PushKey");SkyGameServer.ROOM("Admin",(e,n,t)=>{let i=()=>{return void 0!==e&&void 0!==e.roles&&CHECK_IS_IN({array:e.roles,value:SkyGameServer.ROLE.ADMIN})===!0};n("auth",(n,o)=>{n===NODE_CONFIG.SkyGameServer.adminPassword?(e.roles=[SkyGameServer.ROLE.ADMIN],o(n===NODE_CONFIG.SkyGameServer.adminPassword)):o(!1)}),n("sendPushMessage",e=>{void 0!==e&&i()===!0&&o.find({filter:{$or:[{lastUpdateTime:{$gt:new Date(Date.now()-7776e6)}},{lastUpdateTime:TO_DELETE,createTime:{$gt:new Date(Date.now()-7776e6)}}]},isFindAll:!0},EACH(n=>{void 0!==n.androidKey&&UPUSH.ANDROID_PUSH({regId:n.androidKey,data:{message:e.message}}),void 0!==n.iosKey&&UPUSH.IOS_PUSH({badge:1,token:n.iosKey,sound:"ping.aiff",message:e.message})}))})})}}),SkyGameServer.MAIN=METHOD({run:e=>{let n=SkyGameServer.LOG_DB("invalidPurchaseLogDB"),o=SkyGameServer.LOG_DB("validPurchaseLogDB"),t=SkyGameServer.DB("PushKey");e((e,i)=>{let s=e.uri,r=e.method,a=e.params;if("rank/save"===s)return"POST"===r?void 0!==a.name&&a.key===SHA256({password:a.name,key:NODE_CONFIG.SkyGameServer.secureKey})?SkyGameServer.RankModel.create({name:a.name,point:a.point},{notValid:()=>{i({statusCode:400,headers:{"Access-Control-Allow-Origin":"*"}})},success:e=>{SkyGameServer.RankModel.count({filter:{point:{$gt:e.point}}},e=>{i({contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},content:e+1})})}}):i({statusCode:400,headers:{"Access-Control-Allow-Origin":"*"}}):i({statusCode:404,headers:{"Access-Control-Allow-Origin":"*"}}),!1;if("rank/list"===s)return SkyGameServer.RankModel.find({sort:{point:-1},count:void 0===a.count?100:a.count},e=>{i({contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},content:JSON.stringify({list:e})})}),!1;if("validatepurchase/android"===s){if("POST"===r){let e=a.productId,t=a.purchaseToken;void 0!==e&&void 0!==t&&UIAP.GOOGLE_PLAY_PURCHASE_VALIDATE({productId:e,purchaseToken:t},s=>{s!==!0?n.log({productId:e,purchaseToken:t}):o.log({productId:e,purchaseToken:t}),i({contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},content:JSON.stringify({productId:e,isValid:s})})})}else i({statusCode:404,headers:{"Access-Control-Allow-Origin":"*"}});return!1}if("validatepurchase/ios"===s){if("POST"===r){let e=a.productId,t=a.purchaseReceipt;void 0!==e&&void 0!==t&&UIAP.APP_STORE_PURCHASE_VALIDATE({productId:e,receipt:t},s=>{s!==!0?n.log({productId:e,purchaseReceipt:t}):o.log({productId:e,purchaseReceipt:t}),i({contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},content:JSON.stringify({productId:e,isValid:s})})})}else i({statusCode:404,headers:{"Access-Control-Allow-Origin":"*"}});return!1}if("savepushkey/android"===s){if("POST"===r){let e=a.pushKey,n=a.language;void 0!==e&&t.get({filter:{androidKey:e}},{notExists:()=>{t.create({androidKey:e,language:n},e=>{i({content:JSON.stringify(e),contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"}})})},success:e=>{t.update({id:e.id,language:n},e=>{i({content:JSON.stringify(e),contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"}})})}})}else i({statusCode:404,headers:{"Access-Control-Allow-Origin":"*"}});return!1}if("savepushkey/ios"===s){if("POST"===r){let e=a.pushKey,n=a.language;void 0!==e&&t.checkExists({filter:{iosKey:e}},{notExists:()=>{t.create({iosKey:e,language:n},e=>{i({content:JSON.stringify(e),contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"}})})},success:e=>{t.update({id:e.id,language:n},e=>{i({content:JSON.stringify(e),contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"}})})}})}else i({statusCode:404,headers:{"Access-Control-Allow-Origin":"*"}});return!1}})}});