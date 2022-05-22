import * as functions from "firebase-functions";
import fetch from "node-fetch";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();
type Content ={
 "data":[{
   "contentId": string
   "title": string
   "description": string
 }]
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  const apiRequest = ():Promise<Content> => fetch("https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=%E5%91%8A%E7%9F%A5&targets=title&_sort=-startTime&_offset=1&_context=apitest&_limit=4&fields=contentId,title,description&filters[genre][0]=%E6%96%99%E7%90%86")
      .then((x) => x.json());
  const main = async () => {
    const result = await apiRequest();
    try {
      result.data.forEach( async (res) => await db
          .collection("raw")
          .doc(res.contentId)
          .set(res));
    } catch (err) {
      functions.logger.error(err);
    }
    functions.logger.info(result);
    response.send(result);
  };
  main();
});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
