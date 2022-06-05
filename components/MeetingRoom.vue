<template>
  <div class="meetingRoomWrapper">
    <div class="header">
      <div class="menu-wrapper">
        <div class="menu">
          <div id="button-small">FRA</div>
          <div id="button-small">EIN</div>
        </div>
      </div>
    </div>
    <div class="main-section">
      <div class="members">
        <div class="camera"></div>
        <div class="camera"></div>
        <div class="camera"></div>
        <div class="camera"></div>
        <div class="camera"></div>
        <div class="camera"></div>
      </div>
      <div class="screen-wrapper">
        <div id="screen">SCREEN / WHITEBOARD / PRASENTATION</div>
      </div>
    </div>
    <div id="button-calendar">XY</div>
    <div class="footer">
      <div class="toolbar">
        <div id="button-small">A</div>
        <div id="button-small">B</div>
        <div id="button-small">C</div>
        <div id="button-small">D</div>
        <div id="button-small">E</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.meetingRoomWrapper {
  width: 100%;
  max-height: 100vh;
  background: #252830;
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .menu-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .menu {
    width: 15%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.main-section {
  width: 100%;
  height: 100%;
  padding: 0px 100px;
  box-sizing: border-box;
}

.members {
  width: 100%;
  height: 18vh;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-auto-flow: column;
  grid-auto-columns: 25%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.camera {
  width: 80%;
  height: 100%;
  background: grey;
  border-radius: 25px;
}

.screen-wrapper {
  width: 100%;
  height: 58vh;
  padding: 2vh 0;

  #screen {
    width: 100%;
    height: 100%;
    background: navajowhite;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.footer {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: center;
}

.toolbar {
  height: 10vh;
  width: 25%;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

#button-small {
  background: whitesmoke;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 60px;
  height: 60px;
  border-radius: 120px;
}

#button-calendar {
  background: whitesmoke;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 80px;
  height: 80px;
  border-radius: 160px;
  position: absolute;
  bottom: 0px;
  left: 0px;
}
</style>
