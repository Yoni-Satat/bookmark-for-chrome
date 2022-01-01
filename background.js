let favourites = [{
    title: 'My Bookmarks',
    url: 'https://www.example.com',
    favIconUrl: 'https://www.flaticon.com/'
}];

chrome.runtime.onInstalled.addListener(() => {
    // access chrome storage and set default values
    chrome.storage.sync.set({
        favourites
    });
});