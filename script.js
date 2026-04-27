'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);

};

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

const getJSON = function (url, errorMsg = 'Something wesnt wrong!') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  })

};


// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       console.log(response);
//       if (!response.ok) {
//         throw new Error(`Country not found (${response.status})`);
//       }
//       return response.json();
//     }
//     )
//     .then(data => {
//       renderCountry(data[0]);
//       const [neighbour] = data[0]?.borders;
//       console.log(neighbour);
//       if (!neighbour) return;

//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Country not found (${response.status})`);
//       }
//       return response.json()
//     })
//     .then(data => {
//       // console.log(data);
//       renderCountry(data[0], 'neighbour')
//     })
//     .catch(err => {
//       console.error(`The error: ${err}`);
//       renderError(`Something went wrong!!! ${err.message}`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     })
// }

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      console.log(data[0]);
      const [neighbour] = data[0]?.borders ?? [];
      console.log(neighbour);
      if (!neighbour) throw new Error('No neighbour found!');

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
  getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Country not found')
    .then(data => {
      // console.log(data);
      renderCountry(data[0], 'neighbour')
    })
    .catch(err => {
      console.error(`The error: ${err}`);
      renderError(`Something went wrong!!! ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    })
}

// btn.addEventListener('click', function () {
//   getCountryData('bangladesh');
// });

// getCountryData('abcde');

//-----------------------------------------------

// console.log('Test start');
// setTimeout(() => console.log('0 sec timer'), 0);
// Promise.resolve('Resolved promise 1').then(res =>
//   console.log(res));

// Promise.resolve('Resolved promise 2').then(res => {
//   for (let i = 0; i < 1000000000; i++) { }
//   console.log(res);
// });

// console.log('Test end');

//----------------------------------------------

// const lotteryPromise = new Promise(function (resolve, reject) {

//   console.log('lottery draw is happenning...');
//   setTimeout(function () {
//     // winning scenario
//     if (Math.random() >= 0.5) {
//       resolve('You Win !');
//     }
//     // losing scenario
//     else {
//       reject(new Error('You lose :('));
//     }
//   }, 2000);
// });

// lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// promisifying setTIMEOUT
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  })
}

// wait(2).then(() => {
//   console.log('I waited 1 seconds');
//   return wait(1);
// })
//   .then(() => {
//     console.log('I waited 2 seconds');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('I waited 3 seconds');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('I waited 4 seconds');
//   })

// Promise.resolve('abc').then(x => console.log(x));
// Promise.reject(new Error('Something wrong!')).catch(x => console.error(x));

//------------------------------------

// navigator.geolocation.getCurrentPosition(position => console.log(position), err => console.log(err));

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     // navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err));
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   })
// };

// getPosition().then(pos => console.log(pos));

// const whereAmI = function () {
//   getPosition()
//     .then(pos => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city}, ${data.countryCode}`);

//       return fetch(`https://restcountries.com/v2/name/${data.countryCode}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found (${res.status})`);

//       return res.json();
//     })
//     .then(data => renderCountry(data[0]))
//     .catch(err => console.error(`${err.message} 💥`));
// };

// btn.addEventListener('click', whereAmI);

//-----------------------------------
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err));
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
};

const whereAmI = async function () {

  try {
    //geolocation
    const pos = await getPosition();
    const { lattitude: lat, longitude: lng } = pos.coords;

    //reverse geocoding
    const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
    if (!resGeo.ok) throw new Error(`Problem getting location data`);
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    const res = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.countryName}`);
    if (!res.ok) throw new Error(`Problem getting country data`);
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.countryName}`;
  }
  catch (err) {
    console.error(`The issue is: ${err}`);
    renderError(`Something went wrong :()`);

    throw err;
  }
}

// console.log('1: will get location');

// const city = whereAmI();
// console.log(city);
// whereAmI().then(city => console.log(city))
//   .catch(err => console.log(err))
//   .finally(() => console.log('3: finished getting location'));

// (async function () {
//   try {
//     const city = await whereAmI();
//     console.log(`2: ${city}`);
//   } catch (err) {
//     console.log(`2: ${err.message}`);
//   }
//   console.log(`3: finished getting location`);
// })();


//--------------------------------------

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);
    // console.log(data1.capital, data2.capital, data3.capital);

    const data = await Promise.all([getJSON(`https://restcountries.com/v3.1/name/${c1}`), getJSON(`https://restcountries.com/v3.1/name/${c2}`), getJSON(`https://restcountries.com/v3.1/name/${c3}`)]);
    console.log(data.map(d => d[0].capital));


  } catch (err) {
    console.error(err);
  }
};

// get3Countries('bangladesh', 'canada', 'malaysia');

//-------------------------------

// (async function () {
//   const res = await Promise.race([
//     getJSON(`https://restcountries.com/v3.1/name/bangladesh`),
//     getJSON(`https://restcountries.com/v3.1/name/italy`),
//     getJSON(`https://restcountries.com/v3.1/name/iran`)
//   ]);
//   console.log(res[0]);
// })();

// const timeout = function (sec) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error('Request took too long!'));
//     }, sec * 1000)
//   });
// };

// Promise.race([
//   getJSON(`https://restcountries.com/v3.1/name/bangladesh`),
//   timeout(0.1)
// ])
//   .then(res => console.log(res[0]))
//   .catch(err => console.error(err))

// Promise.allSettled([
//   Promise.resolve('Success'),
//   Promise.reject('Error'),
//   Promise.resolve('Success')
// ]).then(res => console.log(res));

Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Success')
]).then(res => console.log(res));