/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get the location of the touch or mouse from element
 */
export const GetBoxXYInformation = ({
  event,
  touchNumber = 0,
  centerDivide = 2,
}) => {
  const element
    = typeof event.originalEvent === 'undefined'
      ? event.currentTarget
      : event.originalEvent.touches[touchNumber];
  const box = element.getBoundingClientRect();
  const ret = {};
  ret.xCenter = Math.abs(box.right - box.left) / centerDivide; // x center within the element.
  ret.yCenter = (box.bottom - box.top) / centerDivide; // y center within the element.
  ret.xLocation
    = box.right > box.left ? event.clientX - box.left : event.clientX - box.right; // x position within the element.
  ret.yLocation = event.clientY - box.top; // y position within the element.
  ret.isBeforeXCenter = ret.xLocation < ret.xCenter;
  ret.isBeforeYCenter = ret.yLocation < ret.yCenter;
  ret.isAfterXCenter = ret.xLocation > ret.xCenter;
  ret.isAfterYCenter = ret.yLocation > ret.yCenter;
  ret.isEqualXCenter = ret.xLocation === ret.xCenter;
  ret.isEqualYCenter = ret.yLocation === ret.yCenter;
  ret.isBeforeOrEqualXCenter = ret.xLocation <= ret.xCenter;
  ret.isBeforeOrEqualYCenter = ret.yLocation <= ret.yCenter;
  ret.isAfterOrEqualXCenter = ret.xLocation >= ret.xCenter;
  ret.isAfterOrEqualYCenter = ret.yLocation >= ret.yCenter;
  ret.isOutsideElement = ret.xLocation < 0 || ret.yLocation < 0;
  return ret;
};
