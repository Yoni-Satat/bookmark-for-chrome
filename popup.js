let siteUrl = document.querySelector('#siteUrl');
let siteTitle = document.querySelector('#siteTitle');
let previewTitle = document.querySelector('#previewTitle');
let previewIcon = document.querySelector('#previewIcon');
let addToFavourites = document.querySelector('#add');

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

getCurrentTab().then((tab) => {
    siteTitle.value = tab.title;
    siteUrl.value = tab.url;
    previewTitle.innerHTML = siteTitle.value;
    previewIcon.src = tab.favIconUrl;
    previewIcon.alt = tab.title;
});

siteTitle.addEventListener('input', (e) => {
    previewTitle.innerHTML = e.target.value
});

addToFavourites.addEventListener('click', () => {

});