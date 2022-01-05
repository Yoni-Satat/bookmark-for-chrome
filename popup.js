let siteUrl = document.querySelector('#siteUrl');
let siteTitle = document.querySelector('#siteTitle');
let addNewWebsite = document.querySelector('#addNewWebsite');
let starDiv = document.querySelector('#starDiv');
let starIcon = document.querySelector('#starIcon');
let previewTitle = document.querySelector('#previewTitle');
let closePreview = document.querySelector('#closePreview');
let previewIcon = document.querySelector('#previewIcon');
let addToFavourites = document.querySelector('#add');
let favouritesListWrapper = document.querySelector('#favouritesListWrapper');

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
                starIcon.setAttribute('src', 'images/bookmark-star128.png');
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
    addNewWebsite.style.display = 'none';
    starIcon.setAttribute('src', 'images/bookmark-star128.png');
    starDiv.style.display = 'block';
});

chrome.storage.onChanged.addListener(function (changes) {
    let favourites = changes.favourites.newValue;
    favouritesListWrapper.innerHTML = '';
    renderFavourites(favourites);
});

renderFavourites = (favourites) => {
    favourites.forEach(favourite => {
        createNewFavouriteItem(favourite);
    });
}

createNewFavouriteItem = (favourite) => {
    let favTitle = favourite.title.slice(0, 35)
    let linkToSite = document.createElement('a');
    let favouriteListItem = document.createElement('div');
    let icon = document.createElement('img');
    let title = document.createElement('p');
    let btnDelete = document.createElement('button');
    let singleFavWrapper = document.createElement('div');

    linkToSite.setAttribute('target', '_blank')
    linkToSite.setAttribute('href', favourite.url);
    linkToSite.setAttribute('class', 'linkToFavourite');
    favouriteListItem.setAttribute('class', 'favouriteListItem')
    icon.setAttribute('src', favourite.favIconUrl);
    title.innerHTML = favTitle;
    btnDelete.setAttribute('id', `${favourite.url}`);
    btnDelete.setAttribute('class', 'btnDeleteFav');
    btnDelete.addEventListener('click', deleteFavourite)
    btnDelete.innerHTML = 'X';
    singleFavWrapper.setAttribute('id', 'singleFavWrapper');

    favouriteListItem.appendChild(icon);
    favouriteListItem.appendChild(title);
    linkToSite.appendChild(favouriteListItem);
    singleFavWrapper.appendChild(linkToSite);
    singleFavWrapper.appendChild(btnDelete);
    favouritesListWrapper.appendChild(singleFavWrapper);
}

deleteFavourite = (e) => {
    let filtered = [];
    chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
        for (fav of favourites) {
            if (fav.url !== e.target.id) {
                filtered.push(fav);
            }
        }
        starIcon.setAttribute('src', 'images/white-star512.png');
        chrome.storage.sync.set({ favourites: filtered });
    });
}

starDiv.addEventListener('click', () => {
    console.log('add new website clicked');
    addNewWebsite.style.display = 'block';
    starDiv.style.display = 'none';
});

editFavourite = (favourite) => {
    console.log(favourite);

};

closePreview.addEventListener('click', () => {
    starDiv.style.display = 'block';
    addNewWebsite.style.display = 'none';
});




