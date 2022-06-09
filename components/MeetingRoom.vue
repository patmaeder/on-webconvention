<template>
  <div class="meetingRoomWrapper">
    <div class="header">
      <div class="menu-wrapper">
        <div class="menu">
          <ul>
            <li>
              <BasicIcon
                size="medium"
                source="/icons/q.svg"
                class="basic-btn"
              />
            </li>
            <li>
              <BasicIcon
                size="medium"
                source="/icons/settings.svg"
                class="basic-btn"
              />
            </li>
          </ul>
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
        <div id="screen">SCREEN / WHITEBOARD / PRESENTATION</div>
      </div>
    </div>
    <BasicIcon id="button-calendar" size="large" source="/icons/filter.svg" />
    <div class="footer">
      <div class="toolbar">
        <ul>
          <li>
            <BasicIcon
              size="medium"
              source="/icons/mic.svg"
              class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
              size="medium"
              source="/icons/phones.svg"
              class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
              size="medium"
              source="/icons/end_call.svg"
              class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
              size="medium"
              source="/icons/cam.svg"
              class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
              size="medium"
              source="/icons/chat.svg"
              class="basic-btn"
            />
          </li>
        </ul>
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

  //PADDING
  padding: 0 50px;
}

.header {
  width: 100%;
  height: 15vh;
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
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    ul {
      display: flex;
      padding: 0px;
      margin: 0px;

      li {
        margin-left: 20px;
        list-style: none;

        &:first-child {
          margin-left: 0px;
        }

        .basic-btn {
          &:hover {
            background: #79f0da;
          }
        }
      }
    }
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
  height: 15vh;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-auto-flow: column;
  grid-auto-columns: 20%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.camera {
  width: 90%;
  height: 100%;
  background: grey;
  border-radius: 25px;
}

.screen-wrapper {
  width: 100%;
  height: 51vh;
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
  height: 15vh;
  display: flex;
  justify-content: center;
}

.toolbar {
  height: 15vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  ul {
    display: flex;
    padding: 0px;
    margin: 0px;

    li {
      margin-left: 20px;
      list-style: none;

      &:first-child {
        margin-left: 0px;
      }

      .basic-btn {
        &:hover {
          background: #79f0da;
        }
      }
    }
  }
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

  //width: 80px;
  //height: 80px;
  //border-radius: 160px;
  position: absolute;
  bottom: 25px;
  left: 50px;
}
</style>
