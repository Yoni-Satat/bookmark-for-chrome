let siteUrl = document.querySelector('#siteUrl');
let siteTitle = document.querySelector('#siteTitle');
let addNewWebsite = document.querySelector('#addNewWebsite');
let star = document.querySelector('#star');
let previewTitle = document.querySelector('#previewTitle');
let previewIcon = document.querySelector('#previewIcon');
let addToFavourites = document.querySelector('#add');
let favouritesListWrapper = document.querySelector('#favouritesListWrapper');
let singleFavWrapper = document.querySelector('#singleFavWrapper');

chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
    renderFavourites(favourites)
});

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
    chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
        for (fav of favourites) {
            if (fav.url === tab.url) {
                star.innerHTML = `${fav.title} is already saved!`
            }
        }
    });
});

siteTitle.addEventListener('input', (e) => {
    previewTitle.innerHTML = e.target.value
});

addToFavourites.addEventListener('click', () => {
    let newBookmark = {
        title: previewTitle.innerHTML,
        url: siteUrl.value,
        favIconUrl: previewIcon.src
    }
    chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
        favourites.push(newBookmark);
        chrome.storage.sync.set({ favourites });
    });
    // TODO: hide siteUrl, siteTitle, preview div after successful save to storage
});

chrome.storage.onChanged.addListener(function (changes) {
    let index = changes.favourites.newValue.length - 1;
    console.log(`index: ${index}`);
    let favourites = changes.favourites.newValue;
    let newItemToRender = favourites.at(index);
    createNewFavouriteItem(newItemToRender);
});

renderFavourites = (favourites) => {
    favourites.forEach(favourite => {
        createNewFavouriteItem(favourite);
    });
}

createNewFavouriteItem = (favourite) => {
    let linkToSite = document.createElement('a');
    let favouriteListItem = document.createElement('div');
    let icon = document.createElement('img');
    let title = document.createElement('p');
    let btnDelete = document.createElement('button');

    linkToSite.setAttribute('target', '_blank')
    linkToSite.setAttribute('href', favourite.url);
    linkToSite.setAttribute('class', 'linkToFavourite');
    favouriteListItem.setAttribute('class', 'favouriteListItem')
    icon.setAttribute('src', favourite.favIconUrl);
    title.innerHTML = favourite.title;
    btnDelete.setAttribute('id', `btnDelete-${favourite.url}`);
    btnDelete.setAttribute('class', 'btnDeleteFav')
    btnDelete.innerHTML = 'X';

    favouriteListItem.appendChild(icon);
    favouriteListItem.appendChild(title);
    linkToSite.appendChild(favouriteListItem);
    singleFavWrapper.appendChild(linkToSite);
    singleFavWrapper.appendChild(btnDelete);
    favouritesListWrapper.appendChild(singleFavWrapper);
}


