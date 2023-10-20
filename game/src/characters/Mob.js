import Explosion from "../effects/Explosion";
import ExpUp from "../items/ExpUp";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animKey, initHp, dropRate) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scale = 2;
    this.m_speed = 50;
    this.m_hp = initHp;
    this.m_dropRate = dropRate;

    if (animKey) {
      this.play(animKey);
    }

    this.on("overlapstart", (projectile) => {
      this.hit(projectile, 10);
    });

    // 계속해서(0.1초마다) player 방향으로 움직임
    this.m_events = [];
    this.m_events.push(
      this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          scene.physics.moveToObject(this, scene.m_player, this.m_speed);
        },
        loop: true,
      })
    );

    scene.events.on("update", (time, delta) => {
      this.update(time, delta);
    });
  }

  update(time, delta) {
    if (!this.body) return;

    if (this.body.velocity.x > 0) this.flipX = true;
    else this.flipX = false;
  }

  // mob이 공격에 맞을 경우
  hit(projectile, damage) {
    this.m_hp -= damage;

    projectile.destroy();
    this.scene.m_hitMobSound.play();

    // mob의 HP가 0 이하가 되는 경우
    if (this.m_hp <= 0) {
      // 폭발 효과 발생
      new Explosion(this.scene, this.x, this.y);
      this.scene.m_explosionSound.play();

      // dropRate의 확률로 item drop
      if (Math.random() < this.m_dropRate) {
        const expUp = new ExpUp(this.scene, this);
        this.scene.m_expUps.add(expUp);
      }

      // score(mobs killed) +1
      this.scene.m_topBar.gainScore();

      // player 쪽으로 움직이도록 한 event 제거
      this.scene.time.removeEvent(this.m_events);
      this.destroy();
    }
  }
}
