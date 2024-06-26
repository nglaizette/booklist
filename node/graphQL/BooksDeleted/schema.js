export const type = `
  
  type BooksDeleted {
    _id: String
    userId: String
    deletedTimestamp: Float
  }

  type BooksDeletedQueryResults {
    BooksDeleteds: [BooksDeleted!]!
    Meta: QueryResultsMetadata!
  }

  type BooksDeletedSingleQueryResult {
    BooksDeleted: BooksDeleted
  }

  type BooksDeletedMutationResult {
    BooksDeleted: BooksDeleted
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type BooksDeletedMutationResultMulti {
    BooksDeleteds: [BooksDeleted]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type BooksDeletedBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input BooksDeletedInput {
    _id: String
    userId: String
    deletedTimestamp: Float
  }

  input BooksDeletedMutationInput {
    userId: String
    deletedTimestamp: Float
    deletedTimestamp_INC: Int
    deletedTimestamp_DEC: Int
  }

  input BooksDeletedSort {
    _id: Int
    userId: Int
    deletedTimestamp: Int
  }

  input BooksDeletedFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    _id_nin: [String]
    userId_contains: String
    userId_startsWith: String
    userId_endsWith: String
    userId_regex: String
    userId: String
    userId_ne: String
    userId_in: [String]
    userId_nin: [String]
    deletedTimestamp_lt: Float
    deletedTimestamp_gt: Float
    OR: [BooksDeletedFilters]
  }
  
`;

export const mutation = `



`;

export const query = `

  allBooksDeleteds (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    _id_nin: [String],
    userId_contains: String,
    userId_startsWith: String,
    userId_endsWith: String,
    userId_regex: String,
    userId: String,
    userId_ne: String,
    userId_in: [String],
    userId_nin: [String],
    deletedTimestamp_lt: Float,
    deletedTimestamp_gt: Float,
    OR: [BooksDeletedFilters],
    SORT: BooksDeletedSort,
    SORTS: [BooksDeletedSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): BooksDeletedQueryResults!

  getBooksDeleted (
    _id: String
  ): BooksDeletedSingleQueryResult!

`;
