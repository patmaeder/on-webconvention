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
  box-sizing: border-box;
  background: #252830;

  //PADDING
  padding: 0 25px;

  @media screen and (min-width: 768px) {
    padding: 0 50px;
  }
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
      padding: 0px;
      margin: 0px;
      display: flex;

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
  padding: 0px;
  box-sizing: border-box;

  @media screen and (min-width: 768px) {
    padding: 0px 100px;
  }
}

.members {
  width: 100%;
  height: 15vh;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;

  @media screen and (min-width: 400px) {
    grid-auto-columns: 50%;
  }

  @media screen and (min-width: 576px) {
    grid-auto-columns: 25%;
  }

  @media screen and (min-width: 992px) {
    grid-auto-columns: 20%;
  }
}

.camera {
  width: 90%;
  height: 100%;
  margin-left: 5px;
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
    background: salmon;
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
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 768px) {
    width: 100%;
  }

  ul {
    display: flex;
    padding: 0px;
    margin: 0px;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;

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

#button-calendar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 25px;
}
</style>
