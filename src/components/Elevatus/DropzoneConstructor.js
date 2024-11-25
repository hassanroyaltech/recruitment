import Dropzone from 'dropzone';
import Axios from 'axios';
import urls from 'api/urls';
import { commonAPI } from 'api/common';
import { generateHeaders } from 'api/headers';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DropzoneConstructor = {
  multiple: (
    id,
    className,
    handleData,
    acceptedTypes,
    type,
    from_feature,
    company_uuid,
    user_token,
    onClick,
    handleRemoveData,
  ) => {
    // this variable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
    let currentMultipleFile;
    // multiple dropzone file - accepts any type of file
    new Dropzone(document.getElementById(id), {
      previewsContainer: document.getElementsByClassName('dz-preview-multiple')[0],

      previewTemplate:
        document.getElementsByClassName('dz-preview-multiple')[0].innerHTML,
      url: '/',
      thumbnailWidth: null,
      thumbnailHeight: null,
      maxFilesize: 6.0,
      maxFiles: 25,
      parallelUploads: 10000,
      uploadMultiple: true,
      acceptedFiles: acceptedTypes,
      dictDefaultMessage: '<strong>Drop files here or click to upload. </strong>',
      init() {
        const AllImages = [];
        const ALLData = [];

        this.on('addedfile', (file) => {
          if (file.size > 5123967) {
            document.getElementById(`${id}_div`).innerHTML
              = "<p class='m-0 text-xs text-danger '>"
              + 'You cant upload an image larger that 5 MB'
              + '</p>';
            document.getElementsByClassName('dz-preview-multiple')[0].innerHTML = '';
          } else {
            const file_type = file.type.split('/')[0];
            if (file_type === 'video') {
              document.getElementById(`${id}_div`).innerHTML = `${
                "<p class='m-0 text-xs text-danger '>"
                + 'You should upload an image with those types :'
              }${acceptedTypes}</p>`;
              document.getElementsByClassName('dz-preview-multiple')[0].innerHTML
                = '';
            } else currentMultipleFile = file;
          }
        });
        this.on('sending', function (file) {
          onClick && onClick();
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type);
          formData.append('from_feature', from_feature); // Replace the preset name with your own

          if (this.files.length % 5 === 0) sleep(1000);

          commonAPI
            .createMedia(formData)
            .then(({ data }) => {
              AllImages.push(data.results);
              ALLData[file.upload.uuid] = data.results;
              handleData && handleData(data.results, id);
              document.getElementById(`${id}_div`).innerHTML = data.message;
              document
                .getElementById(`${id}_input`)
                .setAttribute('value', JSON.stringify(data.results.original));
            })
            .catch((error) => {
              document.getElementById(
                `${id}_div`,
              ).innerHTML = `<p class='m-0 text-xs text-danger '>${JSON.stringify(
                error,
              )}</p>`;
            });
        });
        this.on('removedfile', (file) => {
          const image_uuid = ALLData[file.upload.uuid].original.uuid;
          Axios.delete(urls.common.media, {
            params: {
              uuid: image_uuid,
              from_feature,
              company_uuid,
            },
            header: {
              Accept: 'application/json',
            },
            headers: generateHeaders(),
          })
            .then(({ data }) => {
              handleRemoveData && handleRemoveData(ALLData[file.upload.uuid], id);
              document.getElementById(
                `${id}_div`,
              ).innerHTML = `<p class='m-0 text-xs text-success '>${data.message}</p>`;
            })
            .catch((error) => {
              if (Array.isArray(error.response.data.errors))
                error.response.data.errors.file.forEach((element) => {
                  document.getElementById(
                    `${id}_div`,
                  ).innerHTML = `<p class='m-0 text-xs text-danger '>${element}</p>`;
                });
              else
                document.getElementById(
                  `${id}_div`,
                ).innerHTML = `<p class='m-0 text-xs text-danger '>${error.response.data.errors.file}</p>`;
            });
        });
      },
    });
    document.getElementsByClassName('dz-preview-multiple')[0].innerHTML = '';
    document.getElementById(`${id}_div`).innerHTML = '';
  },
  single: (
    id,
    className,
    handleData,
    acceptedTypes,
    type,
    from_feature,
    company_uuid,
    user_token,
    onClick,
  ) => {
    // this variable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
    let currentSingleFile;
    // single dropzone file - accepts only images
    new Dropzone(document.getElementById(`${id}`), {
      url: '/',
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: document.getElementsByClassName(`${className}`)[0],
      previewTemplate: document.getElementsByClassName(`${className}`)[0].innerHTML,
      maxFiles: 1,
      maxFilesize: 120.0,
      acceptedFiles: acceptedTypes,
      dictDefaultMessage: '<strong>Drop files here or click to upload. </strong>',
      init() {
        this.on('addedfile', function (file) {
          if (currentSingleFile) this.removeFile(currentSingleFile);

          const file_type = file.type.split('/')[0];
          if (file_type !== 'video' && file.size > 5123967) {
            document.getElementById(`${id}_div`).innerHTML
              = "<p class='m-0 text-xs text-danger '>"
              + 'You cant upload an image larger that 5 MB'
              + '</p>';
            document.getElementsByClassName(`dz-preview ${className}`)[0].innerHTML
              = '';
          } else {
            currentSingleFile = file;
            document.getElementsByClassName(
              `dz-preview-cover ${className}`,
            )[0].innerHTML = '';

            if (file_type === 'video') {
              type = 'video';
              document.getElementsByClassName(
                `dz-preview ${className}`,
              )[0].innerHTML = '';
            }

            onClick && onClick(id);
            const formData = new FormData();
            formData.append('file', this.files[0]);
            formData.append('type', type);
            formData.append('from_feature', from_feature); // Replace the preset name with your own

            commonAPI
              .createMedia(formData)
              .then(({ data }) => {
                handleData && handleData(data, id);
                if (type !== 'video') {
                  document.getElementById(`${id}_div`).innerHTML = '';
                  document
                    .getElementById(`${id}_input`)
                    .setAttribute('value', JSON.stringify(data.results.original));
                }
              })
              .catch((error) => {
                handleData && handleData([], id);

                if (Array.isArray(error.response.data.errors))
                  error.response.data.errors.file.forEach((element) => {
                    document.getElementById(
                      `${id}_div`,
                    ).innerHTML = `<p class='m-0 text-xs text-danger '>${element}</p>`;
                  });
                else
                  document.getElementById(
                    `${id}_div`,
                  ).innerHTML = `<p class='m-0 text-xs text-danger '>${error.response.data.errors.file}</p>`;
              });
          }
        });
      },
    });
    document.getElementById(`${id}_div`).innerHTML = '';
    // this variable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
  },
  video: (
    id,
    className,
    handleData,
    acceptedTypes,
    type,
    from_feature,
    company_uuid,
    user_token,
    onClick,
  ) => {
    // this variable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
    let currentSingleFile;

    // single dropzone file - accepts only images
    new Dropzone(document.getElementById(`${id}`), {
      url: '/',
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: document.getElementsByClassName(`${className}`)[0],
      previewTemplate: document.getElementsByClassName(`${className}`)[0].innerHTML,
      maxFiles: 1,
      acceptedFiles: acceptedTypes,
      init() {
        this.on('addedfile', function (file) {
          if (currentSingleFile) this.removeFile(currentSingleFile);

          currentSingleFile = file;
          const previewEl = document.getElementsByClassName(
            `dz-preview-video ${className}`,
          );
          previewEl[0].firstElementChild.src = URL.createObjectURL(file);
          onClick && onClick();
          const formData = new FormData();
          formData.append('file', this.files[0]);
          formData.append('type', type);
          formData.append('from_feature', from_feature); // Replace the preset name with your own

          commonAPI
            .createMedia(formData)
            .then(({ data }) => {
              handleData && handleData(data);
              document.getElementById(`${id}_div_video`).innerHTML = '';
              document
                .getElementById(`${id}_input_video`)
                .setAttribute('value', JSON.stringify(data.results.original));
            })
            .catch((error) => {
              if (Array.isArray(error.response.data.errors))
                error.response.data.errors.file.forEach((element) => {
                  document.getElementById(
                    `${id}_div`,
                  ).innerHTML = `<p class='m-0 text-xs text-danger '>${element}</p>`;
                });
              else
                document.getElementById(
                  `${id}_div`,
                ).innerHTML = `<p class='m-0 text-xs text-danger '>${error.response.data.errors.file}</p>`;
            });
        });
      },
    });
    document.getElementsByClassName(
      `dz-video ${className}`,
    )[0].firstElementChild.innerHTML = '';
    document.getElementById(`${id}_div_video`).innerHTML = '';

    // this variable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
  },
};

export default DropzoneConstructor;
