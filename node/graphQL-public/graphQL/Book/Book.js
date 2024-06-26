import EditorialReview from "../EditorialReview/EditorialReview";

export default {
  table: "books",
  typeName: "Book",
  fields: {
    _id: "MongoId",
    ean: "String",
    isbn: "String",
    title: "String",
    mobileImage: "String",
    mobileImagePreview: "JSON",
    smallImage: "String",
    smallImagePreview: "JSON",
    mediumImage: "String",
    mediumImagePreview: "JSON",
    userId: "String",
    publisher: "String",
    publicationDate: "String",
    pages: "Int",
    authors: "StringArray",
    subjects: "StringArray",
    tags: "StringArray",
    isRead: "Boolean",
    dateAdded: "String",
    editorialReviews: {
      __isArray: true,
      get type() {
        return EditorialReview;
      }
    },
    similarItems: "StringArray"
  },
  relationships: {}
};
