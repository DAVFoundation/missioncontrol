module.exports = {
  verbose: true,
  roots: ['<rootDir>/src'],
  transform: {
    '\\.tsx?$': 'ts-jest',
  },
  testRegex: '(\\.(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
