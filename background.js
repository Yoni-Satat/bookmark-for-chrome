let favourites = [{
    title: 'Freepik',
    url: 'https://www.flaticon.com/',
    favIconUrl: 'https://media.flaticon.com/dist/min/img/favicon.ico'
}];

chrome.runtime.onInstalled.addListener(() => {
    // access chrome storage and set default values
    chrome.storage.sync.set({
        favourites
    });
});