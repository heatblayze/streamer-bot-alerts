class visualTransition {
  static fadeInOut(element, easeIn, wait, easeOut) {
    gsap.fromTo(element, { opacity: 0 }, { opacity: 1, ease: Linear.easeNone, duration: easeIn });
    gsap.fromTo(element, { opacity: 1 }, { opacity: 0, ease: Linear.easeNone, duration: easeOut, delay: wait + easeIn });
  }
}

class audioTransition {
  static fadeInOut(element, easeIn, wait, easeOut, targetVolume) {
    gsap.fromTo(element, { volume: 0 }, { volume: targetVolume, ease: "power1.in", duration: easeIn });
    gsap.fromTo(element, { volume: targetVolume }, { volume: 0, ease: "power1.out", duration: easeOut, delay: wait + easeIn });
  }
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function connectws() {
  if ("WebSocket" in window) {
    const ws = new WebSocket("ws://localhost:6969/");
    ws.onclose = function () {
      // "connectws" is the function we defined previously
      setTimeout(connectws, 10000);
    };

    ws.onopen = function () {
      ws.send(JSON.stringify(
        {
          "request": "Subscribe",
          "events": {
            "Raw": [
              "SubAction"
            ],
          },
          "id": "123"
        }
      ));
    };
    ws.onmessage = function (event) {
      const msg = event.data;
      const wsdata = JSON.parse(msg);

      // check for events to trigger
      //check for emotes wsdata.data.message.emotes
      if (wsdata.event &&
          wsdata.event.source === "Raw" &&
          wsdata.data.type === 1002 &&
          wsdata.data.parentName === "Tip") {
        var container = document.getElementById("container");

        let duration = wsdata.data.arguments.duration;
        let durationSeconds = duration / 1000;

        console.log(wsdata);
        console.log(wsdata.event.type + ' ' + JSON.stringify(wsdata.data));
        console.log(wsdata.data.arguments.quote);

        var quoteString = formatString(wsdata.data.arguments.quote, {
          tipUsername: wsdata.data.arguments.tipUsername,
          tipAmount: wsdata.data.arguments.tipAmount
        });
        console.log(quoteString);

        let imgPath = wsdata.data.arguments.image.replace(/[\\/]+/g, '/');

        var img = new Image();
        img.src = './images/' + imgPath;
        img.onload = function () {

          // ==================================
          // ALERT
          let alertDiv = document.createElement('div');
          alertDiv.style.display = "flex";
          alertDiv.style.position = "relative";
          alertDiv.style.width = "600px";
          alertDiv.style.aspectRatio = img.width / img.height;

          alertDiv.style.opacity = 0;
          visualTransition.fadeInOut(alertDiv,
            wsdata.data.arguments.inDuration,
            durationSeconds - wsdata.data.arguments.inDuration - wsdata.data.arguments.outDuration,
            wsdata.data.arguments.outDuration);

          // ==================================
          // IMAGE
          var imageElement = document.createElement('img');
          imageElement.style.backgroundSize = '100% 100%';
          imageElement.src = './images/' + imgPath;
          imageElement.style.width = "100%";
          imageElement.style.height = "100%";
          alertDiv.append(imageElement);
          // ==================================

          // ==================================
          // QUOTE
          let quoteDiv = document.createElement('div');
          quoteDiv.classList.add('centerX');
          quoteDiv.style.textAlign = "center";
          quoteDiv.style.wordSpacing = "0.5em";
          quoteDiv.style.marginLeft = "1.5%";
          quoteDiv.style.marginRight = "1.5%";
          quoteDiv.style.width = "97%";

          let quoteSpan = document.createElement('span');          
          quoteSpan.style.textAlign = "center";
          quoteSpan.style.display = "inline-block";

          let words = quoteString.split(' ');
          let letterIndex = 0;
          for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            if (wordIndex > 0) {
              let span = document.createElement('span');
              span.innerText = " ";
              quoteSpan.append(span);
            }

            let word = words[wordIndex];
            let wordSpan = document.createElement('span');
            wordSpan.style.overflowWrap = "normal";
            wordSpan.style.display = "inline-block";

            let wordRandom = randomRange(1, 2);

            for (let i = 0; i < word.length; i++) {
              let char = word[i];
              let span = document.createElement('span');
              span.innerHTML = char;
              span.style.position = "relative";
              span.style.display = "inline-block";              
              span.style.fontSize = '40px';
              span.style.fontFamily = `"${wsdata.data.arguments.quoteFont}", Arial, sans-serif`;
              span.style.fontWeight = "bold";

              span.classList.add('outline-text');

              gsap.from(span, { y: 100, opacity: 0, ease: "back.out(1.8)", duration: 1, delay: letterIndex * 0.01 });
              gsap.to(span, {
                keyframes: {
                  y: [0, -10, -10, 0],
                  rotation: [0, 0, -10, 10, -25, 25, -10, 10, 0],
                  ease: "sine.inOut"
                },
                duration: 1,
                delay: wordRandom + (i * 0.1),
                repeat: -1,
                repeatDelay: 1
              });

              wordSpan.append(span);

              ++letterIndex;
            }
            quoteSpan.append(wordSpan);
          }

          quoteDiv.append(quoteSpan);
          alertDiv.append(quoteDiv);
          // ==================================

          // ==================================          

          // ==================================
          // AUDIO
          let audio = new Audio('./sounds/' + wsdata.data.arguments.sound);
          audio.style.display = "none";
          audio.autoplay = false;
          alertDiv.append(audio);

          audio.volume = 0;
          audio.oncanplay = function () {
            setTimeout(() => {
              audioTransition.fadeInOut(audio,
                wsdata.data.arguments.soundIn,
                durationSeconds - wsdata.data.arguments.soundIn - wsdata.data.arguments.soundOut,
                wsdata.data.arguments.soundOut,
                wsdata.data.arguments.soundVolume);
              audio.play();
            }, wsdata.data.arguments.soundDelay);
          }
          // ==================================

          setTimeout(() => {
            container.append(alertDiv);
          }, 20);

          setTimeout(() => {
            alertDiv.remove();
          }, duration);
        }
      }
    };
  }
}

function removeelement(div) {
  document.getElementById(div).remove();
}

// Randomizer
function randomMinMax(min, max) { return min + Math.random() * (max - min); }

function randomSign() { return Math.random() < 0.5 ? -1 : 1; }

function formatString(format, args) {
  return format.replace(/({)+(\w+)+(})/g, function (match, arg, arg2, arg3) {
    return typeof args[arg2] != 'undefined'
      ? args[arg2]
      : match
      ;
  });
}

connectws();