import Phaser from 'phaser';

const createSkeletonAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'skeleton-idle',
    frames: anims.generateFrameNames('skeleton', {
      start: 0,
      end: 3,
      prefix: 'skelet_idle_anim_f',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  });

  anims.create({
    key: 'skeleton-run',
    frames: anims.generateFrameNames('skeleton', {
      start: 0,
      end: 3,
      prefix: 'skelet_run_anim_f',
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  });
};

export { createSkeletonAnims };
