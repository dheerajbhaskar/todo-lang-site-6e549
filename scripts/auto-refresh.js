// Notes on SHA (also written sha/Sha here)
// - SHA being referred to is the git commit SHA
//  - for our purposes we're using the HEAD~1
//    - documentSha has the HEAD~1 sha when it was committed. This is same as the latest sha before the document is committed
//    - repoSha has HEAD~1
// - there are two SHAs
//  - documentSha - Sha from the current html document
//  - repoSha - Sha from the git repo
//  - If the above two don't match we need to update the document by refreshing the page
// Took some help from bing chat. TODO Use this more

function getDocumentSha() {
  let documentSha = document.querySelector("#commit").dataset.value;

  // end script if documentSha doesn't exist
  if (!documentSha) {
    //documentSha doesn't exist for some reason
    console.error("documentSha is falsey, but expected a valid SHA");
    return;  // end the execution of this script
  }

  // console.log(documentSha);
  return documentSha;
}

async function getRepoSha() {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/vnd.github.sha");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://api.github.com/repos/dheerajbhaskar/todo-lang-site-6e549/commits/HEAD~1", requestOptions);
    const result = await response.text();
    let repoSha = result;
    // console.log(repoSha);
    if (repoSha) {
      return repoSha;
    } else {
      throw new Error("repoSha is falsey, but expected a valid SHA");
    }
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

async function refreshIfUpdateAvailable() {
  let documentSha = getDocumentSha();
  let repoSha = await getRepoSha();

  // console.log(documentSha, documentSha);
  // console.log(repoSha, repoSha);

  // reload page if update available
  if (documentSha != repoSha) {
    console.log("New update available, reloading");
    window.location = `${location.protocol}//${location.host}${location.pathname}?${repoSha}`; // if you don't reconstruct the url, you'll add query params to url with query params ie multiple `?`
  } else {
    console.log(`No update available as of ${new Date()}`);
  }
}

// check for updates every 10s
setInterval(async () => {
  await refreshIfUpdateAvailable();
}, 10 * 1000);
