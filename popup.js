let siteUrl = document.querySelector('#siteUrl');
let siteTitle = document.querySelector('#siteTitle');
let addNewWebsite = document.querySelector('#addNewWebsite');
let starDiv = document.querySelector('#starDiv');
let starIcon = document.querySelector('#starIcon');
let previewTitle = document.querySelector('#previewTitle');
// let closePreview = document.querySelector('#closePreview');
let previewIcon = document.querySelector('#previewIcon');
let addFav = document.querySelector('#addFav');
let favouritesListWrapper = document.querySelector('#favouritesListWrapper');
let editFav = document.querySelector('#editFav');

addNewWebsite.style.visibility = 'hidden';

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
            } else {
                starIcon.setAttribute('src', 'images/white-star512.png');
            }
        }
    });
});

siteTitle.addEventListener('input', (e) => {
    previewTitle.innerHTML = e.target.value
});

addFav.addEventListener('click', () => {
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
    chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
        for (fav of favourites) {
            if (siteUrl.value === fav.url) {
                editFav.style.display = 'block';
                addFav.style.display = 'none';
            }
        }
    });
    addNewWebsite.style.visibility = addNewWebsite.style.visibility === 'hidden' ? '' : 'hidden';
});

editFav.addEventListener('click', () => {
    let updatedFav = {};

    getCurrentTab().then((tab) => {
        chrome.storage.sync.get(["favourites"], ({ favourites }) => {
            for (let i = 0; i < favourites.length; i++) {
                if (favourites[i].url === tab.url) {
                    console.log(`found a match at index ${i}`);
                    updatedFav = {
                        url: siteUrl.value,
                        title: siteTitle.value,
                        favIconUrl: tab.favIconUrl
                    }
                    favourites[i] = updatedFav;
                }
            }
            console.log(favourites);
            chrome.storage.sync.set({ favourites });
            siteTitle.value = '';
            siteUrl.value = '';
        });
    });
});

// closePreview.addEventListener('click', () => {
//     starDiv.style.display = 'block';
//     addNewWebsite.style.display = 'none';
// });




