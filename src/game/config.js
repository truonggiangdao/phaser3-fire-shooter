export const Dimention = {
  width: 800,
  height: 600,
  getDimention: () => {
    const zoomX = window.innerWidth / Dimention.width;
    const zoomY = window.innerHeight / Dimention.height;
    const zoom = Math.min(zoomX, zoomY);
    return { zoom, width: Dimention.width * zoom, height: Dimention.height * zoom };
  },
};

export const Gravity = {
  y: 320,
};
