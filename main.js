var game,
  level,
  color = ["orange", "skyblue"],
  water = [],
  w = [],
  currentLevel,
  clicked = [],
  transferring = false,
  t = false,
  size = 1,
  sizechange = 0.05,
  won = false;
var testTubePosition = {
  0: [
    [-110, 130],
    [-20, 130],
    [70, 130],
  ],
};

window.onload = function () {
  game = document.getElementById("game");
  level = document.getElementById("level");
};
//level open
window.OpenLevel = function (x) {
  currentLevel = 0;
  won = false;
  level.style.display = "block";
  level.innerHTML = "";
  water = [];
  let a = [],
    c = 0;
  for (let i = 0; i < x + 2; i++) {
    for (let j = 0; j < 4; j++) {
      a.push(color[i]);
    }
  }
  a = shuffle(a);
  for (let i = 0; i < x + 2; i++) {
    water[i] = [];
    for (let j = 0; j < 4; j++) {
      water[i].push(a[c]);
      c++;
    }
  }
  water.push(
    ["transparent", "transparent", "transparent", "transparent"],
    ["transparent", "transparent", "transparent", "transparent"]
  );
  w = water.map((a) => [...a]);
  // console.log(water[0]);
  ApplyInfo();
};
// apply html information
function ApplyInfo(a = water) {
  if (!won) {
    let d = 0,
      heading = ["Level 2"][currentLevel];
    level.innerHTML = `<div id = 'lvl-heading'>${heading}</div>`;
    for (let i of testTubePosition[currentLevel]) {
      level.innerHTML += `<div class = "test-tube" style="top:${i[1]}px;left:calc(50vw + ${i[0]}px);transform:rotate(0deg);" onclick="Clicked(${d});">
                <div class="colors" style = "background-color:${a[d][0]};top:100px;"></div>
                <div class="colors" style = "background-color:${a[d][1]};top:70px;"></div>
                <div class="colors" style = "background-color:${a[d][2]};top:40px;"></div>
                <div class="colors" style = "background-color:${a[d][3]};top:10px;"></div>
            </div>`;
      d++;
    }
    level.innerHTML += `<div id = "restart" class = "game-buttons" onclick = "Restart();">RESTART</div><div id = "home" class = "game-buttons" onclick = "ShowMenu();">HOME</div>`;
  }
}
//clicked function
window.Clicked = function (x) {
  // console.log("xxx", x);
  if (!transferring) {
    if (clicked.length == 0) {
      clicked.push(x);
      document.getElementsByClassName("test-tube")[x].style.transition =
        "0.2s linear";
      document.getElementsByClassName("test-tube")[x].style.transform =
        "scale(1.08)";
    } else {
      clicked.push(x);
      let el = document.getElementsByClassName("test-tube")[clicked[0]];
      el.style.transform = "scale(1) rotate(0deg)";
      if (clicked[0] != clicked[1]) {
        el.style.transition = "1s linear";
        Transfer(...clicked);
      }
      clicked = [];
    }
  }
};
//transfer animation
function TransferAnim(a, b) {
  let el = document.getElementsByClassName("test-tube")[a];
  transferring = true;
  el.style.zIndex = "100";
  el.style.top = `calc(${testTubePosition[currentLevel][b][1]}px - 90px)`;
  el.style.left = `calc(50vw + ${testTubePosition[currentLevel][b][0]}px - 70px)`;
  el.style.transform = "rotate(75deg)";
  setTimeout(function () {
    el.style.transform = "rotate(90deg)";
  }, 1000);
  setTimeout(function () {
    el.style.left = `calc(50vw + ${testTubePosition[currentLevel][a][0]}px)`;
    el.style.top = `calc(${testTubePosition[currentLevel][a][1]}px)`;
    el.style.transform = "rotate(0deg)";
  }, 2000);
  setTimeout(function () {
    el.style.zIndex = "0";
    transferring = false;
  }, 3000);
}
//transfer color
function Transfer(a, b) {
  /* 
    a represents the index of the glass from which water is to ne taken
    b represents the index of the glass to which water is to be transferred
    constraints:
    b should have white
    last element of a = last non-white element in b
    */
  if (
    !water[b].includes("transparent") ||
    water[a] == ["transparent", "transparent", "transparent", "transparent"]
  ) {
    return;
  }
  let p,
    q,
    r = false,
    s = false,
    count = 0,
    c = 0;
  for (let i = 0; i < 4; i++) {
    if (
      ((water[a][i] != "transparent" && water[a][i + 1] == "transparent") ||
        i === 3) &&
      !r
    ) {
      r = true;
      p = [water[a][i], i];
      if (
        water[a]
          .map(function (x) {
            if (x == "transparent" || x == p[0]) {
              return 1;
            } else {
              return 0;
            }
          })
          .reduce((x, y) => x + y) === 4
      ) {
        p.push(i + 1);
      } else {
        for (let j = 1; j < 4; j++) {
          if (i - j >= 0 && water[a][i - j] != p[0]) {
            p.push(j);
            break;
          }
        }
      }
    }
    if (
      ((water[b][i] != "transparent" && water[b][i + 1] == "transparent") ||
        water[b][0] == "transparent") &&
      !s
    ) {
      s = true;
      q = [
        water[b][i],
        i,
        water[b]
          .map((x) => (x = x == "transparent" ? 1 : 0))
          .reduce((x, y) => x + y),
      ];
    }
  }
  // console.log("p", p);

  for (let i = 3; i >= 0; i--) {
    if ((water[a][i] == p[0] || water[a][i] == "transparent") && count < q[2]) {
      if (water[a][i] == p[0]) {
        count++;
      }
      water[a][i] = "transparent";
    } else {
      break;
    }
  }
  // console.log("count", count);
  // console.log("q", q);
  c = count;
  setTimeout(function () {
    WaterDec(p, a, c);
  }, 1010);
  setTimeout(function () {
    WaterInc(p, q, b, c);
  }, 1010);
  for (let i = 0; i < 4; i++) {
    if (water[b][i] == "transparent" && count > 0) {
      count--;
      water[b][i] = p[0];
    }
  }
  setTimeout(function () {
    ApplyInfo();
  }, 3020);
  setTimeout(function () {
    TransferAnim(a, b);
  }, 10);
  setTimeout(Won, 3000);
}
// water dec
function WaterDec(p, a, count) {
  p[1] = 3 - p[1];
  //console.log(count*30);
  document.getElementsByClassName("test-tube")[
    a
  ].innerHTML += `<div id = "white-bg" style = "top:calc(10px + ${
    p[1] * 30
  }px - 1px);"></div>`;
  setTimeout(function () {
    document.getElementById("white-bg").style.height = count * 30 + 1 + "px";
  }, 50);
  setTimeout(function () {
    document.getElementsByClassName("test-tube")[a].innerHTML = `
            <div class="colors" style = "background-color:${water[a][0]};top:100px;"></div>
            <div class="colors" style = "background-color:${water[a][1]};top:70px;"></div>
            <div class="colors" style = "background-color:${water[a][2]};top:40px;"></div>
            <div class="colors" style = "background-color:${water[a][3]};top:10px;"></div>`;
  }, 1050);
}
//water data
function WaterInc(p, q, b, count) {
  q[1] = 4 - q[1];
  q[1] -= q[0] != "transparent" ? 1 : 0;
  document.getElementsByClassName("test-tube")[
    b
  ].innerHTML += `<div id = "colorful-bg" style = "background-color:${
    p[0]
  };top:calc(10px + ${q[1] * 30}px);"></div>`;
  setTimeout(function () {
    document.getElementById("colorful-bg").style.height = count * 30 + 1 + "px";
    document.getElementById("colorful-bg").style.top = `calc(10px + ${
      q[1] * 30
    }px - ${count * 30}px)`;
  }, 50);
}
//Restart function
window.Restart = function () {
  water = w.map((a) => [...a]);
  won = false;
  ApplyInfo(w);
};
//show main menu
window.ShowMenu = function () {
  document.getElementById("level").style.display = "none";
};
//won function
function Won() {
  for (let i of water) {
    if (i[0] != i[1] || i[1] != i[2] || i[2] != i[3]) {
      return;
    }
  }
  won = true;
  // console.log("hello");
  level.innerHTML = `<div id="won">YOU WON</div><div id = "restart" class = "game-buttons" onclick = "Restart();">RESTART</div><div id = "home" class = "game-buttons" onclick = "ShowMenu();">HOME</div>`;
}
//shuffle color
function shuffle(x) {
  // console.log("shuffle", x);
  let a = [],
    len = x.length;
  for (let i = 0; i < len; i++) {
    let n = Math.floor(Math.random() * x.length);
    a.push(x[n]);
    x.splice(n, 1);
  }
  return a;
}
