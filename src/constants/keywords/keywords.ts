import { CATEGORIES } from './categories';
import { COMPLEXITY } from './complexity';

export type Keyword = {
  category: CATEGORIES;
  complexity: COMPLEXITY;
  keyword: string;
}

export const KEYWORDS: Keyword[] = [
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.EASY,
    keyword: 'Pływanie',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.EASY,
    keyword: 'Bieganie',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.EASY,
    keyword: 'Jedzenie',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.EASY,
    keyword: 'Spanie',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.EASY,
    keyword: 'Pisanie',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.MEDIUM,
    keyword: 'Strzelać z łuku',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.MEDIUM,
    keyword: 'Pisać na klawiaturze',
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.MEDIUM,
    keyword: 'Piłka nożna'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.MEDIUM,
    keyword: 'Rzut oszczepem'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.MEDIUM,
    keyword: 'Czytać książkę'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.HARD,
    keyword: 'Martwy ciąg'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.HARD,
    keyword: 'Kontemplować'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.HARD,
    keyword: 'Morsować'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.HARD,
    keyword: 'Kontemplować'
  },
  {
    category: CATEGORIES.ACTIVITY,
    complexity: COMPLEXITY.HARD,
    keyword: 'Krzyczeć wniebogłosy'
  },
];
