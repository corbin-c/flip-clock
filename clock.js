const DURATION = 850;

let wait = (t) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}

let changeTime = async (newTime=false) => {
  if (newTime === false) {
    newTime = new Date();
  } else if (typeof newTime !== "object") {
    try {
      newTime = new Date(newTime);
    } catch {
      console.error("Provided date couldn't be converted to a Date object"); 
    }
  }
  let hour = document.querySelector(".hh .d-current span");
  let am = document.querySelector(".hh .d-current .am");
  let minutes = document.querySelector(".mm .d-current .d-front");
  let currentTime = [hour.innerText,am.innerText, minutes.innerText];
  newTime = [newTime.getHours(),"am",newTime.getMinutes().toString()];
  if ((newTime[0] > 12) || (newTime[0] == 0)) {
    newTime[0] = Math.abs(newTime[0]-12);
    newTime[1] = "pm";
  }
  if (newTime[2].length == 1) {
    newTime[2] = "0"+newTime[2];
  }
  newTime[0] = newTime[0].toString();
  if (newTime[2] != currentTime[2]) {
    document.querySelector(".mm .d-top .d-front").innerText = newTime[2];
    document.querySelector(".mm .d-current .d-back span").innerText = newTime[2];
    await flip("mm");
  }
  if ((newTime[0] != currentTime[0]) || (newTime[1] != currentTime[1])) {
    document.querySelector(".hh .d-top .d-front span").innerText = newTime[0];
    document.querySelector(".hh .d-top .d-front .am").innerText = newTime[1];
    document.querySelector(".hh .d-current .d-back span").innerText = newTime[0];    
    await flip("hh");
  }
}

let flip = async (target) => {
  let oldTop = document.querySelector("."+target+" .d-top");
  let oldCurrent = document.querySelector("."+target+" .d-current");
  let oldBottom = document.querySelector("."+target+" .d-bottom");
  oldCurrent.classList.add("flip");
  oldTop.classList.add("next");
  await wait(DURATION);
  oldTop.setAttribute("class","face d-current inner-digit");
  oldCurrent.setAttribute("class","face d-bottom inner-digit");
  oldBottom.setAttribute("class","face d-top inner-digit");
}

(async () => {
  let div = document.createElement("div");
  let ul = document.createElement("div");
  div.setAttribute("class","face tube");
  ul.setAttribute("class","face seconds");
  document.querySelector(".clock").append(div);
  document.querySelector(".clock").append(ul);
  for (let s=0;s<60;s++) {
    let part = document.createElement("div");
    let li = document.createElement("div");
    li.innerText = s;
    li.setAttribute("class","face");
    if (s == 0) {
      li.setAttribute("id","sec0");
    }
    if (s < 6) {
      part.setAttribute("class","face plastic");
    } else if ((s >= 6) && (s < 25)) {
      part.setAttribute("class","face glass");
    } else if ((s >= 25) && (s < 29)){
      part.setAttribute("class","face plastictop");    
    } else {
      part.setAttribute("class","face plastic"+Math.ceil((s-28)/5));    
    }
    let angle = 6*s*(Math.PI/180);
    let translateY = Math.cos(angle)*13;
    let translateZ = Math.sin(angle)*13;
    let liY = Math.cos(angle)*9.333333333333334;
    let liZ = Math.sin(angle)*9.333333333333334;
    part.setAttribute("style","transform: translate3d(0px, "+translateY+"vw, "+translateZ+"vw) rotateX("+(90+(6*s))+"deg);");
    li.setAttribute("style","transform: translate3d(0px, "+liY+"vw, "+liZ+"vw) rotateX("+(270+(6*s))+"deg);");
    //~ li.setAttribute("style","transform: translate3d("+s+"px, 0, "+s+"px) rotateX("+6*s+"deg);");
    ul.append(li);
    div.append(part);
  }
  let hour = new Date();
  let offset = ((hour.getSeconds()+5) * 6) + 270;
  document.querySelector("style").innerText += `
    @keyframes init-seconds {
      from {
        transform: translateX(52vw) translateY(13.333333333333334vw) rotate3d(1, 0, 0, 0deg);
      }
      to {
        transform: translateX(52vw) translateY(13.333333333333334vw) rotate3d(1, 0, 0, `+(1080-offset)+`deg);
      }
    }
    @keyframes rotation-seconds {
      from {
        transform: translateX(52vw) translateY(13.333333333333334vw) rotate3d(1, 0, 0, `+(1080-offset)+`deg);
      }
      to {
        transform: translateX(52vw) translateY(13.333333333333334vw) rotate3d(1, 0, 0, `+(720-offset)+`deg);
      }
    }
  `;
  changeTime();
  setTimeout(() => {
    changeTime();
    setInterval(() => {
      changeTime();
    },60000);
  },(60-hour.getSeconds())*1000);
  await wait(5000);
  ul.setAttribute("class","face seconds active");
})()

let changeView = (oldX, oldY, newX, newY) => {
  let target = document.querySelector(".userbox");
  let style = target.getAttribute("style");
  let transforms = [0,0];
  if (style !== null) {
    // parse current values
    transforms[0] = parseInt(style.split("rotateX(")[1].split("deg")[0]);
    transforms[1] = parseInt(style.split("rotateY(")[1].split("deg")[0]);
  }
  transforms[0] -= parseInt(newY - oldY)/7;
  transforms[1] += parseInt(newX - oldX)/7;
  target.setAttribute("style","transform: rotateX("+transforms[0]+"deg) rotateY("+transforms[1]+"deg)");
}
x = 0;
y = 0;
isDragging = false;
window.addEventListener("mousedown", e => {
  x = e.clientX;
  y = e.clientY;
  isDragging = true;
});
window.addEventListener("mousemove", e => {
  if (isDragging) {
    changeView(x, y, e.clientX, e.clientY);
    x = e.clientX;
    y = e.clientY;
  }
});
window.addEventListener("mouseup", e => {
  if (isDragging) {
    changeView(x, y, e.clientX, e.clientY);
    x = 0;
    y = 0;
    isDragging = false;
  }
});

