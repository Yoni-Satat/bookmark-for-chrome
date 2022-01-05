let favourites = [{
    title: 'Freepik',
    url: 'https://www.flaticon.com/',
    favIconUrl: 'https://www.flaticon.com/'
}];

chrome.runtime.onInstalled.addListener(() => {
    // access chrome storage and set default values
    chrome.storage.sync.set({
        favourites
    });
});