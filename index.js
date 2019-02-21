'use strict';
const scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');

// control vars
const elMotionDuration = 1000;

// page vars
let containerWidth = 0;
let containerHeight = 0;
const getContainerSize = () => {
  const el = document.querySelector('.container');
  containerWidth = el.offsetWidth;
  containerHeight = el.offsetHeight;
  return {containerHeight, containerWidth};
};


const appendSvg = (containerSize, id) => {
  const heightPlacement = Math.floor(Math.random() * 9);
  const div = document.createElement('div');
  div.setAttribute('class', `sprite-container`);
  div.setAttribute('style', `margin-top: ${containerSize.containerHeight * `.${heightPlacement}`}px; padding: 10px; position: absolute;`)
  const container = document.querySelector('.container');

  const imgContainer = document.createElement('div');
  imgContainer.setAttribute('class', 'wrapper');
  const img = document.createElement('object');
  img.setAttribute('class', `${id} sprite`);
  img.setAttribute('data', './svg/nyan_cat.svg');
  img.setAttribute('type', 'image/svg+xml');

  const styleString = ``;
  img.setAttribute('style', styleString);
  div.appendChild(imgContainer);
  imgContainer.appendChild(img);
  container.appendChild(div);
  return div;
}

const tearDownSprite = (sprite) => {
  return sprite.parentNode.removeChild(sprite);
}

const generateSprite = (containerSize, sprite) => {
  const timeline = new mojs.Timeline();
  const container = sprite;
  const burstContainer = document.createElement('div');
  burstContainer.setAttribute('style', 'position: absolute; top: 28px; left: 40px');
  container.appendChild(burstContainer);
  const wrapper = container.querySelector('.wrapper');
  const el = sprite.querySelector(`.sprite`);

  // tweens for the animation:
  // burst animation
  const burst = new mojs.Burst({
    parent:       burstContainer,
    radius:       {40:110},
    count:        20,
    children: {
      shape:      'line',
      fill :      'white',
      radius:     { 12: 0 },
      scale:      1,
      stroke:     '#988ADE',
      strokeWidth: 2,
      duration:   1500,
      easing:     mojs.easing.bezier(0.1, 1, 0.3, 1)
    },
  });

  // ring animation
  const outline = new mojs.Shape({
    parent:       burstContainer,
    radius:       {10: 60},
    fill:         'transparent',
    stroke:       '#988ADE',
    strokeWidth:  {30:0},
    duration:     800,
    easing:       mojs.easing.bezier(0.1, 1, 0.3, 1)
  });

  // icon scale animation
  const iconTween = new mojs.Tween({
    duration : 900,
    onUpdate: (progress) => {
      const scaleProgress = scaleCurve(progress);
      burstContainer.style.WebkitTransform = burstContainer.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
    }
  });

  const iconScaleTween = new mojs.Tween({
    duration: 1500,
    onUpdate: (progress) => {
      const scaleProgress = scaleCurve(progress);
      if(progress > 0.3) {
        const elasticOutProgress = mojs.easing.elastic.out(1.43*progress-0.43);
        el.style.WebkitTransform = el.style.transform = 'scale3d(' + elasticOutProgress + ',' + elasticOutProgress + ',1)';
      }
      else {
        el.style.WebkitTransform = el.style.transform = 'scale3d(0,0,1)';
      }
    }
  });

  const htmlCurve = 'M0, 0 C16.815811159807826, -3.2443825883792443 27.57166399691211, 35.51058598192055 30, 100 C31.90230129013731, 99.91798544665086 67.88545167517314, 99.9146334942176 70, 100 C72.54311975339816, 46.08536650578238 87.89847455447789, 2.672954016950679 100, 0';

  const icon = new mojs.Html({
    delay: 700,
    el: el,
    isShowStart: true,
  })
  .then({
    delay: 100,
    duration: elMotionDuration,
    easing: 'linear.none',
    x: { to: (containerSize.containerWidth * .33) },
    y: { to: 'rand(-20,20)', curve: htmlCurve},
    scale: { to: 'rand(.8,1.2)'}
  })
  .then({
    duration: elMotionDuration,
    easing: 'linear.none',
    scale: { to: 'rand(.8,1.2)'},
    y: { to: 'rand(-20,20)', curve: htmlCurve},
    x: { to: (containerSize.containerWidth * .66) }
  })
  .then({
    duration: elMotionDuration,
    easing: 'linear.none',
    scale: { to: 'rand(.8,1.2)'},
    y: { to: 'rand(-20,20)', curve: htmlCurve},
    x: { to: (containerSize.containerWidth + 100) },
    onComplete: () => {
      tearDownSprite(sprite);
    }
  });

  timeline.add(iconTween, burst, outline, iconScaleTween, icon);

  return timeline;

};

// when clicking the button start the timeline/animation:
const snsButton = document.querySelector('.sns-event');
snsButton.addEventListener('click', (e) => {
  const size = getContainerSize();
  const el = appendSvg(size, 'nyan');
  const timeline = generateSprite(size, el);
  timeline.play();
});