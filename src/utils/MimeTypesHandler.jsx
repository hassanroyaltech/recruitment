import ico from '../assets/images/upload-icons/ico.svg';
import png from '../assets/images/upload-icons/png.svg';
import jpg from '../assets/images/upload-icons/jpg.svg';
import gif from '../assets/images/upload-icons/gif.svg';
import svg from '../assets/images/upload-icons/svg.svg';
import tif from '../assets/images/upload-icons/tif.svg';
import bmp from '../assets/images/upload-icons/bmp.svg';
import xls from '../assets/images/upload-icons/xls.svg';
import xlsx from '../assets/images/upload-icons/xlsx.svg';
import pdf from '../assets/images/upload-icons/pdf.svg';
import word from '../assets/images/upload-icons/word.svg';
import txt from '../assets/images/upload-icons/txt.svg';
import ppt from '../assets/images/upload-icons/ppt.svg';
import csv from '../assets/images/upload-icons/csv.svg';
import video from '../assets/images/upload-icons/mp4.svg';
import unknown from '../assets/images/upload-icons/_blank.png';

export const getMimeTypeHandler = (fileOrFileType) => {
  let fileType;
  if (fileOrFileType && fileOrFileType)
    if (
      fileOrFileType
      && typeof fileOrFileType === 'object'
      && fileOrFileType.fileName
      && fileOrFileType.fileName.split('.').length > 1
    )
      // eslint-disable-next-line prefer-destructuring
      fileType = fileOrFileType.fileName.split('.').pop();
    else if (
      fileOrFileType
      && typeof fileOrFileType === 'object'
      && fileOrFileType.path
      && fileOrFileType.path.split('.').length > 1
    )
      // eslint-disable-next-line prefer-destructuring
      fileType = fileOrFileType.path.split('.').pop();
    else if (
      fileOrFileType
      && typeof fileOrFileType === 'object'
      && fileOrFileType.type
    )
      fileType = fileOrFileType.type;
    else fileType = fileOrFileType;

  if (
    fileOrFileType
    && typeof fileOrFileType === 'object'
    && fileOrFileType.type === 'video'
  )
    fileType = fileOrFileType.type;
  // const fileType = fileName
  //   .substring(fileName.lastIndexOf('.') + 1, fileName.length)
  //   .toLowerCase();
  if (fileType === 'video')
    return {
      image: video,
      isVideo: true,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'docs')
    return {
      image: xlsx,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'pdf')
    return {
      image: pdf,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'word' || fileType === 'docx')
    return {
      image: word,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'txt')
    return {
      image: txt,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'ppt' || fileType === 'pptx')
    return {
      image: ppt,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'csv')
    return {
      image: csv,
      isFile: true,
      isImage: false,
    };
  if (fileType === 'ico')
    return {
      image: ico,
      isFile: false,
      isImage: true,
    };

  if (fileType === 'gif')
    return {
      image: gif,
      isFile: false,
      isImage: true,
    };

  if (fileType === 'png' || fileType === 'webp')
    return {
      image: png,
      isFile: false,
      isImage: true,
    };

  if (fileType === 'jpg' || fileType === 'jpeg')
    return {
      image: jpg,
      isFile: false,
      isImage: true,
    };

  if (fileType === 'svg')
    return {
      image: svg,
      isFile: false,
      isImage: true,
    };

  if (fileType === 'tif')
    return {
      image: tif,
      isFile: false,
      isImage: true,
    };
  if (fileType === 'image')
    return {
      image: jpg,
      isFile: false,
      isImage: true,
    };
  if (fileType === 'bmp')
    return {
      image: bmp,
      isFile: false,
      isImage: true,
    };

  if (fileType === 'xlsx')
    return {
      image: xlsx,
      isFile: true,
      isImage: false,
    };

  if (fileType === 'xls')
    return {
      image: xls,
      isFile: true,
      isImage: false,
    };

  return {
    image: unknown,
    isFile: true,
    isImage: false,
  };
};
