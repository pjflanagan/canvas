import { c as create_ssr_component, d as add_attribute, v as validate_component } from "../../chunks/index.js";
class Color {
  static hexToColor(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 1
    } : void 0;
  }
  static getRandomColor(a = 1) {
    return {
      r: Random.number(0, 255),
      g: Random.number(0, 255),
      b: Random.number(0, 255),
      a
    };
  }
  static getRandomSimilarColor(originalColor, distance) {
    const d1 = Random.float(-1, 1) * distance;
    const d2 = Random.float(-1, 1) * (distance - d1);
    const d3 = distance - (d1 + d2);
    const [dr, dg, db] = Random.shuffle([d1, d2, d3]);
    return {
      r: originalColor.r + dr,
      g: originalColor.g + dg,
      b: originalColor.b + db,
      a: originalColor.a
    };
  }
  static getDarkerColor(color, darkness) {
    return {
      r: color.r - darkness,
      g: color.g - darkness,
      b: color.b - darkness,
      a: color.a
    };
  }
  static toString(color, opacity) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity ? opacity : color.a})`;
  }
  static getAverageColor(c1, c2) {
    return {
      r: (c1.r + c2.r) / 2,
      g: (c1.g + c2.g) / 2,
      b: (c1.b + c2.b) / 2,
      a: (c1.a + c2.a) / 2
    };
  }
  static makeSpectrum(c1, c2, colorCount) {
    const colors = [c1];
    const delta = {
      r: c2.r - c1.r,
      g: c2.g - c1.g,
      b: c2.b - c1.b,
      a: c2.a - c1.a
    };
    for (let i = 1; i <= colorCount; ++i) {
      colors.push({
        r: c1.r + delta.r * i / colorCount,
        g: c1.g + delta.g * i / colorCount,
        b: c1.b + delta.b * i / colorCount,
        a: c1.a + delta.a * i / colorCount
      });
    }
    return colors;
  }
}
class Random {
  static number(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  static prop({ min, max }, comp = 1) {
    return Random.float(min, max) * comp;
  }
  static float(min, max) {
    return Math.random() * (max - min) + min;
  }
  static boolean() {
    return Random.odds(0.5);
  }
  static odds(likelihood) {
    return Math.random() < likelihood;
  }
  static color(a = 1) {
    return Color.getRandomColor(a);
  }
  static arrayItemWeighted(arr, weigths) {
    if (arr.length === 0) {
      return void 0;
    }
    const selectionArray = [];
    weigths.forEach((w, index) => {
      for (let i = 0; i < w; ++i) {
        selectionArray.push(arr[index]);
      }
    });
    return Random.arrayItem(selectionArray);
  }
  static arrayItem(arr) {
    if (arr.length === 0) {
      return void 0;
    }
    return arr[Random.number(0, arr.length)];
  }
  static subset(arr, size) {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp;
    let index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }
  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  static insert(array, value) {
    array.splice(Random.number(0, array.length), 0, value);
    return array;
  }
}
const ZERO_POINT = { x: 0, y: 0 };
class Geometry {
  static distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
  static ellipseCircleIntersection({
    ellipseRadiusX,
    ellipseRadiusY,
    circleRadius
  }) {
    const num = ellipseRadiusX * ellipseRadiusX - circleRadius * circleRadius;
    const denom = ellipseRadiusX * ellipseRadiusX / (ellipseRadiusY * ellipseRadiusY) - 1;
    const y = Math.sqrt(num / denom);
    const x = Math.sqrt(circleRadius * circleRadius - y * y);
    const values = [
      { x, y, phi: Math.atan2(y, x), theta: -1 },
      { x: -x, y, phi: Math.atan2(y, -x), theta: -1 },
      { x, y: -y, phi: Math.atan2(-y, x), theta: -1 },
      { x: -x, y: -y, phi: Math.atan2(-y, -x), theta: -1 }
    ];
    values.forEach((v) => {
      v.theta = Math.atan(ellipseRadiusX / ellipseRadiusY * Math.tan(v.phi));
    });
    return values;
  }
  static getAngleTo(sourcePoint, targetPoint) {
    return Math.atan2(targetPoint.x - sourcePoint.x, targetPoint.y - sourcePoint.y);
  }
  static getDeltaAngle(sourceAngle, targetAngle) {
    return Math.atan2(Math.sin(targetAngle - sourceAngle), Math.cos(targetAngle - sourceAngle));
  }
  static degToRad(deg) {
    return deg * (Math.PI / 180);
  }
}
class Motion {
  static hasReachedPoint(sourcePoint, targetPoint, threshold) {
    return Geometry.distance(sourcePoint, targetPoint) < threshold;
  }
  static isInBounds(pos, upperBounds, lowerBounds = ZERO_POINT) {
    return pos.x > lowerBounds.x && pos.x < upperBounds.x && pos.y > lowerBounds.y && pos.y < upperBounds.y;
  }
  static isOutOfBounds(pos, upperBounds, lowerBounds = ZERO_POINT) {
    return !Motion.isInBounds(pos, upperBounds, lowerBounds);
  }
  static getPointInDirection(cur, angle, radius) {
    return {
      x: cur.x + Math.sin(angle) * radius,
      y: cur.y + Math.cos(angle) * radius
    };
  }
  static moveTowardsPoint(cur, to, speed) {
    if (Motion.hasReachedPoint(cur, to, speed)) {
      return cur;
    }
    const angle = Math.atan2(to.y - cur.y, to.x - cur.x);
    return Motion.moveAtAngle(cur, angle, speed);
  }
  static moveAtAngle(pos, angle, speed) {
    return {
      x: pos.x + Math.sin(angle) * -speed,
      y: pos.y + Math.cos(angle) * -speed
    };
  }
  static rotateTowardsAngleAtSpeed(sourceAngle, targetAngle, rotationSpeed) {
    const deltaAngle = Geometry.getDeltaAngle(sourceAngle, targetAngle);
    if (Math.abs(deltaAngle) < Math.abs(rotationSpeed)) {
      return sourceAngle;
    }
    return sourceAngle - Math.sign(deltaAngle) * rotationSpeed;
  }
}
class Visual {
  ctx;
  W;
  H;
  shorterSideLength;
  diagonalLength;
  isRunning;
  animationReq;
  mousePos;
  scrollY;
  maxScrollHeight;
  constructor(context) {
    this.ctx = context;
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.shorterSideLength = Math.min(this.W, this.H);
    this.diagonalLength = Geometry.distance({ x: 0, y: 0 }, { x: this.W, y: this.H });
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.maxScrollHeight = 0;
    this.mousePos = {
      x: 0,
      y: 0
    };
    this.scrollY = 0;
  }
  setup() {
    throw "Method needs to be implemented by child of Canvas.";
  }
  drawFrame() {
    throw "Method needs to be implemented by child of Canvas.";
  }
  getContext() {
    return this.ctx;
  }
  getSize() {
    return {
      H: this.H,
      W: this.W,
      shorterSideLength: this.shorterSideLength,
      diagonalLength: this.diagonalLength
    };
  }
  getUserPosition() {
    return {
      scrollY: this.scrollY,
      mousePos: this.mousePos
    };
  }
  handleMouseMove(e) {
    this.mousePos = {
      x: e.clientX,
      y: e.clientY
    };
  }
  handleMouseDown(_e) {
    return;
  }
  handleScroll(scrollY) {
    this.scrollY = scrollY;
  }
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }
  animate() {
    this.drawFrame();
    this.animationReq = window.requestAnimationFrame(this.animate.bind(this));
  }
  stop() {
    if (this.animationReq) {
      window.cancelAnimationFrame(this.animationReq);
    }
    this.isRunning = false;
  }
}
function drawStroke(ctx, step, position) {
  const { x, y } = position || { x: 0, y: 0 };
  const [moveType] = step;
  switch (moveType) {
    case "moveTo":
      ctx.moveTo(x + step[1], y + step[2]);
      break;
    case "lineTo":
      ctx.lineTo(x + step[1], y + step[2]);
      break;
    case "quadraticCurveTo":
      ctx.quadraticCurveTo(x + step[1], y + step[2], x + step[3], y + step[4]);
      break;
    case "arc":
      ctx.arc(x + step[1], y + step[2], step[3], step[4], step[5], step[6]);
      break;
    case "rect":
      ctx.rect(x + step[1], y + step[2], x + step[3], y + step[4]);
      break;
    case "ellipse":
      ctx.ellipse(x + step[1], y + step[2], step[3], step[4], step[5], step[6], step[7], step[8]);
      break;
    default:
      throw `Unrecognized moveType [${moveType}] in step`;
  }
}
function drawLayer(ctx, layer, position, modifiers) {
  ctx.beginPath();
  try {
    layer.strokes.forEach((s) => drawStroke(ctx, s, position));
  } catch (e) {
    throw `Error in shape [id: ${layer.id}]: ${e}`;
  }
  const fillStyle = (modifiers == null ? void 0 : modifiers.fillStyle) || layer.fillStyle;
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (layer.strokeStyle) {
    ctx.strokeStyle = layer.strokeStyle;
    ctx.lineWidth = layer.lineWidth || 1;
    ctx.stroke();
  }
}
class Canvas {
  static draw(ctx, instructions, modifiers) {
    const drawingPosition = (modifiers == null ? void 0 : modifiers.position) || instructions.position;
    instructions.layers.forEach((l) => {
      var _a;
      const shapeModifiers = (_a = modifiers == null ? void 0 : modifiers.layerModifiers) == null ? void 0 : _a.find((m) => m.id === l.id);
      drawLayer(ctx, l, drawingPosition, shapeModifiers);
    });
  }
  static createLinearGradient(ctx, instructions) {
    const { size, colorStops } = instructions;
    const grd = ctx.createLinearGradient(size[0], size[1], size[2], size[3]);
    colorStops.forEach(([percent, color]) => {
      grd.addColorStop(percent, typeof color === "string" ? color : Color.toString(color));
    });
    return grd;
  }
}
const ScrollerComponent_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "div#scroller.svelte-1cekn6j{pointer-events:none;top:0;position:absolute;width:100%}",
  map: null
};
const ScrollerComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { height } = $$props;
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  $$result.css.add(css$1);
  return `<div id="${"scroller"}"${add_attribute("style", `height: ${height}px`, 0)} class="${"svelte-1cekn6j"}"></div>`;
});
const CanvasComponent_svelte_svelte_type_style_lang = "";
const css = {
  code: "canvas.svelte-sr9e74{position:fixed;width:100%;height:100%}",
  map: null
};
const CanvasComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visual } = $$props;
  let canvasElement;
  let v;
  if ($$props.visual === void 0 && $$bindings.visual && visual !== void 0)
    $$bindings.visual(visual);
  $$result.css.add(css);
  return `
${validate_component(ScrollerComponent, "ScrollerComponent").$$render($$result, { height: v == null ? void 0 : v.maxScrollHeight }, {}, {})}
<canvas class="${"svelte-sr9e74"}"${add_attribute("this", canvasElement, 0)}></canvas>`;
});
function getRandomMovementType() {
  return Random.arrayItemWeighted(
    [0, 1, 3],
    [4, 7, 2]
  );
}
class Member {
  visual;
  movement;
  position;
  rotation;
  color;
  rotationalSpeed;
  speed;
  length;
  constructor(visual, properties) {
    this.visual = visual;
    this.color = properties.color;
    this.rotationalSpeed = properties.rotationalSpeed;
    this.speed = properties.speed;
    this.length = properties.length;
    this.movement = {
      movementType: 0,
      to: this.visual.getRandomOnScreenPoint(),
      following: this
    };
    this.position = this.visual.getRandomOnScreenPoint();
    this.rotation = Random.float(-Math.PI, Math.PI);
  }
  getToPoint() {
    switch (this.movement.movementType) {
      case 3:
        return this.visual.getUserPosition().mousePos;
      case 1:
        return this.movement.following.getTailPoint();
      case 2:
      case 0:
      default:
        return this.movement.to;
    }
  }
  shouldSelectNewToPoint() {
    const toPoint = this.getToPoint();
    return Motion.hasReachedPoint(this.position, toPoint, 30) || this.isOutOfBounds() || Random.odds(1e-3);
  }
  selectNewToPoint() {
    this.movement = {
      movementType: getRandomMovementType(),
      to: this.visual.getRandomOnScreenPoint(),
      following: this.visual.getRandomMember()
    };
  }
  shouldFleeMouse() {
    return this.movement.movementType !== 2 && Motion.hasReachedPoint(this.position, this.visual.getUserPosition().mousePos, 56);
  }
  selectPointAwayFromMouse() {
    this.movement.movementType = 2;
    this.movement.to = Motion.getPointInDirection(this.position, this.rotation + Math.PI, 100);
  }
  move() {
    if (this.shouldSelectNewToPoint()) {
      this.selectNewToPoint();
    }
    const toPoint = this.getToPoint();
    const angleTo = Geometry.getAngleTo(this.position, toPoint);
    this.rotation = Motion.rotateTowardsAngleAtSpeed(this.rotation, angleTo, this.rotationalSpeed);
    this.position = Motion.moveAtAngle(this.position, this.rotation, this.speed);
  }
  draw() {
    throw "Child should implement this function";
  }
  getTailPoint() {
    const { x, y } = this.position;
    return {
      x: x + Math.sin(this.rotation) * this.length,
      y: y + Math.cos(this.rotation) * this.length
    };
  }
  isOutOfBounds() {
    const { W, H } = this.visual.getSize();
    return Motion.isOutOfBounds(this.position, { x: W, y: H });
  }
}
const FISH_ROTATIONAL_SPEED = {
  min: 0.042,
  max: 0.062
};
const FISH_SPEED = {
  min: 3.4,
  max: 4.6
};
const FISH = {
  LENGTH: 32,
  HEAD_ANGLE: Geometry.degToRad(60),
  HEAD_SIZE: 12,
  FIN_POSITION: 16,
  FIN_WIDTH: 10,
  FIN_LENGTH: 8,
  TAIL_START: 28,
  TAIL_ANGLE: Geometry.degToRad(14),
  TAIL_LENGTH: 10
};
const FISH_COLORS = [
  "#f14d10",
  "#d62309",
  "#c7e3ff",
  "#f49d09",
  "#5c4073",
  "#e3495e",
  "#adbccf",
  "#00012e",
  "#df2205",
  "#9f1a0b",
  "#dd2c11"
];
function getFishDrawingInstructions(position, rotation, color) {
  const darkerColorString = Color.toString(Color.getDarkerColor(color, 28));
  const colorString = Color.toString(color);
  const sinRotation = Math.sin(rotation);
  const cosRotation = Math.cos(rotation);
  return {
    position,
    layers: [
      {
        id: "fish-fins",
        strokes: [
          [
            "ellipse",
            sinRotation * FISH.FIN_POSITION,
            cosRotation * FISH.FIN_POSITION,
            FISH.FIN_WIDTH,
            FISH.FIN_LENGTH,
            -rotation,
            Math.PI,
            0,
            false
          ]
        ],
        fillStyle: darkerColorString
      },
      {
        id: "tail",
        strokes: [
          ["moveTo", sinRotation * FISH.TAIL_START, cosRotation * FISH.TAIL_START],
          [
            "lineTo",
            sinRotation * FISH.TAIL_START + Math.sin(rotation - FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH,
            cosRotation * FISH.TAIL_START + Math.cos(rotation - FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH
          ],
          [
            "lineTo",
            sinRotation * FISH.TAIL_START + Math.sin(rotation + FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH,
            cosRotation * FISH.TAIL_START + Math.cos(rotation + FISH.TAIL_ANGLE) * FISH.TAIL_LENGTH
          ]
        ],
        fillStyle: darkerColorString
      },
      {
        id: "fish-half-1",
        strokes: [
          ["moveTo", 0, 0],
          [
            "quadraticCurveTo",
            Math.sin(rotation - FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
            Math.cos(rotation - FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
            sinRotation * FISH.LENGTH,
            cosRotation * FISH.LENGTH
          ]
        ],
        fillStyle: colorString
      },
      {
        id: "fish-half-2",
        strokes: [
          ["moveTo", 0, 0],
          [
            "quadraticCurveTo",
            Math.sin(rotation + FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
            Math.cos(rotation + FISH.HEAD_ANGLE) * FISH.HEAD_SIZE,
            sinRotation * FISH.LENGTH,
            cosRotation * FISH.LENGTH
          ]
        ],
        fillStyle: colorString
      }
    ]
  };
}
class Fish extends Member {
  draw() {
    Canvas.draw(
      this.visual.getContext(),
      getFishDrawingInstructions(this.position, this.rotation, this.color)
    );
  }
}
function makeFish(visual) {
  const properties = {
    color: Color.hexToColor(Random.arrayItem(FISH_COLORS)),
    rotationalSpeed: Random.prop(FISH_ROTATIONAL_SPEED),
    speed: Random.prop(FISH_SPEED),
    length: FISH.LENGTH
  };
  return new Fish(visual, properties);
}
const SWARM = {
  MEMBER_COUNT: 180
};
class SwarmVisual extends Visual {
  layers;
  members;
  constructor(context) {
    super(context);
    this.layers = [];
    this.members = [];
  }
  setup() {
    for (let i = 0; i < SWARM.MEMBER_COUNT; ++i) {
      const member = makeFish(this);
      this.members.push(member);
      this.layers.push(member);
      if (i % 14 === 0) {
        this.layers.push(true);
      }
    }
    this.members.forEach((m) => {
      m.selectNewToPoint();
    });
  }
  drawFrame() {
    this.drawBackground();
    this.layers.forEach((l) => {
      if (typeof l === "boolean") {
        this.drawLayer();
      } else {
        l.move();
        l.draw();
      }
    });
  }
  drawLayer() {
    const grd = this.ctx.createRadialGradient(this.W / 2, this.H / 2, 0, this.W / 2, this.H / 2, this.diagonalLength / 2);
    grd.addColorStop(0, "#51a6d618");
    grd.addColorStop(1, "#1c4da326");
    Canvas.draw(this.ctx, {
      layers: [
        {
          id: "background",
          strokes: [["rect", 0, 0, this.W, this.H]],
          fillStyle: grd
        }
      ]
    });
  }
  drawBackground() {
    Canvas.draw(this.ctx, {
      layers: [
        {
          id: "background",
          strokes: [["rect", 0, 0, this.W, this.H]],
          fillStyle: "#1c4da3"
        }
      ]
    });
  }
  getMembers() {
    return this.members;
  }
  getRandomMember() {
    return Random.arrayItem(this.members);
  }
  getRandomOnScreenPoint() {
    return {
      x: Random.number(0, this.W),
      y: Random.number(0, this.H)
    };
  }
  getRandomInboundsPoint() {
    return {
      x: Random.number(this.W / 6, 5 * this.W / 6),
      y: Random.number(this.H / 6, 5 * this.H / 6)
    };
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(CanvasComponent, "CanvasComponent").$$render($$result, { visual: SwarmVisual }, {}, {})}`;
});
export {
  Page as default
};
