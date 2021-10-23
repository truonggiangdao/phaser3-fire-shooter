import Phaser from 'phaser';
import { Dimention } from './config';

/**
 *
 * @param {Phaser.Game} game
 */
export const bindWindowEvents = (game) => {
  const onResize = () => {
    const { zoom, width, height } = Dimention.getDimention();
    // game.canvas.style.width = width + 'px';
    // game.canvas.style.height = height + 'px';
    game.canvas.style.scale = zoom;
    console.log('zoom', zoom);
  };
  window.addEventListener('resize', onResize);
  onResize();
};
