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