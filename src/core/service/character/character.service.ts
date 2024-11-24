export const CharacterService = {
  lowerCase: (str: string) => {
    if (!str) return '';
    return str.toLowerCase();
  },
  upperCase: (str: string) => {
    if (!str) return '';
    return str.toUpperCase();
  },
  titleCase: (str: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
      .join(' ');
  },
  pascalCase: (str: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
      .join('');
  },
  sentenseCase: (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  camelCase: (str: string) => {
    if (!str) return '';

    const text = str
      .toLowerCase()
      .split(' ')
      .map((text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
      .join('');

    return text.charAt(0).toLowerCase() + text.slice(1);
  },
  snakeCase: (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').join('_');
  },
  upperSnakeCase: (str: string) => {
    if (!str) return '';
    return str.toUpperCase().split(' ').join('_');
  },
  kebebCase: (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').join('-');
  },
  upperKebabCase: (str: string) => {
    if (!str) return '';
    return str.toUpperCase().split(' ').join('-');
  },
};
