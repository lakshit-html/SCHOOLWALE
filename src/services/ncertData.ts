// Official NCERT Textbooks Directory & Chapter Catalog (ncert.nic.in)
// Aggregated from modular class catalogs

import { CLASS_12_BOOKS } from './ncertCatalog/class12';
import { CLASS_11_BOOKS } from './ncertCatalog/class11';
import { CLASS_9_10_BOOKS } from './ncertCatalog/class9_10';
import { NCERTBook } from './ncertCatalog/types';

export * from './ncertCatalog/types';

export const NCERT_BOOKS: NCERTBook[] = [
  ...CLASS_12_BOOKS,
  ...CLASS_11_BOOKS,
  ...CLASS_9_10_BOOKS
];
