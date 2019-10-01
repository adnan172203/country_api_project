const rootDiv = document.getElementById('root');

let countriesData = [];

const homePage = {
  render() {
    return 'Click on countries';
  },
  after_render() {
    return '';
  }
};
const Error404 = {
  render() {
    return 'This is Error';
  },
  after_render() {
    return '';
  }
};
let countries;
const listItems = document.querySelector('.list-items');

const getData = async () => {
  if (countriesData && countriesData.length === 0) {
    const res = await fetch('https://countriesnode.herokuapp.com/v1/countries');
    let data = await res.json();
    countriesData = [...data];
    return countriesData;
  }
  return countriesData;
};

const countriesPage = {
  render: async () => {
    let view = `
            <div class="container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col"></th>
            <th scope="col">Languages</th>
            <th scope="col"></th>
            <th scope="col">Native</th>
            <th scope="col">Continent</th>
          </tr>
        </thead>
        <tbody id="list-items"></tbody>
      </table>
    </div>
        `;
    return view;
  },
  after_render: async () => {
    const listItems = document.getElementById('list-items');

    let options = '';

    countriesData.forEach(country => {
      options += `<tr>
        <td> <a href="#" onclick="onNavigate('/countries/${country.code}'); return false;">${country.name} </a><td>
        <td>${country.languages}<td>
        <td>${country.native}</td>
        <td>${country.continent}</td>
        </tr>`;
    });

    listItems.innerHTML += options;
    return options;
  }
};

const countryPage = {
  render() {
    let view = `
            <div class="container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">currency</th>
            <th scope="col"></th>
            <th scope="col">Phone</th>
          </tr>
        </thead>
        <tbody id="list-item"></tbody>
      </table>
    </div>
        `;
    return view;
  },
  after_render() {
    const countryCode = location.pathname.split('/')[2].toUpperCase();
    const result = countriesData.find(country => country.code === countryCode);
    const listItem = document.getElementById('list-item');


    const option = `<tr>
        <td>${result.currency}<td>
        <td>${result.phone}<td>
        </tr>`;

    listItem.innerHTML = option;
    return option;
  }
};
const routes = {
  '/': homePage,
  '/countries': countriesPage,
  '/countries/:id': countryPage
};

const parseRequestURL = () => {
  let r = location.pathname.toLowerCase().split('/');

  let request = {
    resource: null,
    id: null,
    verb: null
  };
  request.resource = r[1];
  request.id = r[2];
  request.verb = r[3];

  return request;
};

const gettingPathName = () => {
  // Parse the URL and if it has an id part, change it with the string ":id"
  // Get the parsed URl from the addressbar
  let request = parseRequestURL();
  let parsedURL =
    (request.resource ? '/' + request.resource : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? '/' + request.verb : '');
  return parsedURL;
};

const router = async () => {
  // Get the parsed URl from the addressbar
  //let request = parseRequestURL();
  const parsedURL = gettingPathName();

  // Parse the URL and if it has an id part, change it with the string ":id"

  // Get the page from our hash of supported routes.
  // If the parsed URL is not in our list of supported routes, select the 404 page instead
  let page = routes[parsedURL] ? routes[parsedURL] : Error404;
  await getData();
  rootDiv.innerHTML = await page.render();
  rootDiv.innerHTML += await page.after_render();
};

const onNavigate = async pathname => {
  window.history.pushState({}, pathname, window.location.origin + pathname);
  rootDiv.innerHTML = await routes[gettingPathName()].render();
  await routes[gettingPathName()].after_render();
};

window.onpopstate = async () => {
  rootDiv.innerHTML = await routes[gettingPathName()].render();
  await routes[gettingPathName()].after_render();
};

router();
