import { LOAD_BOOKS, LOAD_BOOKS_RESULTS } from './actionNames';

export function loadBooks(){
    return function(dispatch, getState){
        debugger;
        dispatch({ type: LOAD_BOOKS });

        Promise.resolve(booksSearch(getState().books.bookSearch)).then(booksResp => dispatch(booksResults(booksResp)));
    }
}

function booksSearch(bookSearchState){
    return ajaxUtil.get('/book/searchBooks', {
        search: bookSearchState.search,
        subjects: Object.keys(bookSearchState.subjects),
        searchChildSubjects: bookSearchState.searchChildSubjects,
        sort: bookSearchState.sort,
        sortDirection: bookSearchState.sortDirection,
        author: bookSearchState.author,
        publisher: bookSearchState.publisher,
        pages: bookSearchState.pages,
        pagesOperator: bookSearchState.pagesOperator
    });
}

export function booksResults(resp){
    return { type: LOAD_BOOKS_RESULTS, books: resp.results };
}