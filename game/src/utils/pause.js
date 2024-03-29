import game from "../index";

let global_scene_paused = false;
let global_time_paused = Date.now() - 100; //연속적인 일시 정지/재개 요청을 방지하기 위한 100ms의 딜레이

export default function global_pause(scene) {
  if ((Date.now() - global_time_paused > 100) & game.scene.isActive(scene)) {
    game.scene.pause(scene);
    global_time_paused = Date.now();
    global_scene_paused = scene;

    game.scene.getScene(scene).togglePauseScreen(true);
    game.scene.getScene(scene).m_pauseInSound.play({ volume: 0.2 });
  }
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    Date.now() - global_time_paused > 100 &&
    global_scene_paused
  ) {
    game.scene.resume(global_scene_paused);
    game.scene.getScene(global_scene_paused).togglePauseScreen(false);
    game.scene
      .getScene(global_scene_paused)
      .m_pauseOutSound.play({ volume: 0.2 });
    global_scene_paused = false;
    global_time_paused = Date.now();
  }
});
