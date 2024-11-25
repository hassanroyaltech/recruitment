import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
const pixelToMilliRate = 0.2645833333;
const a4Height = 295;

// get element height + vertical margins
function getAbsoluteHeight(el) {
  const margin = el.style.marginTop + el.style.marginBottom;
  return (el.offsetHeight + margin) * pixelToMilliRate;
}
// get element margin top + padding top
function getMarginAndPaddingTop(el) {
  const val = el.style.marginTop + el.style.paddingTop;
  return val * pixelToMilliRate;
}
// get element margin bottom + padding bottom
function getMarginAndPaddingBottom(el) {
  const val = el.style.marginBottom + el.style.paddingBottom;
  return val * pixelToMilliRate;
}
export const DownloadPDF = async ({
  pdfName = 'template',
  element,
  ref,
  isView = false,
}) =>
  new Promise((res, rej) => {
    // this 'div html element' to make copy from element to dom
    // to handle divide element to fit a4 papers without affect on original
    // this 'div' will be deleted after download pdf
    const div = document.createElement('div');
    div.innerHTML = element.innerHTML;
    ref.current.parentElement.appendChild(div);
    div.classList = element.classList;
    div.style = element.style;
    let localElament = div;
    let heightVal = 0;
    let pageIndex = 1;
    // const localElementHeightMM = localElament.clientHeight * pixelToMilliRate;
    // code inside if condition block for add margin top to elements that located
    // on the border between pages
    // this margin will be distance between last item not located on the border bottom
    // and page bottom edg
    // if (localElementHeightMM >= a4Height) {
    const chlidrenArray = localElament?.childNodes?.[0]?.childNodes || [];

    let footersHeight = 0;
    let headersHeight = 0;
    const imgFootersArray = [
      ...Array.from(localElament.querySelectorAll('.fb-footer-section')),
    ].reverse();
    imgFootersArray.forEach((element) => {
      footersHeight += getAbsoluteHeight(element);
      element.parentNode.removeChild(element);
    });
    const imgHeadersArray = [
      ...Array.from(localElament.querySelectorAll('.fb-header-section')),
    ].reverse();
    imgHeadersArray.forEach((element) => {
      headersHeight += getAbsoluteHeight(element);
      element.parentNode.removeChild(element);
    });
    const lastLocalIndex = Array.from(chlidrenArray).length - 1;
    const helpArray = [];
    if (imgHeadersArray?.length > 0 && headersHeight > 0) {
      heightVal = headersHeight;
      imgHeadersArray.forEach((element) => {
        helpArray.push(element.cloneNode(true));
      });
    }
    if (chlidrenArray.length)
      for (let child in chlidrenArray)
        if (typeof chlidrenArray[child] === 'object') {
          let tempParentHeight = getAbsoluteHeight(chlidrenArray[child]) + heightVal;
          if (chlidrenArray[child].classList.contains('page-break-section')) {
            const separator = document.createElement('div');
            separator.style.width = '100%';
            separator.style.display = 'block';
            const sepHeight
              = a4Height * pageIndex - (tempParentHeight + footersHeight + 3);
            separator.style.height = `${sepHeight}mm`;
            helpArray.push(separator.cloneNode(true));
            if (footersHeight)
              imgFootersArray.forEach((element, index) => {
                helpArray.push(element.cloneNode(true));
              });
            separator.style.height = `${3.8}mm`;
            helpArray.push(separator.cloneNode(true));
            if (headersHeight && chlidrenArray?.[Number(child) + 1])
              imgHeadersArray.forEach((element, index) => {
                helpArray.push(element.cloneNode(true));
              });
            tempParentHeight += sepHeight + headersHeight + footersHeight + 3.8;
            heightVal = tempParentHeight;
            pageIndex += 1;
          } else if (tempParentHeight + footersHeight + 8 < a4Height * pageIndex) {
            if (
              lastLocalIndex === Number(child)
              && imgFootersArray?.length > 0
              && footersHeight > 0
            ) {
              tempParentHeight += footersHeight;
              const tempMarginBottom = a4Height * pageIndex - (tempParentHeight + 3);
              chlidrenArray[child].style.setProperty(
                'margin-Bottom',
                `${tempMarginBottom}mm`,
                'important',
              );
              helpArray.push(chlidrenArray[child].cloneNode(true));
              tempParentHeight += tempMarginBottom;
              imgFootersArray.forEach((element) => {
                helpArray.push(element.cloneNode(true));
              });
            } else helpArray.push(chlidrenArray[child].cloneNode(true));
            heightVal = tempParentHeight;
          } else {
            const subChildren = Array.from(chlidrenArray[child]?.childNodes) || [];
            if (subChildren.length) {
              let tempHeigth
                = heightVal + getMarginAndPaddingTop(chlidrenArray[child]);
              const tempDiv = document.createElement('div');
              tempDiv.style = chlidrenArray[child].style;
              tempDiv.classList = chlidrenArray[child].classList;
              subChildren.forEach((subChild, index) => {
                if (
                  chlidrenArray[child].classList.contains('field-layout-row-wrapper')
                ) {
                  if (index % 2 === 0) {
                    const childHeight = getAbsoluteHeight(subChild);
                    let nextChildHeight = 0;
                    if (subChildren.length - 1 > index)
                      nextChildHeight = getAbsoluteHeight(subChildren[index + 1]);
                    let tempSubChildHeight
                      = (childHeight > nextChildHeight
                        ? childHeight
                        : nextChildHeight) + tempHeigth;
                    if (
                      tempSubChildHeight + footersHeight + 8
                      < a4Height * pageIndex
                    ) {
                      tempHeigth = tempSubChildHeight;
                      heightVal = tempSubChildHeight;
                      tempDiv.appendChild(subChildren[index].cloneNode(true));
                      if (subChildren.length - 1 > index)
                        tempDiv.appendChild(
                          subChildren?.[index + 1].cloneNode(true),
                        );
                    } else {
                      if (tempDiv.hasChildNodes()) {
                        helpArray.push(tempDiv.cloneNode(true));
                        tempDiv.innerHTML = '';
                        tempSubChildHeight
                          = tempSubChildHeight
                          - (childHeight > nextChildHeight
                            ? childHeight
                            : nextChildHeight)
                          + getMarginAndPaddingBottom(chlidrenArray[child]);
                      }
                      const separator = document.createElement('div');
                      separator.style.width = '100%';
                      separator.style.display = 'block';
                      const sepHeight
                        = a4Height * pageIndex
                        - (footersHeight + tempSubChildHeight + 5 + 2 * pageIndex);
                      separator.style.height = `${sepHeight}mm`;
                      helpArray.push(separator.cloneNode(true));
                      if (footersHeight)
                        imgFootersArray.forEach((element, index) => {
                          helpArray.push(element.cloneNode(true));
                        });
                      separator.style.height = `3mm`;
                      helpArray.push(separator.cloneNode(true));
                      if (headersHeight)
                        imgHeadersArray.forEach((element, index) => {
                          helpArray.push(element.cloneNode(true));
                        });

                      tempDiv.appendChild(subChildren[index].cloneNode(true));
                      if (subChildren?.[index + 1])
                        tempDiv.appendChild(
                          subChildren?.[index + 1].cloneNode(true),
                        );

                      tempHeigth
                        = tempSubChildHeight
                        + getMarginAndPaddingTop(chlidrenArray[child])
                        + (childHeight > nextChildHeight
                          ? childHeight
                          : nextChildHeight)
                        + sepHeight
                        + headersHeight
                        + footersHeight
                        + 8;

                      heightVal = tempHeigth;
                      pageIndex += 1;
                    }
                  }
                  if (subChildren.length - 1 === index) {
                    heightVal
                      = tempHeigth + getMarginAndPaddingBottom(chlidrenArray[child]);
                    helpArray.push(tempDiv.cloneNode(true));
                    tempDiv.innerHTML = '';
                    if (!chlidrenArray?.[Number(child) + 1])
                      if (footersHeight) {
                        const separator = document.createElement('div');
                        separator.style.width = '100%';
                        separator.style.display = 'block';
                        separator.style.height = `${
                          a4Height * pageIndex - (heightVal + footersHeight + 5)
                        }mm`;
                        helpArray.push(separator.cloneNode(true));
                        imgFootersArray.forEach((element, index) => {
                          helpArray.push(element.cloneNode(true));
                        });
                      }
                  }
                } else if (
                  !subChildren[index].classList.contains('MuiDivider-fullWidth')
                ) {
                  const childHeight = getAbsoluteHeight(subChild);
                  let tempSubChildHeight = childHeight + tempHeigth;

                  if (
                    tempSubChildHeight + footersHeight + 8
                    < a4Height * pageIndex
                  ) {
                    tempHeigth = tempSubChildHeight;
                    heightVal = tempSubChildHeight;
                    tempDiv.appendChild(subChildren[index].cloneNode(true));
                  } else {
                    if (tempDiv.hasChildNodes()) {
                      helpArray.push(tempDiv.cloneNode(true));
                      tempDiv.innerHTML = '';
                      tempSubChildHeight
                        = tempSubChildHeight
                        - childHeight
                        + getMarginAndPaddingBottom(chlidrenArray[child]);
                    }
                    const separator = document.createElement('div');
                    separator.style.width = '100%';
                    separator.style.display = 'block';
                    const sepHeight
                      = a4Height * pageIndex
                      - (footersHeight + tempSubChildHeight + 5 + pageIndex * 2);

                    separator.style.height = `${sepHeight}mm`;
                    helpArray.push(separator.cloneNode(true));
                    if (footersHeight)
                      imgFootersArray.forEach((element, index) => {
                        helpArray.push(element.cloneNode(true));
                      });
                    separator.style.height = `3mm`;
                    helpArray.push(separator.cloneNode(true));
                    if (headersHeight)
                      imgHeadersArray.forEach((element, index) => {
                        helpArray.push(element.cloneNode(true));
                      });
                    tempDiv.appendChild(subChildren[index].cloneNode(true));
                    tempHeigth
                      = tempSubChildHeight
                      + getMarginAndPaddingTop(chlidrenArray[child])
                      + childHeight
                      + sepHeight
                      + headersHeight
                      + footersHeight
                      + 8;
                    heightVal = tempHeigth;
                    pageIndex += 1;
                  }

                  if (subChildren.length - 1 === index) {
                    heightVal
                      = tempHeigth + getMarginAndPaddingBottom(chlidrenArray[child]);
                    helpArray.push(tempDiv.cloneNode(true));
                    tempDiv.innerHTML = '';
                    if (lastLocalIndex === Number(child))
                      if (footersHeight) {
                        const separator = document.createElement('div');
                        separator.style.width = '100%';
                        separator.style.display = 'block';
                        separator.style.height = `${
                          a4Height * pageIndex - (heightVal + footersHeight + 5)
                        }mm`;
                        helpArray.push(separator.cloneNode(true));
                        imgFootersArray.forEach((element, index) => {
                          helpArray.push(element.cloneNode(true));
                        });
                      }
                  }
                }
              });
            }
          }
        }

    localElament.childNodes[0].innerHTML = '';
    helpArray.forEach((element) =>
      localElament.childNodes[0].appendChild(element.cloneNode(true)),
    );
    html2canvas(localElament, {
      scale: 3,
      logging: true,
      useCORS: true,
      allowTaint: true,
    })
      .then((canvas) => {
        if (!canvas) rej(false);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // a4 Dimension
        const pageHeight = 295; // a4 Dimension
        let imgHeight = (canvas.height * (imgWidth / 3)) / (canvas.width / 3);
        let heightLeft = imgHeight;
        let doc = new jsPDF('p', 'mm');
        let position = 0;
        doc.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
        // this loop to divide canvas on a4 height
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(
            imgData,
            'jpeg',
            0,
            position,
            imgWidth,
            imgHeight,
            '',
            'FAST',
          );
          heightLeft -= pageHeight;
        }
        const pages = doc.internal.getNumberOfPages(); // get number of pages
        const pageWidth = doc.internal.pageSize.width; // get internal pdf page width
        const pageHeights = doc.internal.pageSize.height; // get internal pdf page height
        doc.setFontSize(8); //page number font size
        doc.setTextColor('#000333'); // page number color
        for (let j = 1; j < pages + 1; j++) {
          let horizontalPos = pageWidth / 2; // for horizontal position
          let verticalPos = pageHeights - 2; // for padding bottom
          doc.setPage(j);
          doc.text(`${j} / ${pages}`, horizontalPos, verticalPos, {
            align: 'center', //Optional text styling});
          });
        }
        setTimeout(() => {
          if (isView) {
            const file = new File([doc.output('blob')], `${pdfName}.pdf`, {
              type: doc.output('blob').type,
              lastModified: doc.output('blob').lastModified,
            });

            window.open(URL.createObjectURL(file), '_self');
          } else doc.save(`${pdfName}.pdf`);
        }, 500);
        ref.current.parentElement.removeChild(div);
        res(true);
      })
      .catch(() => {
        rej(false);
      });
  });
