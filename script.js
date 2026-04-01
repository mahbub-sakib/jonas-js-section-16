'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     // console.log(this.responseText);

//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     const currencyName = Object.keys(data.currencies)[0];
//     console.log(currencyName);

//     const languageName = Object.keys(data.languages)[0];

//     const html = `
//         <article class="country">
//           <img class="country__img" src="${data.flags.svg}" />
//           <div class="country__data">
//             <h3 class="country__name">${data.name.common}</h3>
//             <h4 class="country__region">${data.region}</h4>
//             <p class="country__row"><span>👫</span>${data.population}</p>
//             <p class="country__row"><span>🗣️</span>${data.languages[languageName]}</p>
//             <p class="country__row"><span>💰</span>${data.currencies[currencyName].name}</p>
//           </div>
//         </article>
//     `;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// }

// getCountryData('bangladesh');
// getCountryData('usa');
// getCountryData('portugal');

const renderCountry = function (data, className = '') {
  const currencyName = Object.keys(data.currencies)[0];
  // console.log(currencyName);

  const languageName = Object.keys(data.languages)[0];

  const html = `
        <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[languageName]}</p>
            <p class="country__row"><span>💰</span>${data.currencies[currencyName].name}</p>
          </div>
        </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

const getCountryAndNeighbour = function (country) {

  // ajax call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    // console.log(this.responseText);

    const [data] = JSON.parse(this.responseText);
    // console.log(data);

    renderCountry(data);

    // get neighbour country 
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // ajax call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      console.log(this.responseText);
      const [data2] = JSON.parse(this.responseText);

      renderCountry(data2, 'neighbour');
    });

  });
}

// getCountryAndNeighbour('bangladesh');
// getCountryAndNeighbour('brazil');

// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('1 second passed');
//     setTimeout(() => {
//       console.log('1 second passed');
//     }, 1000);
//   }, 1000);
// }, 1000);


const request = fetch(`https://restcountries.com/v3.1/name/bangladesh`);
// console.log(request);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// }

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const [neighbour] = data[0]?.borders;
      console.log(neighbour);
      if (!neighbour) return;

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      renderCountry(data[0], 'neighbour')
    })
}

getCountryData('bangladesh');