import { invalidate } from "$app/navigation";
import { searchBooks, updateBook } from "$data/books";
import { toJson } from "$lib/util/formDataHelpers";

export async function load(params: any) {
  const s = +new Date();
  const books = searchBooks(params.url.searchParams.get("search"));
  const e = +new Date();

  params.depends("books-results");

  //console.log(params);
  //console.log(params.url.searchParams.get('search'));
  //console.log(junkRes);

  // console.log({ books });
  // console.log('--------------------------');

  return {
    books
  };
}

type Book = {
  _id: string;
  title: string;
  authors: string[];
};

export const actions = {
  async saveBook({ request }: any) {
    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["_id", "title"],
      arrays: ["authors"]
    }) as Book;
    fields.authors = fields.authors.filter(a => a);

    await updateBook(fields);

    return { success: true };
  }
};
