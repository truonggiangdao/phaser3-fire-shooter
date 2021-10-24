import { Sound } from 'phaser';

export interface SceneSound {
  entry: Sound.BaseSound;
  shoot: Sound.BaseSound;
  explosion: Sound.BaseSound;
  bomb: Sound.BaseSound;
}
