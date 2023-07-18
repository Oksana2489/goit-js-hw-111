// устанавливаем axios
import axios from 'axios';
// устанавливаемnotiflix
import Notiflix from 'notiflix';
// утанавливаем SimpleLightbox данные в дз
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// querySelector: .search-form, .gallery, .load-more

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
// слушатель отслеживает когда нажат сабмит в форме и запускает функцию серч.
refs.form.addEventListener('submit', onSearch);
// на импут вешаем querySelector формы
refs.form.querySelector('input');
//  по умолчанию лоад должен быть спрятан style.display= 'none'
refs.loadMore.style.display = 'none';
// количество страниц по умолчанию
let pages = 1;
// количество найденых элементов по умолчанию
let isVisible = 0;

const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// 1.функция серч:
// 1.1.дастает данные из импута проверяет  введенные данны:
// - если пусто, то вывод сообщения "Sorry, there are no images matching your search query. Please try again."
// - если не пусто, то вызываем функцию запрос на апи и передаем ей данные из импута

// 2. запрос на апи состоит из базового урла и параметров запроса(из условий дз)
//     в q передаем данные из импута.
//     2.1.попытка получить данные успешна: создаем маркап
//     2.2. попытка неуспешна error

//     3. создание марка как в 10 дз

// 1)
function onSearch(evt) {
  evt.preventDefault();
  // количество найденых элементов:
  isVisible = 0;
  // разметка галереи "пусто" ( потом сюда подставим разметку из найденых
  refs.gallery.innerHTML = '';
  // достаем введенное имя из импута
  const name = refs.form.querySelector('input').value.trim();
  console.log(name);
  if (name !== '') {
    // если не пусто запрос на апи
    pixabayAPI(name);
    refs.loadMore.style.display = 'flex';
  } else {
    // если пусто то скрываем кнопку "load" и выводим сообщение
    refs.loadMore.style.display = 'none';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

// В качестве бэкенда используй публичный API сервиса Pixabay. Зарегистрируйся, получи свой уникальный ключ доступа и ознакомься с документацией.

// Список параметров строки запроса которые тебе обязательно необходимо указать:

// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.

// -----от меня
// page int	Returned search results are paginated. Use this parameter to select the page number.
// Default: 1

// per_page	int	Determine the number of results per page.
// Accepted values: 3 - 200
// Default: 20

// В ответе будет массив изображений удовлетворивших критериям параметров запроса. Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.

// https://pixabay.com/api/

// Your API key: 32996864-5f1a960915a219f7f2c6f1a79

// const name = refs.form.querySelector('input').value.trim();

// const options = {
//   params: {
//     key: '32996864-5f1a960915a219f7f2c6f1a79',
//     q: name,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//     page: 1,
//     per_page: 40,
//   },
// };

// запрос на апи
// 2) ставим async функция (название и передачей )
async function pixabayAPI(name, pages) {
  // базовый урл
  const BASE_URL = 'https://pixabay.com/api/';
  // параметри урла из конспекта ключь после регистрации page присваеваем параметр "количество ключей по умолчанию"; q присваиваем константу name, которую достали из импута, то что вводил юзер
  const options = {
    params: {
      key: '32996864-5f1a960915a219f7f2c6f1a79',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: pages,
      per_page: 40,
    },
  };

  try {
    // получаем данные з апи по урлу и параметрам
    const response = await axios.get(BASE_URL, options);
    // из документации axios https://github.com/axios/axios, чтобы не искали долго:
    // Optionally the request above could also be done as
    // axios.get('/user', {
    //   params: {
    //     ID: 12345,
    //   },
    // });
    // т.е. вместо fetch ставим axios.get(BASE_URL, options)

    console.log(response); //проверка
    console.log(response.data.hits.length); //проверка
    isVisible += response.data.hits.length;
    // сколько элементов найдено по запросу отображается
    console.log(isVisible);
    if (!response.data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (response.data.hits.length >= isVisible) {
      refs.loadMore.style.display = 'flex';
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.total} images.`
      );
    }

    if (isVisible >= response.data.total) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMore.style.display = 'none';
    }

    createMarkup(response.data);
    console.log(response.data); //массив отправляем на createMarkup
  } catch (error) {
    console.log(error);
  }
}

// 3) создание марка как в 10 дз
function createMarkup(images) {
  // основа из 10й дз
  console.log(images);
  const markup = images.hits
    .map(
      // image.largeImageURL - картинка которая отображается при клике
      //image.webformatURL - картинка которая отображается при поиске
      // это все лежит в обекте который передается нам из апи, точнее в hits -- открываем любой и смотрим его свойства

      image =>
        `<a class="photo-link" href="${image.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${image.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${image.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${image.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${image.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallerySimpleLightbox.refresh(); //из дз: "У библиотеки есть метод refresh() который обязательно нужно вызывать каждый раз после добавления новой группы карточек изображений.""
}

refs.loadMore.addEventListener('click', onLoadMore);
//когда идет клик на кнопку  loadMore запускается функция onLoadMore
function onLoadMore() {
  //количество страниц по умолчанию увеличивается на единицу += 1
  pages += 1;
  //достаем введенное имя из импута, его просто нет в глобальной видимости (надо поставить и поменять везде!!!)
  const name = refs.form.querySelector('input').value.trim();
  //вызываем функцию запроса апи и в параментри передаем имя из импута и количество страниц новое (+= 1)
  pixabayAPI(name, pages);
  // показываем кнопку loadMore (.style.display = 'flex';)
  refs.loadMore.style.display = 'flex';
}
