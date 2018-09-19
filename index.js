import Navigation from './components/Navigation';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import Axios from 'axios';

var products = [];

function render(items){
    document
        .querySelector('#root')
        .innerHTML = `
           ${Header()}
           ${Navigation()}
           ${Content(items)}
           ${Footer()}
        `;

    document
        .getElementById('bookInput')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            var newProduct = Array.from(event
                .target
                .elements)
            var object = {
                "title": newProduct[0].value,
                "creator": newProduct[1].value,
                "price": newProduct[2].value,
                "image": newProduct[3].value,
                "selling_points": newProduct[4].value.split('\n').filter(sp => sp.length > 0),
                "type": newProduct[5].value
            }
            Axios
                .post('https://api.savvycoders.com/books', object)
                .then(function(response) {console.log(response)});
        });

    document
        .querySelectorAll('span.delete a')
        .forEach((deleteLink) => {
            deleteLink.addEventListener('click', (event) => {   // Replace navigation with this eventlistener
                event.preventDefault();                         // And prevent default behavior

                Axios
                    .delete(`https://api.savvycoders.com/books/${deleteLink.id}`) // Delete it from the API
                    .then(
                        () => render(products.filter((product) => product.id !== deleteLink.id))
                    );
            });
        });

    document.querySelector('.nav-books a').addEventListener('click', (event) => { // When we click the books link
        event.preventDefault();
        render(products.filter((item) => item.type === 'book'));             // Filter only books
    });

    document.querySelector('.nav-music a').addEventListener('click', (event) => { // Likewise for music
        event.preventDefault();
        render(products.filter((item) => item.type === 'music'));
    });
}

Axios
    .get('https://api.savvycoders.com/books')
    .then((booksResponse) => {
        var books = booksResponse.data;

        Axios
            .get('https://api.savvycoders.com/albums')
            .then((albumsResponse) => {
                var albums = albumsResponse.data;

                products = books.concat(albums);

                render(products);
            });
    });
