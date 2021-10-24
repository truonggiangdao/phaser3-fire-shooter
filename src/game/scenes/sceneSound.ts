import { Sound } from 'phaser';

export interface SceneSound {
  entry: Sound.BaseSound;
  shoot: Sound.BaseSound;
  collect: Sound.BaseSound;
  bomb: Sound.BaseSound;
}
