let video;
let poseNet;
let pose;
let skeleton;
let postureStatus = "Detecting...";

function hideLoadingScreen() {
  const loader = document.getElementById("loadingScreen");
  if (loader) loader.style.display = "none";
}

function setup() {
  createCanvas(800, 500);

  video = createCapture(VIDEO, hideLoadingScreen);
  video.size(800, 500);
  video.hide();

  poseNet = ml5.poseNet(video, () => {
    console.log("PoseNet Loaded");
  });

  poseNet.on("pose", results => {
    if (results.length > 0) {
      pose = results[0].pose;
      skeleton = results[0].skeleton;
    }
  });
}

function draw() {
  image(video, 0, 0, width, height);

  if (pose) {
    drawKeypoints();
    drawSkeleton();
    detectPosture();
  }

  displayPosture();
}

//  Bigger keypoints
function drawKeypoints() {
  fill(0, 255, 0);
  noStroke();

  for (let i = 0; i < pose.keypoints.length; i++) {
    let kp = pose.keypoints[i];
    if (kp.score > 0.6) {
      ellipse(kp.position.x, kp.position.y, 14);
    }
  }
}

//  THICK skeleton lines
function drawSkeleton() {
  stroke(0, 255, 255);
  strokeWeight(6);
  strokeCap(ROUND);

  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];

    line(
      a.position.x,
      a.position.y,
      b.position.x,
      b.position.y
    );
  }
}

//  POSTURE DETECTION FUNCTION
function detectPosture() {
  let leftShoulder = pose.leftShoulder;
  let rightShoulder = pose.rightShoulder;

  let shoulderDiff = abs(leftShoulder.y - rightShoulder.y);

  if (shoulderDiff < 20) {
    postureStatus = "✅ Straight Posture";
  } else {
    postureStatus = "❌ Slouched Posture";
  }
}

//  DISPLAY POSTURE STATUS
function displayPosture() {
  fill(0);
  rect(0, 0, width, 40);

  textSize(24);
  textAlign(CENTER, CENTER);

  if (postureStatus.includes("Straight")) {
    fill(0, 255, 0);
  } else {
    fill(255, 0, 0);
  }

  text(postureStatus, width / 2, 20);
}
