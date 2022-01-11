let siteUrl = document.querySelector('#siteUrl');
let siteTitle = document.querySelector('#siteTitle');
let tooltip = document.querySelector('#tooltip');
let addNewWebsite = document.querySelector('#addNewWebsite');
let starDiv = document.querySelector('#starDiv');
let starIcon = document.querySelector('#starIcon');
let previewTitle = document.querySelector('#previewTitle');
let previewIcon = document.querySelector('#previewIcon');
let addFav = document.querySelector('#addFav');
let favouritesListWrapper = document.querySelector('#favouritesListWrapper');
let updateFav = document.querySelector('#updateFav');

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
            console.log(`fav.url: ${fav.url}\ntab.url: ${tab.url}\n${fav.url === tab.url}`);
            if (fav.url === tab.url) {
                starIcon.setAttribute('src', 'images/bookmark-star128.png');
                console.log('yay');
            } else {
                starIcon.setAttribute('src', 'images/white-star512.png');
            }
        }
    });
});

siteTitle.addEventListener('input', (e) => {
    previewTitle.innerHTML = e.target.value
});

siteUrl.addEventListener('mouseover', () => {
    console.log('hovering over url input');
    tooltip.style.display = 'block';
});

siteUrl.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
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
    addNewWebsite.style.visibility = 'hidden';
    starIcon.setAttribute('src', 'images/bookmark-star128.png');
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

starDiv.addEventListener('click', () => {
    getCurrentTab().then((tab) => {
        siteTitle.value = tab.title;
        siteUrl.value = tab.url;
    });
    chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
        for (fav of favourites) {
            if (siteUrl.value === fav.url) {
                updateFav.style.display = 'block';
                addFav.style.display = 'none';
                siteTitle.value = fav.title;
            } else {
                updateFav.style.display = 'none';
                addFav.style.display = 'block';
            }
        }
    });
    addNewWebsite.style.visibility = addNewWebsite.style.visibility === 'hidden' ? '' : 'hidden';
});

deleteFavourite = (e) => {
    let filtered = [];
    let hideForm = false;
    chrome.storage.sync.get(["favourites"], ({ favourites = [] }) => {
        for (fav of favourites) {
            if (fav.url !== e.target.id) {
                filtered.push(fav);
                hideForm = true;
            }
        }
        starIcon.setAttribute('src', 'images/white-star512.png');
        if (hideForm) { addNewWebsite.style.visibility = 'hidden' };
        chrome.storage.sync.set({ favourites: filtered });
    });
}

updateFav.addEventListener('click', () => {
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
            addNewWebsite.style.visibility = 'hidden';
        });
    });
});





