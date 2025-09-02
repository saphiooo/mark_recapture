/* Biodiversity Ecology - Mark and Recapture Model
*/

// CONSTANTS
let W, H;
const MAIN_WIDTH_PAD = 0.01;
const MAIN_HEIGHT_PAD = 0.03;
const MAIN_WIDTH = 0.8;
const MAIN_HEIGHT = 0.9;

const BTN_PAD = 0.02;
const BTN_HEIGHT = 0.025;
const BTN_WIDTH = 0.07;
const BTN_WIDTH_S = '100px';
const BTN_HEIGHT_S = '30px';

const SEL_HEIGHT = 0.06;
const SEL_PAD = 0.015;
const SEL_WIDTH_S = '100px';

const SLIDER_WIDTH = 0.07;
const SLIDER_HEIGHT = 0.06;
const SLIDER_PAD = 0.015;
const SLIDER_WIDTH_S = '120px';
const SLIDER_MAX = 200;
const SLIDER_DEFAULT = 50;
const SLIDER_MIN = 10;

const TXT_WIDTH = 0.2;
const TXT_HEIGHT = 0.05;
const TXT_PAD = 0.015;
const HEADER_SIZE = 20;
const LABEL_SIZE = 16;

const LOWER_SELS = 3 * BTN_HEIGHT + 3 * BTN_PAD;
const LOWER_TXTS = LOWER_SELS + TXT_PAD + 4 * SEL_HEIGHT + 4 * SEL_PAD;
const LOWER_BTNS = LOWER_TXTS + 3 * TXT_HEIGHT;

let mouseImg;

class Mouse {
  // constructor
  constructor (x, y, marked) {
    this.x = x;
    this.y = y;
    this.marked = marked;
  }
  // getters
  getX () { return this.x; }
  getY () { return this.y; }
  getMarked () { return this.marked; }
  // setters
  setX (x) { this.x = x; }
  setY (y) { this.y = y; }
  setMarked (marked) { this.marked = marked; }
  // draw
  drawMouse () {
    image(mouseImg, 25, 25, 50, 50);
  }
}

// BUTTONS
let btnReset, btnStart, btnOpen, btnMark, btnRelease, btnUnmark;
let btnNames = ['Reset', 'Start', 'Open Traps', 'Mark', 'Release', 'Unmark'];
let btns = [btnReset, btnStart, btnOpen, btnMark, btnRelease, btnUnmark];

// DROPDOWNS
let selTrapSize, selTrappability, selMigration;
let trapSize, trappability, migration;

// SELECTS
let selLabels = ['Trap Size', 'Trappability', 'Migration'];
let selOptions = [['Small', 'Medium', 'Large'], ['Neutral', 'Trap shy', 'Trap happy'], ['None', 'Some', 'Extensive']];
let sels = [selTrapSize, selTrappability, selMigration];

// SLIDERS
var slidePopulation, slideDuration;
let population, duration;
let sliderLabels = ['Initial Population', 'Trap Duration'];
let sliders = [slidePopulation, slideDuration];
let sliderVals = [population, duration];

// VARS
let marked = 0, markedInTraps = 0, totalInTraps = 0, currentPopulation = SLIDER_DEFAULT;
let labels = ['Total Marked', 'Total Marked in Traps', 'Total in Traps', 'Population'];
let vars = [marked, markedInTraps, totalInTraps, currentPopulation];

let mouse = new Mouse (50, 50);

// preload image
function preload () {
   mouseImg = loadImage('https://i.postimg.cc/YCkHmdjF/mouse.png');
  // this image does not appear on chromebooks. need to think of an alternative hosting method
  // google drive does not work
}

// SETUP
function setup() {
	W = windowWidth; H = windowHeight;
  createCanvas(windowWidth, windowHeight);
	background(255);

  // main box
	fill('#228721');
	rect(W * MAIN_WIDTH_PAD, H * MAIN_HEIGHT_PAD, W * MAIN_WIDTH, H * MAIN_HEIGHT, 4);
	fill(0);

  // buttons
	btns.forEach((btn, i) => {
    btns[i] = createButton(btnNames[i]);
		if (i < 2) { btns[i].position(W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * MAIN_HEIGHT_PAD + i * H * (BTN_HEIGHT + BTN_PAD)); }
		else { btns[i].position(W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * MAIN_HEIGHT_PAD + H * LOWER_BTNS + i * H * (BTN_HEIGHT + BTN_PAD)); }
    btns[i].style('width', BTN_WIDTH_S);
    btns[i].style('height', BTN_HEIGHT_S);
  });

  // dropdowns
	textSize(HEADER_SIZE);
	text('Demographics', W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS))
	sels.forEach((sel, i) => {
		sels[i] = createSelect();
		textSize(LABEL_SIZE);
		text(selLabels[i], W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 1) * H * SEL_HEIGHT + i * H * SEL_PAD);
    sels[i].position(W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 1) * H * (SEL_HEIGHT + SEL_PAD));
    sels[i].style('width', SEL_WIDTH_S);
		selOptions[i].forEach((option, j) => {
			sels[i].option(option);
		});
	});

	// sliders
	sliders.forEach((slider, i) => {
		textSize(LABEL_SIZE);
		text(sliderLabels[i], W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), 
				 H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 4) * H * SLIDER_HEIGHT + (i + 3.5) * H * SLIDER_PAD);
		text('' + sliderVals[i], W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH + SLIDER_WIDTH * 2), 
				 H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 4) * H * SLIDER_HEIGHT + (i + 3.5) * H * SLIDER_PAD);
	});
  slidePopulation = createSlider(10, 200);
  slidePopulation.position(W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS) + 4 * H * (SLIDER_HEIGHT + SLIDER_PAD));
  slidePopulation.style('width', SLIDER_WIDTH_S);
  slideDuration = createSlider(10, 200);
  slideDuration.position(W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS) + 5 * H * SLIDER_HEIGHT + 5 * H * SLIDER_PAD);
  slideDuration.style('width', SLIDER_WIDTH_S);
	
  // info boxes
	textSize(LABEL_SIZE);
  labels.forEach((label, i) => {
    text(label, W * (MAIN_WIDTH_PAD * 2),  H * (MAIN_HEIGHT_PAD * 2 + i * TXT_HEIGHT));
    text(vars[i], W * (MAIN_WIDTH_PAD * 2 + TXT_WIDTH), H * (MAIN_HEIGHT_PAD * 2 + i * TXT_HEIGHT));
  });
  
 
  
  mouse.drawMouse();
}

function draw() {
	repaint();
}

function repaint() {
	// essentials
	background(255);
	
  // main box
	fill('#228721');
	rect(W * MAIN_WIDTH_PAD, H * MAIN_HEIGHT_PAD, W * MAIN_WIDTH, H * MAIN_HEIGHT, 4);
	fill(0);

  // dropdowns
	textSize(HEADER_SIZE);
	text('Demographics', W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS))
	selLabels.forEach((label, i) => {
		textSize(LABEL_SIZE);
		text(label, W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 1) * H * SEL_HEIGHT + i * H * SEL_PAD);
	});

	// sliders
	population = slidePopulation.value();
	duration = slideDuration.value();
  
  sliders.forEach((slider, i) => {
		textSize(LABEL_SIZE);
		text(sliderLabels[i], W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH), 
				 H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 4) * H * SLIDER_HEIGHT + (i + 3.5) * H * SLIDER_PAD);
    // BUGGY
		text('' + sliderVals[i], W * (MAIN_WIDTH_PAD * 2 + MAIN_WIDTH + SLIDER_WIDTH * 2), 
				 H * (MAIN_HEIGHT_PAD + LOWER_SELS) + (i + 4) * H * SLIDER_HEIGHT + (i + 3.5) * H * SLIDER_PAD);
	});
	
  // info boxes
	textSize(HEADER_SIZE);
	text('Traps', W * (MAIN_WIDTH_PAD * 2), H * (MAIN_HEIGHT_PAD * 2.5))
   // info boxes
	textSize(LABEL_SIZE);
  labels.forEach((label, i) => {
    text(label, W * (MAIN_WIDTH_PAD * 2),  H * (MAIN_HEIGHT_PAD * 4 + i * TXT_HEIGHT));
    text(vars[i], W * (MAIN_WIDTH_PAD * 2 + TXT_WIDTH), H * (MAIN_HEIGHT_PAD * 4 + i * TXT_HEIGHT));
  });
}
