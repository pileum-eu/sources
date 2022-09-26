import { Dirent, readdirSync } from 'fs';
import { join } from 'path';

import { mocked } from 'jest-mock';

import { getFilesPathsFromDir } from './file.helper';

jest.mock('fs');
jest.mock('path');

describe('getFilesPathsFromDir()', () => {
  const pathMock = '/a/custom/path/directory';
  const filenames = [
    'path1.csv',
    'path2.csv',
    'path3.csv',
    // readdirSync has multiple output signature and failed with jest
  ] as unknown as Dirent[];

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    mocked(join).mockImplementation((...args) => args.join('/'));
  });

  it('should call directory scan from path', () => {
    // Given
    mocked(readdirSync).mockReturnValueOnce(filenames);
    // When
    getFilesPathsFromDir(pathMock);

    // Then
    expect(mocked(readdirSync)).toHaveBeenCalledTimes(1);
    expect(mocked(readdirSync)).toHaveBeenCalledWith(pathMock);
  });

  it('should get list of file path from path directory', () => {
    // Given
    mocked(readdirSync).mockReturnValueOnce(filenames);
    const resultMock = [
      '/a/custom/path/directory/path1.csv',
      '/a/custom/path/directory/path2.csv',
      '/a/custom/path/directory/path3.csv',
    ];
    // When
    const result = getFilesPathsFromDir(pathMock);

    // Then
    expect(result).toStrictEqual(resultMock);
  });

  it('should return list of csv files only in directory', () => {
    const notOnlyCsvfilenames = [
      'path1.csv',
      'path2.csv',
      'path3.xxx',
      // readdirSync has multiple output signature and failed with jest
    ] as unknown as Dirent[];

    mocked(readdirSync).mockReturnValueOnce(notOnlyCsvfilenames);
    const resultMock = [
      '/a/custom/path/directory/path1.csv',
      '/a/custom/path/directory/path2.csv',
    ];

    // When
    const result = getFilesPathsFromDir(pathMock);

    // Then
    expect(result).toStrictEqual(resultMock);
  });

  it('should join directory source with list of extracted path', () => {
    // Given
    mocked(readdirSync).mockReturnValueOnce(filenames);
    // When
    getFilesPathsFromDir(pathMock);

    // Then
    expect(mocked(join)).toHaveBeenCalledTimes(3);
    expect(mocked(join)).toHaveBeenNthCalledWith(1, pathMock, filenames[0]);
    expect(mocked(join)).toHaveBeenNthCalledWith(2, pathMock, filenames[1]);
    expect(mocked(join)).toHaveBeenNthCalledWith(3, pathMock, filenames[2]);
  });

  it('should return empty array if there is no csv files', () => {
    const noCsvfilenames = [
      'path1.zzz',
      'path2.yyy',
      'path3.xxx',
      // readdirSync has multiple output signature and failed with jest
    ] as unknown as Dirent[];

    mocked(readdirSync).mockReturnValueOnce(noCsvfilenames);

    // When
    const result = getFilesPathsFromDir(pathMock);

    // Then
    expect(result).toStrictEqual([]);
  });
});
